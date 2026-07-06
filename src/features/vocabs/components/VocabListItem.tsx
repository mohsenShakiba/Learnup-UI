import {
  Box,
  Card,
  Chip,
  Divider,
  IconButton,
  Snackbar,
  Stack,
  Typography
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { LeitnerBoxService } from "../../../api/Learnup";
import type { VocabResponse } from "../../../api/Learnup/models/VocabResponse";
import { VocabType } from "../../../api/Learnup/models/VocabType";
import { AppIcon } from "../../../shared/components/AppIcon";
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
  showBookmark?: boolean;
  vocab: VocabResponse;
};

export function VocabListItem ({ vocab, showBookmark = true }: Props) {
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

  const replaceCommaWithFarsiComma = (w: string | null): string | null => {
    return w?.replaceAll(',', '،') || null;
  };

  return (
    <Card sx={{ p: 2 }}>
      <Stack spacing={1}>

        <Stack
          direction="row"
          sx={{ alignItems: "center", direction: "rtl" }}
        >
          <Typography variant="body1" sx={{ textTransform: 'capitalize', fontWeight: "500" }}>
            {vocab.word}
          </Typography>

          <Box sx={{ flex: 1 }} />

          {showBookmark &&
            <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
              {vocab.voiceId && <VocabPlayButton voiceId={vocab.voiceId} />}
              <IconButton
                onClick={handleAddToLeitner}
                disabled={addToLeitnerMutation.isPending}
                size="small"
                aria-label={isInLeitnerBox ? "Saved in Leitner box" : "Save to Leitner box"}
                sx={{ color: isInLeitnerBox ? "primary.main" : "text.secondary" }}
              >
                <AppIcon>{isInLeitnerBox ? "bookmark" : "bookmark_border"}</AppIcon>
              </IconButton>
            </Stack>
          }
        </Stack>

        <Typography variant="body1" sx={{ textAlign: 'right' }}>
          {replaceCommaWithFarsiComma(vocab.translation)}
        </Typography>

        {vocab.description && (
          <Typography variant="body2" sx={{ direction: 'rtl', color: "text.secondary" }}>
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
                        {replaceCommaWithFarsiComma(sense.translation)}
                      </Typography>
                    )}
                  </Stack>

                  {sense.description && (
                    <Typography
                      variant="body2"
                      sx={{ color: "text.primary", mt: 2, direction: 'rtl', }}
                    >
                      {sense.description}
                    </Typography>
                  )}

                  <Stack spacing={0.5} sx={{ mt: 2 }}>
                    {sense.example && (
                      <Typography
                        variant="body2"
                        sx={{ fontStyle: "italic", color: "text.secondary", direction: "rtl" }}
                      >
                        {sense.example}
                      </Typography>
                    )}

                    {sense.exampleTranslation && (
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", direction: "lrt", textAlign: 'right' }}
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

      </Stack>

    </Card>
  );
}
