import { Icon } from '../../../shared/components/Icon';
import {
  Box,
  Card,
  Chip,
  Divider,
  IconButton,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
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

const VOCAB_TYPE_COLORS: Record<
  VocabType,
  "default" | "primary" | "secondary" | "success" | "warning"
> = {
  [VocabType.UNKNOWN]: "default",
  [VocabType.NOUN]: "primary",
  [VocabType.VERB]: "secondary",
  [VocabType.ADJECTIVE]: "success",
  [VocabType.ADVERB]: "warning",
};

type Props = {
  vocab: VocabResponse;
};

export function VocabListItem ({ vocab }: Props) {
  const [open, setOpen] = useState(false);
  const [isInLeitnerBox, setIsInLeitnerBox] = useState(vocab.isInLeitnerBox);

  useEffect(() => {
    setIsInLeitnerBox(vocab.isInLeitnerBox);
  }, [vocab.isInLeitnerBox]);

  const addToLeitnerMutation = useMutation({
    mutationFn: () => LeitnerBoxService.addVocabToLeitnerBox(vocab.id),
    onSuccess: () => {
      setIsInLeitnerBox(true);
      setOpen(true);
    },
  });

  const handleAddToLeitner = () => {
    if (isInLeitnerBox || addToLeitnerMutation.isPending) return;
    addToLeitnerMutation.mutate();
  };

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
            onClick={handleAddToLeitner}
            disabled={addToLeitnerMutation.isPending}
            size="small"
            aria-label={isInLeitnerBox ? "Saved in Leitner box" : "Save to Leitner box"}
            sx={{ color: isInLeitnerBox ? "primary.main" : "text.secondary" }}
          >
            <Icon>{isInLeitnerBox ? "bookmark" : "bookmark_border"}</Icon>
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
            const typeColor = VOCAB_TYPE_COLORS[sense.type];

            return (
              <Box key={sense.id} >
                <Divider sx={{ mb: 2 }} />
                <Stack
                  direction="row"
                  sx={{ alignItems: "center", gap: 1, direction: "rtl" }}
                >
                  {typeLabel && (
                    <Chip
                      label={typeLabel}
                      size="small"
                      variant="filled"
                      color={typeColor}
                      sx={{ height: 20, fontSize: 12 }}
                    />
                  )}
                  {sense.translation && (
                    <Typography variant="body2" sx={{ direction: 'ltr' }} >
                      {sense.translation}
                    </Typography>
                  )}
                </Stack>

                {sense.description && (
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mt: 1 }}
                  >
                    {sense.description}
                  </Typography>
                )}

                <Stack spacing={0.5} sx={{ mt: 2 }}>
                  {sense.example && (
                    <Typography
                      variant="body2"
                      sx={{ fontStyle: "italic", direction: "rtl" }}
                    >
                      {sense.example}
                    </Typography>
                  )}

                  {sense.exampleTranslation && (
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", direction: "rtl" }}
                    >
                      {sense.exampleTranslation}
                    </Typography>
                  )}
                </Stack>
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
