import { Box, Divider, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { VocabsService } from '../../../api/Learnup';
import { AppLoader } from '../../../shared/components/AppLoader';

type Props = {
  word: string;
};

/**
 * Drawer body shown when a word inside a story is long-pressed. Looks the word
 * up through the vocab service and renders its translation and examples.
 */
export function WordTranslationDrawer ({ word }: Props) {
  const vocabQuery = useQuery({
    queryKey: ['vocab', word],
    queryFn: () => VocabsService.getVocabByWord(word),
    enabled: word.length > 0,
  });

  const vocabs = vocabQuery.data ?? [];

  return (
    <Box sx={{ px: 2, pb: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
        {word}
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {vocabQuery.isLoading && <AppLoader fullHeight={false} />}

      {!vocabQuery.isLoading && (vocabQuery.isError || vocabs.length === 0) && (
        <Typography variant="body2" sx={{ color: 'text.secondary', direction: 'rtl' }}>
          ترجمه‌ای برای این کلمه پیدا نشد.
        </Typography>
      )}

      {!vocabQuery.isLoading && vocabs.length > 0 && (
        <Stack spacing={2}>
          {vocabs.map((vocab) => (
            <Stack key={vocab.id} spacing={0.5}>
              {vocab.translation && (
                <Typography sx={{ direction: 'rtl' }}>{vocab.translation}</Typography>
              )}
              {vocab.description && (
                <Typography variant="body2" sx={{ color: 'text.secondary', direction: 'rtl' }}>
                  {vocab.description}
                </Typography>
              )}
              {vocab.example && (
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  {vocab.example}
                </Typography>
              )}
              {vocab.exampleTranslation && (
                <Typography variant="caption" sx={{ color: 'text.secondary', direction: 'rtl' }}>
                  {vocab.exampleTranslation}
                </Typography>
              )}
            </Stack>
          ))}
        </Stack>
      )}
    </Box>
  );
}
