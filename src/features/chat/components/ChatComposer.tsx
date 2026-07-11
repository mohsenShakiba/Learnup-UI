import { Box, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
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

const RTL_CHARS = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
const LTR_CHARS = /[A-Za-z\u00C0-\u024F\u1E00-\u1EFF]/;
const PLACEHOLDER_FADE_MS = 280;
const PLACEHOLDER_ROTATION_MS = 3400;
const SEARCH_SUGGESTIONS = [
  "معنی دقیق «serendipity» رو پیدا کن",
  "فرق present perfect و past simple چیه؟",
  "برای آیلتس لغت‌های سفر رو تمرین کن",
  "ازم فعل‌های بی‌قاعده انگلیسی بپرس",
  "این جمله رو طبیعی‌تر کن: I really like it",
  "یک مکالمه کوتاه برای سفارش قهوه بساز",
];

function getInputDirection (text: string): "rtl" | "ltr" {
  for (const char of text.trimStart()) {
    if (RTL_CHARS.test(char)) return "rtl";
    if (LTR_CHARS.test(char)) return "ltr";
  }
  return "rtl";
}

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
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(true);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const inputDirection = getInputDirection(value);
  const placeholder = SEARCH_SUGGESTIONS[placeholderIndex];

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

  useEffect(() => {
    let fadeTimeout: number | undefined;
    const rotationInterval = window.setInterval(() => {
      setIsPlaceholderVisible(false);
      fadeTimeout = window.setTimeout(() => {
        setPlaceholderIndex((current) => (current + 1) % SEARCH_SUGGESTIONS.length);
        setIsPlaceholderVisible(true);
      }, PLACEHOLDER_FADE_MS);
    }, PLACEHOLDER_ROTATION_MS);

    return () => {
      window.clearInterval(rotationInterval);
      if (fadeTimeout !== undefined) window.clearTimeout(fadeTimeout);
    };
  }, []);

  return (
    <Box sx={{ position: "relative" }}>
      <TextField
        fullWidth
        multiline
        maxRows={5}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        sx={{
          "& .MuiOutlinedInput-root": { border: "none", borderRadius: 0 },
          "& .MuiOutlinedInput-notchedOutline": { border: "none" },
          "& textarea": {
            direction: inputDirection === 'rtl' ? 'ltr' : 'rtl',
            textAlign: inputDirection === 'rtl' ? 'left' : 'right'
          },
        }}
        slotProps={{
          htmlInput: {
            dir: inputDirection === 'rtl' ? 'ltr' : 'rtl',
          },
          input: {
            sx: {
              py: 1,
              px: 0.8,
              borderRadius: 0,
              backgroundColor: "transparent",
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
                      width: 35,
                      height: 35,
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
                    width: 35,
                    height: 35,
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

      {!value && (
        <Typography
          aria-hidden="true"
          variant="body2"
          sx={(theme) => ({
            position: "absolute",
            top: "50%",
            left: speechSupported ? 50 : 12,
            right: 50,
            transform: "translateY(-50%)",
            color: "text.secondary",
            fontSize: 14,
            lineHeight: 1.4,
            opacity: isPlaceholderVisible ? 0.64 : 0,
            overflow: "hidden",
            pointerEvents: "none",
            textAlign: "left",
            textOverflow: "ellipsis",
            transition: theme.transitions.create("opacity", {
              duration: PLACEHOLDER_FADE_MS,
              easing: theme.transitions.easing.easeInOut,
            }),
            whiteSpace: "nowrap",
          })}
        >
          {placeholder}
        </Typography>
      )}
    </Box>
  );
}
