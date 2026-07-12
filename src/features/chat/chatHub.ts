import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from "@microsoft/signalr";
import { OpenAPI } from "../../api/Learnup";
import { getAuthToken } from "../../stores/authStore";

const CHAT_STARTED = "ChatStarted";
const CHAT_DELTA = "ChatDelta";
const CHAT_COMPLETED = "ChatCompleted";
const CHAT_FAILED = "ChatFailed";

let connection: HubConnection | null = null;

function getConnection (): HubConnection {
  if (connection) return connection;

  connection = new HubConnectionBuilder()
    .withUrl(`${OpenAPI.BASE}/hubs/chat`, {
      accessTokenFactory: () => getAuthToken() ?? "",
    })
    .withAutomaticReconnect()
    .build();

  return connection;
}

export async function ensureChatHubConnected (): Promise<void> {
  const conn = getConnection();

  if (conn.state === HubConnectionState.Disconnected) {
    await conn.start();
  }
}

export interface ChatHubEvent {
  chatId?: number | null;
}

export interface ChatDeltaEvent extends ChatHubEvent {
  token: string;
}

export interface ChatHubHandlers {
  onStarted?: (event: ChatHubEvent) => void;
  onDelta?: (event: ChatDeltaEvent) => void;
  onCompleted?: (event: ChatHubEvent) => void;
  onFailed?: (event: ChatHubEvent) => void;
}

function getChatId (args: unknown[]): number | null | undefined {
  return (args[0] as any)?.chatId as number | null;
}

export function subscribeToChatHub (handlers: ChatHubHandlers): () => void {
  const conn = getConnection();

  const handleStarted = (...args: unknown[]) => {
    handlers.onStarted?.({ chatId: getChatId(args) });
  };

  const handleCompleted = (...args: unknown[]) => {
    handlers.onCompleted?.({ chatId: getChatId(args) });
  };

  const handleFailed = (...args: unknown[]) => {
    handlers.onFailed?.({ chatId: getChatId(args), });
  };

  const handleDelta = (...args: unknown[]) => {
    const delta = (args[0] as any)?.delta as string | null;

    if (!delta) {
      return;
    }

    handlers.onDelta?.({
      chatId: getChatId(args),
      token: delta,
    });
  };

  conn.on(CHAT_STARTED, handleStarted);
  conn.on(CHAT_DELTA, handleDelta);
  conn.on(CHAT_COMPLETED, handleCompleted);
  conn.on(CHAT_FAILED, handleFailed);

  return () => {
    conn.off(CHAT_STARTED, handleStarted);
    conn.off(CHAT_DELTA, handleDelta);
    conn.off(CHAT_COMPLETED, handleCompleted);
    conn.off(CHAT_FAILED, handleFailed);
  };
}
