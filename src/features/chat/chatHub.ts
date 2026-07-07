import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  type ISubscription,
} from "@microsoft/signalr";
import type { ChatRequest } from "../../api/Learnup";
import { OpenAPI } from "../../api/Learnup";
import { getAuthToken } from "../../stores/authStore";

/**
 * SignalR hub used for streaming AI chat tokens.
 *
 * Expected backend contract (see notes to backend if not yet implemented):
 *   - Hub mapped at `${API_BASE}/hubs/chat` (override with VITE_CHAT_HUB_URL).
 *   - A server-to-client streaming method:
 *
 *       public ChannelReader<string> StreamChat(ChatRequest request)
 *
 *     that yields the assistant reply one token/chunk at a time and completes
 *     when the reply is finished. Auth is the same JWT used for REST calls,
 *     forwarded via the `access_token` query string by SignalR.
 *
 * Until that hub exists the chat page transparently falls back to the plain
 * REST endpoint `AiService.chatWithAi` (see useChatStream), so the UI works
 * today and gains streaming automatically once the hub is deployed.
 */

const HUB_URL =
  (import.meta.env.VITE_CHAT_HUB_URL as string | undefined) ??
  `${(OpenAPI.BASE ?? "").replace(/\/$/, "")}/hubs/chat`;

/** The method name invoked for the streaming reply. */
const STREAM_METHOD = "StreamChat";

let connection: HubConnection | null = null;

function getConnection (): HubConnection {
  if (connection) return connection;

  connection = new HubConnectionBuilder()
    .withUrl(HUB_URL, {
      accessTokenFactory: () => getAuthToken() ?? "",
    })
    .withAutomaticReconnect()
    .build();

  return connection;
}

async function ensureConnected (): Promise<HubConnection> {
  const conn = getConnection();
  if (conn.state === HubConnectionState.Disconnected) {
    await conn.start();
  }
  return conn;
}

export interface ChatStreamHandlers {
  onToken: (chunk: string) => void;
  onComplete: () => void;
  onError: (error: unknown) => void;
}

/**
 * Streams the assistant reply for `request`, invoking `onToken` for each chunk.
 * Returns a cancel function that aborts the stream (e.g. on unmount).
 */
export function streamChat (
  request: ChatRequest,
  handlers: ChatStreamHandlers,
): () => void {
  let subscription: ISubscription<string> | null = null;
  let cancelled = false;

  ensureConnected()
    .then((conn) => {
      if (cancelled) return;
      subscription = conn
        .stream<string>(STREAM_METHOD, request)
        .subscribe({
          next: handlers.onToken,
          complete: handlers.onComplete,
          error: handlers.onError,
        });
    })
    .catch(handlers.onError);

  return () => {
    cancelled = true;
    subscription?.dispose();
  };
}
