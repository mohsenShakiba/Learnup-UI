import {
  Box,
  Divider,
  IconButton,
  Stack,
  Typography
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { ChatsService, LeitnerBoxService, SendAiTextResponse, VocabsService } from '../../../api/Learnup';
import type { SentenceDetectionResult } from '../../../services/SentenceDetection';
import { AppIcon } from '../../../shared/components/AppIcon';
import { AppLoader } from '../../../shared/components/AppLoader';

interface Props {
  selection: SentenceDetectionResult;
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

type BookmarkState = 'idle' | 'loading' | 'saved' | 'error';

export function ReaderTranslationDrawer ({ selection }: Props) {
  const { word, sentence } = selection;
  const { data: result = null, isPending: loading, isError: error } = useQuery({
    queryKey: ['readerTranslation', word, sentence],
    queryFn: () => ChatsService.translateWithAi(selection),
    refetchOnWindowFocus: false,
    retry: false,
  });

  const wordTranslation = getTranslationText(result, 'wordTranslation', 'WordTranslation');
  const sentenceTranslation = getTranslationText(result, 'sentenceTranslation', 'SentenceTranslation');
  const [bookmarkState, setBookmarkState] = useState<BookmarkState>('idle');

  const handleBookmark = async () => {
    if (!word || bookmarkState === 'loading' || bookmarkState === 'saved') return;
    setBookmarkState('loading');
    try {
      const vocabs = await VocabsService.searchVocab(word);
      let vocabId: number;
      if (vocabs.length > 0) {
        vocabId = vocabs[0].id;
      } else {
        vocabId = await VocabsService.createVocab({
          languageId: 1,
          word,
          translation: wordTranslation || null,
        });
      }
      await LeitnerBoxService.addVocabToLeitnerBox(vocabId);
      setBookmarkState('saved');
    } catch {
      setBookmarkState('error');
    }
  };

  return (
    <Box sx={{ px: 2, pb: 3 }}>
      {word && (
        <Stack direction="row" sx={{ alignItems: 'center', mb: 1, direction: 'rtl' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>
            {word}
          </Typography>
          {result != null && (
            <IconButton
              onClick={() => void handleBookmark()}
              disabled={bookmarkState === 'loading'} size="small">
              <AppIcon sx={{ color: bookmarkState === 'saved' ? 'success.main' : bookmarkState === 'error' ? 'error.main' : 'text.secondary' }}>
                {bookmarkState === 'saved' ? 'bookmark' : 'bookmark_border'}
              </AppIcon>
            </IconButton>
          )}
        </Stack>
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
        <AppLoader fullHeight={false} />
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
  );
}
