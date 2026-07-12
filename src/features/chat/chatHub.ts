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

/**
 * Resolved lazily because `OpenAPI.BASE` is populated after module import.
 */
function getHubUrl (): string {
  return (
    (import.meta.env.VITE_CHAT_HUB_URL as string | undefined) ??
    `${(OpenAPI.BASE ?? "").replace(/\/$/, "")}/hubs/chat`
  );
}

let connection: HubConnection | null = null;

function getConnection (): HubConnection {
  if (connection) return connection;

  connection = new HubConnectionBuilder()
    .withUrl(getHubUrl(), {
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

export interface ChatFailedEvent extends ChatHubEvent {
  error: unknown;
}

export interface ChatHubHandlers {
  onStarted?: (event: ChatHubEvent) => void;
  onDelta?: (event: ChatDeltaEvent) => void;
  onCompleted?: (event: ChatHubEvent) => void;
  onFailed?: (event: ChatFailedEvent) => void;
}

function toChatId (value: unknown): number | null | undefined {
  if (value == null) return value;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function readObjectProp (value: unknown, key: string): unknown {
  if (!value || typeof value !== "object" || !(key in value)) return undefined;
  return (value as Record<string, unknown>)[key];
}

function eventChatId (args: unknown[]): number | null | undefined {
  for (const arg of args) {
    const objectChatId = toChatId(readObjectProp(arg, "chatId"));
    if (objectChatId !== undefined) return objectChatId;
  }

  return toChatId(args.find((arg) => typeof arg === "number"));
}

function eventText (args: unknown[], keys: string[]): string {
  for (const arg of args) {
    if (typeof arg === "string") return arg;

    for (const key of keys) {
      const value = readObjectProp(arg, key);
      if (typeof value === "string") return value;
    }
  }

  return "";
}

export function subscribeToChatHub (handlers: ChatHubHandlers): () => void {
  const conn = getConnection();

  const handleStarted = (...args: unknown[]) => {
    handlers.onStarted?.({ chatId: eventChatId(args) });
  };

  const handleDelta = (...args: unknown[]) => {
    handlers.onDelta?.({
      chatId: eventChatId(args),
      token: eventText(args, ["delta", "token", "chunk", "content", "message"]),
    });
  };

  const handleCompleted = (...args: unknown[]) => {
    handlers.onCompleted?.({ chatId: eventChatId(args) });
  };

  const handleFailed = (...args: unknown[]) => {
    handlers.onFailed?.({
      chatId: eventChatId(args),
      error: eventText(args, ["error", "reason", "message"]) || args[0],
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
