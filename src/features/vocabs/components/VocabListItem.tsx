import { Box, Card, Chip, Divider, Icon, IconButton, Stack, Typography } from "@mui/material";
import { VocabTranslationType } from "../../../api/Learnup";
import type { VocabResponse } from "../../../api/Learnup/models/VocabResponse";
import { VocabPlayButton } from "./VocabPlayButton";

type Props = {
  vocab: VocabResponse;
};

const typeConfig: Record<VocabTranslationType, { label: string; color: "primary" | "secondary" | "success" | "warning" | "error" | "info" | "default"; }> = {
  [VocabTranslationType.NOUN]: { label: "اسم", color: "primary" },
  [VocabTranslationType.VERB]: { label: "فعل", color: "success" },
  [VocabTranslationType.ADVERB]: { label: "قید", color: "warning" },
  [VocabTranslationType.ADJECTIVE]: { label: "صفت", color: "secondary" },
};

export function VocabListItem ({ vocab }: Props) {
  return (
    <Card sx={{ p: 2 }}>


      <Stack direction="row" sx={{ alignItems: "center", direction: "rtl", gap: 1 }}>
        <Typography variant="body1" sx={{ fontWeight: '500' }}>{vocab.word}</Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>{vocab.translation}</Typography>

        <Box sx={{ flex: 1 }} />

        <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
          {vocab.voiceId && <VocabPlayButton voiceId={vocab.voiceId} />}
          <IconButton size="small" aria-label="Save to Leitner box">
            <Icon>bookmark_border</Icon>
          </IconButton>
        </Stack>
      </Stack>

      <Typography variant="body2" sx={{ color: 'text.secondary' }}>{vocab.description}</Typography>

      {vocab.translations.length > 0 && (
        <>
          <Divider sx={{ my: 1.5 }} />
          <Stack spacing={1.5} sx={{ direction: "rtl" }}>
            {vocab.translations.map((t) => (
              <Stack key={t.id} spacing={1}>
                <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
                  <Chip label={typeConfig[t.type]?.label ?? t.type} color={typeConfig[t.type]?.color ?? "default"} size="small" variant="filled" />
                  <Typography variant="body2" >{t.translation}</Typography>
                </Stack>
                {t.example && (
                  <Stack>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>{t.example}</Typography>
                    {t.exampleTranslation && (
                      <Typography variant="caption" sx={{ color: 'text.secondary', direction: 'ltr', textAlign: 'right' }}>{t.exampleTranslation}</Typography>
                    )}
                  </Stack>
                )}
              </Stack>
            ))}
          </Stack>
        </>
      )}
    </Card>
  );
}
