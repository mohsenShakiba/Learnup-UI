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

/**
 * Resolved lazily (not at module load) because `OpenAPI.BASE` is only populated
 * once `setupOpenApi()` runs, which happens after this module is imported. A
 * top-level const would capture an empty base and negotiate against the frontend
 * origin instead of the API server (→ 404).
 */
function getHubUrl (): string {
  return (
    (import.meta.env.VITE_CHAT_HUB_URL as string | undefined) ??
    `${(OpenAPI.BASE ?? "").replace(/\/$/, "")}/hubs/chat`
  );
}

/** The method name invoked for the streaming reply. */
const STREAM_METHOD = "StreamReply";

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

async function ensureConnected (): Promise<HubConnection> {
  const conn = getConnection();
  console.log("[chatHub] ensureConnected: current state =", conn.state, "url =", getHubUrl());
  if (conn.state === HubConnectionState.Disconnected) {
    console.log("[chatHub] starting connection…");
    await conn.start();
    console.log("[chatHub] connection started, state =", conn.state);
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

  console.log("[chatHub] streamChat invoked with request:", request);

  ensureConnected()
    .then((conn) => {
      if (cancelled) {
        console.log("[chatHub] streamChat cancelled before subscribe");
        return;
      }
      console.log("[chatHub] subscribing to stream method:", STREAM_METHOD);
      // The hub method takes positional args (chatId, message); the
      // CancellationToken is supplied server-side by SignalR, not from here.
      subscription = conn
        .stream<string>(STREAM_METHOD, request.chatId, request.message)
        .subscribe({
          next: (chunk) => {
            console.log("[chatHub] stream next (token):", chunk);
            handlers.onToken(chunk);
          },
          complete: () => {
            console.log("[chatHub] stream complete");
            handlers.onComplete();
          },
          error: (error) => {
            console.error("[chatHub] stream error:", error);
            handlers.onError(error);
          },
        });
    })
    .catch((error) => {
      console.error("[chatHub] ensureConnected/subscribe failed:", error);
      handlers.onError(error);
    });

  return () => {
    cancelled = true;
    subscription?.dispose();
  };
}
