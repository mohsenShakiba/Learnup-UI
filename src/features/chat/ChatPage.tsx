import { Box, IconButton, Stack, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { AppIcon } from "../../shared/components/AppIcon";
import { AppLoader } from "../../shared/components/AppLoader";
import { DefaultHeader } from "../../shared/components/DefaultHeader";
import { Scaffold } from "../../shared/components/Scaffold";
import { ChatComposer } from "./components/ChatComposer";
import { ChatMessageBubble } from "./components/ChatMessageBubble";
import { ConversationListDrawer } from "./components/ConversationListDrawer";
import { useChatStream } from "./useChatStream";

export default function ChatPage () {
  const { chatId } = useParams();
  const parsedId = chatId ? Number(chatId) : undefined;
  const currentId = Number.isFinite(parsedId) ? parsedId : undefined;

  // Remount on chat change so the stream state fully resets between
  // threads (the "new chat" case included), rather than leaking prior messages.
  return <ChatView key={currentId ?? "new"} chatId={currentId} />;
}

function ChatView ({ chatId }: { chatId?: number; }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { messages, isStreaming, isLoadingHistory, send, stop } = useChatStream(chatId);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Keep the newest message in view as replies stream in by scrolling the
  // surrounding scroll container to the bottom.
  useEffect(() => {
    const container = bottomRef.current?.parentElement;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const isEmpty = messages.length === 0 && !isLoadingHistory;

  return (
    <Scaffold disablePadding header={
      <DefaultHeader header="دستیار هوشمند">
        <IconButton onClick={() => setDrawerOpen(true)}>
          <AppIcon>conversation</AppIcon>
        </IconButton>
      </DefaultHeader>
    }>

      <ConversationListDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        currentConversationId={chatId}
      />

      <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
        {isLoadingHistory ? (
          <AppLoader />
        ) : isEmpty ? (
          <Stack
            spacing={1}
            sx={{
              alignItems: "center",
              justifyContent: "center",
              color: "text.secondary",
              textAlign: "center",
              mt: 4
            }}
          >
            <AppIcon sx={{ fontSize: 56, opacity: 0.3 }}>chat_bubble</AppIcon>
            <Typography variant="body1">دستیار هوشمند</Typography>
            <Typography variant="caption" sx={{ opacity: 0.9, maxWidth: 280 }}>
              هر سوالی درباره‌ی زبان، گرامر یا لغات داری بپرس.
            </Typography>

            <Typography variant="caption" sx={{ opacity: 0.7, maxWidth: 280 }}>
              می‌تونی تایپ کنی یا با میکروفون صحبت کنی.
            </Typography>
          </Stack>
        ) : (
          <Stack spacing={2} sx={{ pb: 2 }}>
            {messages.map((message) => (
              <ChatMessageBubble key={message.id} message={message} />
            ))}
          </Stack>
        )}
      </Box>

      <Box
        sx={{
          pt: 1,
          px: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.default',
        }}
      >
        <ChatComposer isStreaming={isStreaming} onSend={send} onStop={stop} />
      </Box>

    </Scaffold>
  );
}
