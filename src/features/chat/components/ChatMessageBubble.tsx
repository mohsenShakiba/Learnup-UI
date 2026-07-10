import { Box, Paper, Typography } from "@mui/material";
import type { ChatMessage } from "../useChatStream";
import { MarkdownMessage } from "./MarkdownMessage";

// Persian/Arabic Unicode ranges. If the text contains any of these characters
// we treat it as Farsi and render right-to-left, otherwise left-to-right.
const RTL_CHARS = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/;

function getDirection (text: string): "rtl" | "ltr" {
  return RTL_CHARS.test(text) ? "rtl" : "ltr";
}
function TypingDots () {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, py: 0.5 }}>
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            backgroundColor: "text.secondary",
            opacity: 0.5,
            animation: "chatBounce 1.2s infinite ease-in-out",
            animationDelay: `${i * 0.16}s`,
            "@keyframes chatBounce": {
              "0%, 80%, 100%": { transform: "scale(0.6)", opacity: 0.3 },
              "40%": { transform: "scale(1)", opacity: 0.9 },
            },
          }}
        />
      ))}
    </Box>
  );
}

export function ChatMessageBubble ({ message }: { message: ChatMessage; }) {
  const isUser = message.role === "user";
  const showTyping = message.pending && message.content.length === 0;
  const direction = getDirection(message.content);

  console.log('direction is', message.content, direction);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-start" : "flex-end",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: "90%",
          borderRadius: '16px',
          borderTopLeftRadius: isUser ? 0 : '16px',
          borderTopRightRadius: isUser ? '16px' : 0,
          border: '1px solid',
          borderColor: isUser ? "transparent" : "divider",
          backgroundColor: isUser ? "primary.main" : "background.paper",
          color: isUser ? "primary.contrastText" : "text.primary",
        }}
      >
        {showTyping ? (
          <TypingDots />
        ) : isUser ? (
          <Typography
            variant="body2"
            dir={direction}
            sx={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              direction: direction === 'rtl' ? 'ltr' : 'rtl'
            }}
          >
            {message.content}
          </Typography>
        ) : (
          <Box dir={direction} sx={{ direction: direction === 'rtl' ? 'ltr' : 'rtl' }}>
            <MarkdownMessage content={message.content} />
          </Box>
        )}
      </Paper>
    </Box>
  );
}
