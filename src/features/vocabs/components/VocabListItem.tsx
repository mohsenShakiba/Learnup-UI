import {
  Box,
  Card,
  Chip,
  Divider,
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
import { VocabType } from "../../../api/Learnup/models/VocabType";
import { VocabPlayButton } from "./VocabPlayButton";

const VOCAB_TYPE_LABELS: Record<VocabType, string> = {
  [VocabType.UNKNOWN]: "",
  [VocabType.NOUN]: "noun",
  [VocabType.VERB]: "verb",
  [VocabType.ADJECTIVE]: "adjective",
  [VocabType.ADVERB]: "adverb",
};

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

      {vocab.description && (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {vocab.description}
        </Typography>
      )}

      {vocab.senses.length > 0 && (
        <Stack spacing={1.5} sx={{ mt: 1.5 }}>
          {vocab.senses.map((sense) => {
            const typeLabel = VOCAB_TYPE_LABELS[sense.type];

            return (
              <Box key={sense.id}>
                <Divider sx={{ mb: 1 }} />
                <Stack
                  direction="row"
                  sx={{ alignItems: "center", direction: "rtl", gap: 1 }}
                >
                  {typeLabel && (
                    <Chip
                      label={typeLabel}
                      size="small"
                      variant="outlined"
                      sx={{ height: 20, fontSize: 11 }}
                    />
                  )}
                  {sense.translation && (
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {sense.translation}
                    </Typography>
                  )}
                </Stack>

                {sense.description && (
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", direction: "rtl", mt: 0.5 }}
                  >
                    {sense.description}
                  </Typography>
                )}

                {sense.example && (
                  <Typography
                    variant="body2"
                    sx={{ fontStyle: "italic", mt: 0.5 }}
                  >
                    {sense.example}
                  </Typography>
                )}

                {sense.exampleTranslation && (
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", direction: "rtl" }}
                  >
                    {sense.exampleTranslation}
                  </Typography>
                )}
              </Box>
            );
          })}
        </Stack>
      )}

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
