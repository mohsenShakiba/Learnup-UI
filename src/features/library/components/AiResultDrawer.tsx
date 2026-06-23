import {
  Box,
  CircularProgress,
  Divider,
  Stack,
  SwipeableDrawer,
  Typography,
} from '@mui/material';
import { SendAiTextResponse } from '../../../api/Learnup';

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
            <Typography variant="caption" color="text.secondary">
              Selected word
            </Typography>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
              {word}
            </Typography>
          </>
        )}

        {sentence && (
          <>
            <Typography variant="caption" color="text.secondary">
              Selected sentence
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
              {sentence}
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </>
        )}

        {loading && (
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', py: 2 }}>
            <CircularProgress size={20} />
            <Typography variant="body2" color="text.secondary">
              در حال دریافت پاسخ…
            </Typography>
          </Stack>
        )}

        {!loading && error && (
          <Typography variant="body2" color="error">
            خطا در دریافت پاسخ. لطفاً دوباره تلاش کنید.
          </Typography>
        )}

        {!loading && !error && result != null && (
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                ترجمه واژه
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {wordTranslation || 'ترجمه‌ای دریافت نشد.'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                ترجمه جمله
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {sentenceTranslation || 'ترجمه‌ای دریافت نشد.'}
              </Typography>
            </Box>
          </Stack>
        )}
      </Box>
    </SwipeableDrawer>
  );
}
