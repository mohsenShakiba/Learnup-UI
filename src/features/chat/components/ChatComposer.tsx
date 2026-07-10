import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AppIcon } from "../../../shared/components/AppIcon";

interface ChatComposerProps {
  isStreaming: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
  /** BCP-47 language tag used for speech recognition. */
  lang?: string;
}

// Minimal typings for the Web Speech API, which isn't in the standard DOM lib.
interface SpeechRecognitionResultLike {
  0: { transcript: string; };
}
interface SpeechRecognitionEventLike {
  results: ArrayLike<SpeechRecognitionResultLike>;
}
interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

const getSpeechRecognition = (): SpeechRecognitionCtor | undefined => {
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
};

export function ChatComposer ({ isStreaming, onSend, onStop, lang = "fa-IR" }: ChatComposerProps) {
  const [value, setValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const speechSupported = typeof window !== "undefined" && !!getSpeechRecognition();

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

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const Recognition = getSpeechRecognition();
    if (!Recognition) return;

    const recognition = new Recognition();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const transcript = Array.from({ length: event.results.length }, (_, i) =>
        event.results[i][0].transcript
      )
        .join(" ")
        .trim();
      if (transcript) {
        setValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
      }
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  // Stop any in-flight recognition when the composer unmounts.
  useEffect(() => {
    return () => recognitionRef.current?.stop();
  }, []);

  return (
    <TextField
      fullWidth
      multiline
      maxRows={5}
      placeholder="پیام خود را بنویسید..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      slotProps={{
        input: {
          sx: {
            py: 1,
            px: 0.8,
            borderRadius: 999,
            backgroundColor: "background.paper",
            alignItems: "center",
            fontSize: '14px',
          },
          startAdornment: (
            <InputAdornment position="start">
              {speechSupported && (
                <IconButton
                  size="small"
                  onClick={toggleListening}
                  color={isListening ? "primary" : "default"}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 999,
                  }}
                >
                  <AppIcon sx={{ fontSize: 20 }}>{isListening ? "mic" : "mic_none"}</AppIcon>
                </IconButton>
              )}
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={isStreaming ? onStop : submit}
                disabled={!isStreaming && value.trim().length === 0}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 999,
                  color: "primary.contrastText",
                  backgroundColor: "primary.main",
                  "&:hover": { backgroundColor: "primary.dark" },
                  "&.Mui-disabled": {
                    backgroundColor: "action.disabledBackground",
                    color: "action.disabled",
                  },
                }}
              >
                <AppIcon sx={{ fontSize: 20 }}>{isStreaming ? "pause" : "arrow_upward"}</AppIcon>
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
