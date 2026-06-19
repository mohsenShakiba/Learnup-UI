import {
  Box,
  Card,
  Icon,
  IconButton,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { LeitnerBoxService } from "../../../api/Learnup";
import type { VocabResponse } from "../../../api/Learnup/models/VocabResponse";
import { VocabPlayButton } from "./VocabPlayButton";

type Props = {
  vocab: VocabResponse;
};

export function VocabListItem({ vocab }: Props) {
  const [open, setOpen] = useState(false);

  const addToLeitnerMutation = useMutation({
    mutationFn: () => LeitnerBoxService.addVocabToLeitnerBox(vocab.id),
    onSuccess: () => {
      setOpen(true);
    },
  });

  return (
    <Card sx={{ p: 2 }}>
      <Stack
        direction="row"
        sx={{ alignItems: "center", direction: "rtl", gap: 1 }}
      >
        <Typography variant="body1" sx={{ fontWeight: "500" }}>
          {vocab.word}
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          {vocab.translation}
        </Typography>

        <Box sx={{ flex: 1 }} />

        <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
          {vocab.voiceId && <VocabPlayButton voiceId={vocab.voiceId} />}
          <IconButton
            onClick={() => addToLeitnerMutation.mutate()}
            size="small"
            aria-label="Save to Leitner box"
          >
            <Icon>bookmark_border</Icon>
          </IconButton>
        </Stack>
      </Stack>

      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {vocab.description}
      </Typography>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        message="Note archived"
        color="success"
      />
    </Card>
  );
}
