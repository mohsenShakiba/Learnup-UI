import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessageResponse, ChatRequest } from "../../api/Learnup";
import { ApiError, ChatsService } from "../../api/Learnup";
import { dialogStore } from "../../shared/dialog/dialogStore";
import { toast } from "../../shared/toast";
import { ensureChatHubConnected, subscribeToChatHub } from "./chatHub";
import { TokenExceededDialog } from "./components/TokenExceededDialog";

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

const TOKEN_EXCEED_CODE = "TokenExceed";
const TOKEN_EXCEEDED_MESSAGE =
  "اعتبار گفتگوی هوش مصنوعی شما کافی نیست. لطفاً اشتراک خود را تمدید کنید یا بعداً دوباره تلاش کنید.";

function containsTokenExceedCode (value: unknown): boolean {
  if (typeof value === "string") return value.includes(TOKEN_EXCEED_CODE);
  if (value instanceof Error) {
    return containsTokenExceedCode(value.message) ||
      containsTokenExceedCode(value.cause);
  }
  if (value && typeof value === "object") {
    try {
      return JSON.stringify(value).includes(TOKEN_EXCEED_CODE);
    } catch {
      return false;
    }
  }
  return false;
}

function isTokenExceedError (error: unknown): boolean {
  if (error instanceof ApiError) {
    return containsTokenExceedCode(error.body);
  }
  return containsTokenExceedCode(error);
}

function toChatMessage (message: ChatMessageResponse): ChatMessage {
  return {
    id: String(message.id),
    role: message.role === "Assistant" ? "assistant" : "user",
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
 * assistant bubble. The request is sent over REST, while SignalR is only used
 * to receive the ChatStarted/ChatDelta/ChatCompleted/ChatFailed events.
 */
export function useChatStream (initialChatId?: number): UseChatStream {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(
    initialChatId != null,
  );

  const chatIdRef = useRef<number | null>(initialChatId ?? null);
  const cancelRef = useRef<(() => void) | null>(null);

  // Load prior messages when resuming an existing chat.
  useEffect(() => {
    if (initialChatId == null) return;
    let cancelled = false;

    setIsLoadingHistory(true);
    ChatsService.getChat(initialChatId)
      .then((chat) => {
        if (cancelled) return;
        chatIdRef.current = chat.id;
        setMessages(chat.messages.map(toChatMessage));
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
  }, [initialChatId]);

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

      const request: ChatRequest = {
        chatId: chatIdRef.current,
        message: content,
      };

      let activeChatId = request.chatId;
      let finished = false;

      const acceptsEvent = (eventChatId?: number | null) => {
        if (eventChatId == null) return true;

        if (activeChatId == null) {
          activeChatId = eventChatId;
          chatIdRef.current = eventChatId;
          return true;
        }

        return eventChatId === activeChatId;
      };

      let unsubscribe: (() => void) | null = null;

      const cleanup = () => {
        unsubscribe?.();
        unsubscribe = null;
        if (cancelRef.current === cancel) {
          cancelRef.current = null;
        }
      };

      const cancel = () => {
        finished = true;
        cleanup();
      };

      const finalize = () => {
        if (finished) return;
        finished = true;
        patchMessage(assistantId, { pending: false });
        setIsStreaming(false);
        cleanup();
      };

      const showTokenExceeded = () => {
        if (finished) return;
        finished = true;
        patchMessage(assistantId, {
          content: TOKEN_EXCEEDED_MESSAGE,
          pending: false,
          error: true,
        });
        dialogStore.show(TokenExceededDialog);
        setIsStreaming(false);
        cleanup();
      };

      const failReply = (errorMessage = "پاسخی دریافت نشد. لطفاً دوباره تلاش کنید.") => {
        if (finished) return;
        finished = true;
        patchMessage(assistantId, {
          content: errorMessage,
          pending: false,
          error: true,
        });
        setIsStreaming(false);
        cleanup();
        toast.error("خطا در دریافت پاسخ");
      };

      unsubscribe = subscribeToChatHub({
        onStarted: ({ chatId }) => {
          if (!acceptsEvent(chatId)) return;
          if (chatId != null) chatIdRef.current = chatId;
        },
        onCompleted: ({ chatId }) => {
          if (!acceptsEvent(chatId)) return;
          finalize();
        },
        onFailed: ({ chatId }) => {
          if (!acceptsEvent(chatId)) return;
          failReply();
        },
        onDelta: ({ chatId, token }) => {
          if (!token || !acceptsEvent(chatId)) return;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? {
                ...m,
                content: m.content + token,
                pending: true,
              } : m,
            ),
          );
        },
      });

      cancelRef.current = cancel;

      try {
        await ensureChatHubConnected();
        const response = await ChatsService.chatWithAi(request);
        if (response.chatId != null) {
          activeChatId = response.chatId;
          chatIdRef.current = response.chatId;
        }
      } catch (error) {
        if (isTokenExceedError(error)) {
          showTokenExceeded();
          return;
        }

        failReply();
      }
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

  return {
    messages,
    isStreaming,
    isLoadingHistory,
    send,
    stop,
  };
}
