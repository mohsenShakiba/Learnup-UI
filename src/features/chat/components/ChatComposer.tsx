import { Box, IconButton, TextField } from "@mui/material";
import { useState, type KeyboardEvent } from "react";
import { AppIcon } from "../../../shared/components/AppIcon";

interface ChatComposerProps {
  isStreaming: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
}

export function ChatComposer ({ isStreaming, onSend, onStop }: ChatComposerProps) {
  const [value, setValue] = useState("");

  const submit = () => {
    const text = value.trim();
    if (!text || isStreaming) return;
    onSend(text);
    setValue("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
      <TextField
        fullWidth
        multiline
        maxRows={5}
        placeholder="پیام خود را بنویسید..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        slotProps={{ input: { sx: { borderRadius: 3, py: 1 } } }}
      />
      <IconButton
        aria-label={isStreaming ? "توقف" : "ارسال"}
        onClick={isStreaming ? onStop : submit}
        disabled={!isStreaming && value.trim().length === 0}
        sx={{
          width: 48,
          height: 48,
          flexShrink: 0,
          color: "primary.contrastText",
          backgroundColor: "primary.main",
          "&:hover": { backgroundColor: "primary.dark" },
          "&.Mui-disabled": {
            backgroundColor: "action.disabledBackground",
            color: "action.disabled",
          },
        }}
      >
        <AppIcon>{isStreaming ? "pause" : "send"}</AppIcon>
      </IconButton>
    </Box>
  );
}
