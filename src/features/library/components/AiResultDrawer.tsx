import {
  Box,
  Divider,
  Stack,
  SwipeableDrawer,
  Typography
} from '@mui/material';
import { SendAiTextResponse } from '../../../api/Learnup';
import { AppLoader } from '../../../shared/components/AppLoader';

interface Props {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  word: string;
  sentence: string;
  loading: boolean;
  error: boolean;
  result: SendAiTextResponse | null;
}

function getTranslationText (
  result: SendAiTextResponse | null,
  camelCaseKey: keyof SendAiTextResponse,
  pascalCaseKey: string,
) {
  if (!result) return '';
  const value = result[camelCaseKey] ?? (result as unknown as Record<string, string | null | undefined>)[pascalCaseKey];
  return value?.trim() ?? '';
}

export function AiResultDrawer ({ open, onOpen, onClose, word, sentence, loading, error, result }: Props) {
  const wordTranslation = getTranslationText(result, 'wordTranslation', 'WordTranslation');
  const sentenceTranslation = getTranslationText(result, 'sentenceTranslation', 'SentenceTranslation');

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onOpen={onOpen}
      onClose={onClose}
      disableSwipeToOpen

    >
      <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: 'divider', mx: 'auto', my: 1.5 }} />

      <Box sx={{ px: 2, pb: 3, overflowY: 'auto' }}>
        {word && (
          <>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 700, direction: 'rtl' }}>
              {word}
            </Typography>
          </>
        )}

        {sentence && (
          <>
            <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic', direction: 'rtl' }}>
              {sentence}
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </>
        )}

        {loading && (
          <AppLoader />
        )}

        {!loading && error && (
          <Typography variant="body2" color="error">
            خطا در دریافت پاسخ. لطفاً دوباره تلاش کنید.
          </Typography>
        )}

        {!loading && !error && result != null && (
          <Stack spacing={2}>
            <Stack >
              <Typography variant='caption' sx={{ color: "text.secondary" }}>
                ترجمه
              </Typography>
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                {wordTranslation || 'ترجمه‌ای دریافت نشد.'}
              </Typography>
            </Stack>
            <Stack sx={{ flexWrap: 'wrap' }}>
              <Typography variant='caption' sx={{ color: "text.secondary" }}>
                ترجمه جمله
              </Typography>
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                {sentenceTranslation || 'ترجمه‌ای دریافت نشد.'}
              </Typography>
            </Stack>
          </Stack>
        )}
      </Box>
    </SwipeableDrawer>
  );
}
