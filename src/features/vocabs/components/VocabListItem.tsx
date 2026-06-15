import {
  Box,
  Card,
  CircularProgress,
  Icon,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import type { VocabResponse } from "../../../api/Learnup/models/VocabResponse";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

type Props = {
  vocab: VocabResponse;
};

export function VocabListItem({ vocab }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [isLoadingVoice, setIsLoadingVoice] = useState(false);

  useEffect(
    () => () => {
      audioRef.current?.pause();
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    },
    [],
  );

  const handlePlayVoice = async () => {
    try {
      setIsLoadingVoice(true);

      if (!audioRef.current) {
        const response = await fetch(
          `${apiBaseUrl}/Mobile/Files/${vocab.voiceId}`,
        );

        if (!response.ok) {
          throw new Error(`Failed to load voice for vocab ${vocab.id}`);
        }

        objectUrlRef.current = URL.createObjectURL(await response.blob());
        audioRef.current = new Audio(objectUrlRef.current);
      }

      audioRef.current.currentTime = 0;
      await audioRef.current.play();
    } catch (err) {
      console.error("Failed to play vocab voice:", err);
    } finally {
      setIsLoadingVoice(false);
    }
  };

  return (
    <Card
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 4,
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
        transition: "transform 180ms ease, box-shadow 180ms ease",
        "&::before": {
          content: '""',
          position: "absolute",
          insetBlockStart: 0,
          insetInlineStart: 0,
          insetInlineEnd: 0,
          height: 4,
          background:
            "linear-gradient(90deg, rgba(25,118,210,0.95) 0%, rgba(38,166,154,0.95) 100%)",
        },
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 18px 44px rgba(15, 23, 42, 0.12)",
        },
      }}
    >
      <Stack
        direction="row"
        sx={{
          alignItems: "flex-start",
          direction: "rtl",
          width: "100%",
        }}
      >
        <Stack spacing={1.25} sx={{ minWidth: 0, flex: 1, textAlign: "right" }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "flex-start",
              justifyContent: "space-between",
              flexWrap: "wrap",
              rowGap: 0.75,
              direction: "rtl",
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  lineHeight: 1.3,
                  color: "text.primary",
                  wordBreak: "break-word",
                  textAlign: "right",
                }}
              >
                {vocab.word}
              </Typography>
            </Box>
            {vocab.translation && (
              <Typography
                sx={{
                  flexShrink: 0,
                  alignSelf: "flex-start",
                  borderRadius: 999,
                  px: 1.1,
                  py: 0.45,
                  bgcolor: (theme) => theme.palette.primary.main + "14",
                  color: "primary.main",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  lineHeight: 1,
                  textAlign: "center",
                }}
              >
                {vocab.translation}
              </Typography>
            )}
          </Stack>

          <Typography
            sx={{
              color: "text.secondary",
              fontSize: "0.92rem",
              lineHeight: 1.7,
              display: "-webkit-box",
              overflow: "hidden",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              textAlign: "right",
            }}
          >
            {vocab.description}
          </Typography>
        </Stack>

        {vocab.voiceId && (
          <IconButton
            onClick={() => void handlePlayVoice()}
            disabled={isLoadingVoice}
            sx={{
              flexShrink: 0,
              alignSelf: "center",
              width: 44,
              height: 44,
              p: 0,
              m: 0,
              marginRight: "auto",
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "grey.50",
              color: "primary.main",
              transition: "all 180ms ease",
              "&:hover": {
                bgcolor: "primary.main",
                color: "primary.contrastText",
                borderColor: "primary.main",
              },
              "&.Mui-disabled": {
                bgcolor: "action.hover",
                borderColor: "divider",
              },
            }}
          >
            {isLoadingVoice ? (
              <CircularProgress size={20} />
            ) : (
              <Icon>volume_up</Icon>
            )}
          </IconButton>
        )}
      </Stack>
    </Card>
  );
}
