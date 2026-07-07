import { Box, Paper, Typography } from "@mui/material";
import type { ChatMessage } from "../useChatStream";

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

export function ChatMessageBubble ({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const showTyping = message.pending && message.content.length === 0;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: "82%",
          px: 1.75,
          py: 1.25,
          borderRadius: 3,
          borderStartStartRadius: isUser ? 3 : 0.5,
          borderStartEndRadius: isUser ? 0.5 : 3,
          backgroundColor: isUser ? "primary.main" : "action.hover",
          color: isUser ? "primary.contrastText" : "text.primary",
          border: message.error ? "1px solid" : "none",
          borderColor: message.error ? "error.main" : "transparent",
        }}
      >
        {showTyping ? (
          <TypingDots />
        ) : (
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              lineHeight: 1.7,
            }}
          >
            {message.content}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
