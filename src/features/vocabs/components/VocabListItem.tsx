import {
  Card,
  CircularProgress,
  Icon,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { VocabResponse } from "../../../api/Learnup/models/VocabResponse";
import { playAudio } from "../../../services/audioService";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

type Props = {
  vocab: VocabResponse;
};

export function VocabListItem ({ vocab }: Props) {
  const [isLoadingVoice, setIsLoadingVoice] = useState(false);

  const handlePlayVoice = async () => {
    try {
      setIsLoadingVoice(true);
      await playAudio(`${apiBaseUrl}/Mobile/Files/${vocab.voiceId}`);
    } catch (err) {
      console.error("Failed to play vocab voice:", err);
    } finally {
      setIsLoadingVoice(false);
    }
  };

  return (
    <Card sx={{ p: 2 }}>
      <Stack direction="row" sx={{ alignItems: "flex-start", direction: "rtl" }}>
        <Stack spacing={1.25} sx={{ minWidth: 0, flex: 1, textAlign: "right" }}>
          <Stack
            direction="column"
            spacing={1}
          >
            <Typography>
              {vocab.word}
            </Typography>

            <Typography color="primary">
              {vocab.translation}
            </Typography>
          </Stack>

          <Typography variant="body2">
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
              marginRight: "auto",
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "grey.50",
              color: "primary.main",
              "&:hover": {
                bgcolor: "primary.main",
                color: "primary.contrastText",
                borderColor: "primary.main",
              },
            }}
          >
            {isLoadingVoice ? <CircularProgress size={20} /> : <Icon>volume_up</Icon>}
          </IconButton>
        )}
      </Stack>
    </Card>
  );
}
