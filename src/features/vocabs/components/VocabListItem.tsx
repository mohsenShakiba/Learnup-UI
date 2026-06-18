import { Box, Card, Icon, IconButton, Stack, Typography } from "@mui/material";
import type { VocabResponse } from "../../../api/Learnup/models/VocabResponse";
import { VocabPlayButton } from "./VocabPlayButton";

type Props = {
  vocab: VocabResponse;
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


    </Card>
  );
}
