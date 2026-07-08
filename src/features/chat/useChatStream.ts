import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessageResponse, ChatRequest } from "../../api/Learnup";
import { AiService, ConversationsService } from "../../api/Learnup";
import { toast } from "../../shared/toast";
import { streamChat } from "./chatHub";

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  /** True while the assistant reply is still streaming in. */
  pending?: boolean;
  /** True when the reply failed to be generated. */
  error?: boolean;
}

function makeId (): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function toChatMessage (message: ChatMessageResponse): ChatMessage {
  return {
    id: String(message.id),
    role: message.role === "assistant" ? "assistant" : "user",
    content: message.content,
  };
}

export interface UseChatStream {
  messages: ChatMessage[];
  isStreaming: boolean;
  isLoadingHistory: boolean;
  send: (text: string) => void;
  stop: () => void;
}

/**
 * Owns the chat message list and the send/stream lifecycle.
 *
 * Sending a message optimistically appends the user's message plus a pending
 * assistant bubble, then streams tokens into that bubble over SignalR. If the
 * hub is unavailable (or errors before any token arrives) it falls back to the
 * REST `AiService.chatWithAi` endpoint so a reply is still produced.
 */
export function useChatStream (initialConversationId?: number): UseChatStream {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(
    initialConversationId != null,
  );

  const conversationIdRef = useRef<number | null>(initialConversationId ?? null);
  const cancelRef = useRef<(() => void) | null>(null);

  // Load prior messages when resuming an existing conversation.
  useEffect(() => {
    if (initialConversationId == null) return;
    let cancelled = false;

    setIsLoadingHistory(true);
    ConversationsService.getConversation(initialConversationId)
      .then((conversation) => {
        if (cancelled) return;
        conversationIdRef.current = conversation.id;
        setMessages(conversation.messages.map(toChatMessage));
      })
      .catch(() => {
        if (!cancelled) toast.error("خطا در بارگذاری گفتگو");
      })
      .finally(() => {
        if (!cancelled) setIsLoadingHistory(false);
      });

    return () => {
      cancelled = true;
    };
  }, [initialConversationId]);

  // Abort any in-flight stream on unmount.
  useEffect(() => {
    return () => cancelRef.current?.();
  }, []);

  const patchMessage = useCallback(
    (id: string, patch: Partial<ChatMessage>) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...patch } : m)),
      );
    },
    [],
  );

  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || isStreaming) return;

      const assistantId = makeId();
      setMessages((prev) => [
        ...prev,
        { id: makeId(), role: "user", content },
        { id: assistantId, role: "assistant", content: "", pending: true },
      ]);
      setIsStreaming(true);

      // A stable conversation id lets the stream and REST fallback agree on the
      // same thread; start one lazily on the first message.
      if (conversationIdRef.current == null) {
        try {
          const conversation = await ConversationsService.startConversation();
          conversationIdRef.current = conversation.id;
        } catch {
          // Non-fatal: chatWithAi accepts a null conversationId and creates one.
        }
      }

      const request: ChatRequest = {
        conversationId: conversationIdRef.current,
        message: content,
      };

      const finalize = () => {
        patchMessage(assistantId, { pending: false });
        setIsStreaming(false);
        cancelRef.current = null;
      };

      const fallbackToRest = async () => {
        try {
          const response = await AiService.chatWithAi(request);
          conversationIdRef.current = response.conversationId;
          patchMessage(assistantId, {
            content: response.reply,
            pending: false,
          });
        } catch {
          patchMessage(assistantId, {
            content: "پاسخی دریافت نشد. لطفاً دوباره تلاش کنید.",
            pending: false,
            error: true,
          });
          toast.error("خطا در دریافت پاسخ");
        } finally {
          setIsStreaming(false);
          cancelRef.current = null;
        }
      };

      let receivedAnyToken = false;

      cancelRef.current = streamChat(request, {
        onToken: (chunk) => {
          receivedAnyToken = true;
          console.log("[useChatStream] onToken:", chunk);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: m.content + chunk, pending: true }
                : m,
            ),
          );
        },
        onComplete: () => {
          console.log("[useChatStream] onComplete, receivedAnyToken =", receivedAnyToken);
          finalize();
        },
        onError: (error) => {
          console.error("[useChatStream] onError, receivedAnyToken =", receivedAnyToken, error);
          // If the hub never produced a token, the reply is still fully
          // recoverable over REST; otherwise keep the partial text we have.
          if (receivedAnyToken) finalize();
          else void fallbackToRest();
        },
      });
    },
    [isStreaming, patchMessage],
  );

  const stop = useCallback(() => {
    cancelRef.current?.();
    cancelRef.current = null;
    setIsStreaming(false);
    setMessages((prev) =>
      prev.map((m) => (m.pending ? { ...m, pending: false } : m)),
    );
  }, []);

  return { messages, isStreaming, isLoadingHistory, send, stop };
}
