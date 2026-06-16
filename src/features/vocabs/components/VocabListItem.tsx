import { Card, Icon, IconButton, Stack, Typography } from "@mui/material";
import type { VocabResponse } from "../../../api/Learnup/models/VocabResponse";
import { VocabPlayButton } from "./VocabPlayButton";

type Props = {
  vocab: VocabResponse;
};

export function VocabListItem ({ vocab }: Props) {
  return (
    <Card sx={{ p: 2 }}>
      <Stack direction="row" sx={{ alignItems: "flex-start", direction: "rtl" }}>
        <Stack spacing={1.25} sx={{ minWidth: 0, flex: 1, textAlign: "right" }}>
          <Typography>{vocab.word}</Typography>
          <Typography color="primary">{vocab.translation}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>{vocab.description}</Typography>
        </Stack>

        <Stack direction="column" sx={{ alignItems: "center", gap: 0.5 }}>
          {vocab.voiceId && <VocabPlayButton voiceId={vocab.voiceId} />}
          <IconButton size="small" aria-label="Save to Leitner box">
            <Icon>bookmark_border</Icon>
          </IconButton>
        </Stack>
      </Stack>
    </Card>
  );
}
