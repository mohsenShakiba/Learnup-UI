import { Box, Divider, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { ConversationsService, VocabsService } from '../../../api/Learnup';
import { AppLoader } from '../../../shared/components/AppLoader';

type Props = {
  conversationId: number;
  itemId: number;
  word: string;
};

/**
 * Drawer body shown when a word inside a conversation is long-pressed. Shows the
 * expressions for that line first, followed by the translation of the pressed
 * word.
 */
export function ConversationWordDrawer ({ conversationId, itemId, word }: Props) {
  const expressionsQuery = useQuery({
    queryKey: ['conversation-item-expressions', conversationId, itemId],
    queryFn: () => ConversationsService.getConversationItemExpressions(conversationId, itemId),
  });

  const vocabQuery = useQuery({
    queryKey: ['vocab', word],
    queryFn: () => VocabsService.searchVocab(word),
    enabled: word.length > 0,
  });

  const expressions = expressionsQuery.data ?? [];
  const vocabs = vocabQuery.data ?? [];

  return (
    <Box sx={{ px: 2, pb: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
        {word}
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {/* Expressions of the line */}
      <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1, direction: 'rtl' }}>
        اصطلاحات
      </Typography>

      {expressionsQuery.isLoading && <AppLoader fullHeight={false} />}

      {!expressionsQuery.isLoading &&
        (expressionsQuery.isError || expressions.length === 0) && (
          <Typography variant="body2" sx={{ color: 'text.secondary', direction: 'rtl' }}>
            اصطلاحی برای این جمله پیدا نشد.
          </Typography>
        )}

      {!expressionsQuery.isLoading && expressions.length > 0 && (
        <Stack spacing={2}>
          {expressions.map((expression) => (
            <Stack key={expression.id} spacing={0.5}>
              <Typography sx={{ fontWeight: 600 }}>{expression.phrase}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {expression.meaning}
              </Typography>
              {expression.translation && (
                <Typography variant="body2" sx={{ color: 'text.secondary', direction: 'rtl' }}>
                  {expression.translation}
                </Typography>
              )}
            </Stack>
          ))}
        </Stack>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Translation of the pressed word */}
      <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1, direction: 'rtl' }}>
        ترجمه
      </Typography>

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
            </Stack>
          ))}
        </Stack>
      )}
    </Box>
  );
}
