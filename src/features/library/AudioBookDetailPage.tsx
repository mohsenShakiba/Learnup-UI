import { alpha, Box, Chip, Paper, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { AudioBooksService, type AudioBookItemResponse } from '../../api/Learnup';
import { AppIcon } from '../../shared/components/AppIcon';
import { AppLoader } from '../../shared/components/AppLoader';
import { DefaultHeader } from '../../shared/components/DefaultHeader';
import { ErrorPage } from '../../shared/components/ErrorPage';
import { Scaffold } from '../../shared/components/Scaffold';

function AudioBookItemCard({ item }: { item: AudioBookItemResponse }) {
  return (
    <Paper
      sx={(theme) => ({
        p: 1.5,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none',
        bgcolor: alpha(theme.palette.background.paper, 0.84),
      })}
    >
      <Stack spacing={1.25}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
          <Box
            sx={(theme) => ({
              width: 28,
              height: 28,
              borderRadius: '50%',
              flexShrink: 0,
              display: 'grid',
              placeItems: 'center',
              bgcolor: alpha(theme.palette.primary.main, 0.12),
              color: 'primary.main',
              fontSize: 12,
              fontWeight: 700,
            })}
          >
            {item.order}
          </Box>

          <Stack spacing={0.75} sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={{ direction: 'ltr', lineHeight: 1.75 }}>
              {item.sentence}
            </Typography>

            {item.translation && (
              <Typography variant="body2" sx={{ color: 'text.secondary', direction: 'rtl', lineHeight: 1.8 }}>
                {item.translation}
              </Typography>
            )}
          </Stack>
        </Stack>

        {item.expressions.length > 0 && (
          <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.75, pl: 4.5 }}>
            {item.expressions.map((expression) => (
              <Chip
                key={expression.id}
                size="small"
                label={`${expression.phrase} - ${expression.meaning}`}
                sx={{ maxWidth: '100%', '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' } }}
              />
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}

export default function AudioBookDetailPage() {
  const { audioBookId } = useParams<{ audioBookId: string }>();
  const parsedAudioBookId = Number(audioBookId);
  const hasValidAudioBookId = Number.isFinite(parsedAudioBookId) && parsedAudioBookId > 0;

  const audioBookQuery = useQuery({
    queryKey: ['audioBook', parsedAudioBookId],
    queryFn: () => AudioBooksService.getAudioBookById(parsedAudioBookId),
    enabled: hasValidAudioBookId,
  });

  const audioBook = audioBookQuery.data;
  const items = useMemo(
    () => [...(audioBook?.items ?? [])].sort((a, b) => a.order - b.order),
    [audioBook?.items],
  );
  const metadata = [audioBook?.author, audioBook?.level, audioBook?.year].filter(Boolean).join(' • ');

  if (!hasValidAudioBookId) {
    return (
      <Scaffold header={<DefaultHeader header="کتاب صوتی" />}>
        <ErrorPage message="شناسه کتاب صوتی معتبر نیست" />
      </Scaffold>
    );
  }

  if (audioBookQuery.isLoading) {
    return <AppLoader />;
  }

  if (audioBookQuery.isError || !audioBook) {
    return (
      <Scaffold header={<DefaultHeader header="کتاب صوتی" />}>
        <ErrorPage actionLabel="تلاش دوباره" onAction={() => void audioBookQuery.refetch()} />
      </Scaffold>
    );
  }

  return (
    <Scaffold header={<DefaultHeader header="کتاب صوتی" />}>
      <Stack spacing={2} sx={{ minHeight: 0 }}>
        <Paper
          sx={(theme) => ({
            p: 2,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: 'none',
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.08)})`,
          })}
        >
          <Stack spacing={1} sx={{ direction: 'rtl' }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <AppIcon sx={{ color: 'primary.main' }}>volume_up</AppIcon>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {audioBook.title}
              </Typography>
            </Stack>

            {metadata && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {metadata}
              </Typography>
            )}

            {audioBook.description && (
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                {audioBook.description}
              </Typography>
            )}
          </Stack>
        </Paper>

        {items.length === 0 ? (
          <Stack sx={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 1, opacity: 0.6, py: 8 }}>
            <AppIcon sx={{ fontSize: 48 }}>format_list_bulleted</AppIcon>
            <Typography variant="body2">هنوز آیتمی برای این کتاب صوتی ثبت نشده</Typography>
          </Stack>
        ) : (
          <Stack spacing={1}>
            {items.map((item) => (
              <AudioBookItemCard key={item.id} item={item} />
            ))}
          </Stack>
        )}
      </Stack>
    </Scaffold>
  );
}
