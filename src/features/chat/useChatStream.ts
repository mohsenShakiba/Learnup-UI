import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessageResponse, ChatRequest } from "../../api/Learnup";
import { ChatsService } from "../../api/Learnup";
import { toast } from "../../shared/toast";
import { checkError } from "../../utils/GetHttpError";
import { ensureChatHubConnected, subscribeToChatHub } from "./chatHub";

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  pending?: boolean;
  error?: boolean;
}

function makeId (): string {
  return Math.random().toString(16).slice(2);
}

const TOKEN_EXCEED_CODE = "TokenExceed";
const DEFAULT_STREAM_ERROR = "پاسخی دریافت نشد. لطفاً دوباره تلاش کنید.";

function toChatMessage (message: ChatMessageResponse): ChatMessage {
  return {
    id: String(message.id),
    role: message.role === "Assistant" ? "assistant" : "user",
    content: message.content,
  };
}

function updateMessage (
  messages: ChatMessage[],
  id: string,
  patch: Partial<ChatMessage>,
): ChatMessage[] {
  return messages.map((message) =>
    message.id === id ? { ...message, ...patch } : message,
  );
}

function appendAssistantToken (
  messages: ChatMessage[],
  assistantId: string,
  token: string,
): ChatMessage[] {
  return messages.map((message) =>
    message.id === assistantId
      ? { ...message, content: message.content + token, pending: true }
      : message,
  );
}

export interface UseChatStream {
  messages: ChatMessage[];
  isStreaming: boolean;
  isLoadingHistory: boolean;
  isLimitExceed: boolean;
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
  const [isExceedToken, setIsExceedToken] = useState(false);
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

  const patchMessage = useCallback((id: string, patch: Partial<ChatMessage>) => {
    setMessages((prev) => updateMessage(prev, id, patch));
  }, []);

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

      let streamChatId = chatIdRef.current;
      let isDone = false;
      let unsubscribe: (() => void) | undefined;

      const acceptsEvent = (eventChatId?: number | null) => {
        if (eventChatId == null) return true;

        if (streamChatId == null) {
          streamChatId = eventChatId;
          chatIdRef.current = eventChatId;
          return true;
        }

        return eventChatId === streamChatId;
      };

      const cleanup = () => {
        unsubscribe?.();
        unsubscribe = undefined;
        if (cancelRef.current === cancel) {
          cancelRef.current = null;
        }
      };

      const cancel = () => {
        isDone = true;
        cleanup();
      };

      const finish = (patch?: Partial<ChatMessage>) => {
        if (isDone) return false;
        isDone = true;
        if (patch) patchMessage(assistantId, patch);
        setIsStreaming(false);
        cleanup();
        return true;
      };

      const fail = (message = DEFAULT_STREAM_ERROR) => {
        if (finish({ content: message, pending: false, error: true })) {
          toast.error("خطا در دریافت پاسخ");
        }
      };

      unsubscribe = subscribeToChatHub({
        onStarted: ({ chatId }) => {
          if (!acceptsEvent(chatId)) return;
          if (chatId != null) chatIdRef.current = chatId;
        },
        onCompleted: ({ chatId }) => {
          if (!acceptsEvent(chatId)) return;
          finish({ pending: false });
        },
        onFailed: ({ chatId }) => {
          if (!acceptsEvent(chatId)) return;
          fail();
        },
        onDelta: ({ chatId, token }) => {
          if (!token || !acceptsEvent(chatId)) return;
          setMessages((prev) => appendAssistantToken(prev, assistantId, token));
        },
      });

      cancelRef.current = cancel;

      try {
        await ensureChatHubConnected();
        const request: ChatRequest = {
          chatId: streamChatId,
          message: content,
        };
        const response = await ChatsService.chatWithAi(request);
        if (response.chatId != null) {
          streamChatId = response.chatId;
          chatIdRef.current = response.chatId;
        }
      } catch (error) {
        const isTokenExceed = checkError(error, TOKEN_EXCEED_CODE);
        if (isTokenExceed) {
          setIsExceedToken(true);
          finish({ pending: false });
        } else {
          fail();
        }
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
    isLimitExceed: isExceedToken,
    send,
    stop,
  };
}
