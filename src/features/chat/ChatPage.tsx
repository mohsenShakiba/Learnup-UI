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

const CONTENT_MAX_WIDTH = 500;

export default function ChatPage () {
  const { conversationId } = useParams();
  const parsedId = conversationId ? Number(conversationId) : undefined;
  const currentId = Number.isFinite(parsedId) ? parsedId : undefined;

  // Remount on conversation change so the stream state fully resets between
  // threads (the "new chat" case included), rather than leaking prior messages.
  return <ChatView key={currentId ?? "new"} conversationId={currentId} />;
}

function ChatView ({ conversationId }: { conversationId?: number; }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { messages, isStreaming, isLoadingHistory, send, stop } =
    useChatStream(conversationId);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Keep the newest message in view as replies stream in.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  const isEmpty = messages.length === 0 && !isLoadingHistory;

  return (
    <Scaffold header={
      <DefaultHeader header="دستیار هوشمند">
        <IconButton onClick={() => setDrawerOpen(true)}>
          <AppIcon>conversation</AppIcon>
        </IconButton>
      </DefaultHeader>
    }>

      <ConversationListDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        currentConversationId={conversationId}
      />

      <Box
        component="main"
        sx={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          maxWidth: CONTENT_MAX_WIDTH,
          mx: "auto",
          px: 2,
          py: 2,
          overflowY: "auto",
        }}
      >
        {isLoadingHistory ? (
          <AppLoader />
        ) : isEmpty ? (
          <Stack
            spacing={1}
            sx={{
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "text.secondary",
              textAlign: "center",
            }}
          >
            <AppIcon sx={{ fontSize: 56, opacity: 0.3 }}>chat_bubble</AppIcon>
            <Typography variant="body1">دستیار هوشمند</Typography>
            <Typography variant="caption" sx={{ opacity: 0.8, maxWidth: 280 }}>
              هر سوالی درباره‌ی زبان، گرامر یا لغات داری بپرس.
            </Typography>
          </Stack>
        ) : (
          <Stack spacing={1.5}>
            {messages.map((message) => (
              <ChatMessageBubble key={message.id} message={message} />
            ))}
          </Stack>
        )}
        <Box ref={bottomRef} />
      </Box>

      <ChatComposer isStreaming={isStreaming} onSend={send} onStop={stop} />
    </Scaffold>
  );
}
