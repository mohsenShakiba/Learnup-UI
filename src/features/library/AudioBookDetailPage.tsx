import { Box, Paper, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { AudioBooksService, type AudioBookItemResponse } from '../../api/Learnup';
import { AppLoader } from '../../shared/components/AppLoader';
import { DefaultHeader } from '../../shared/components/DefaultHeader';
import { ErrorPage } from '../../shared/components/ErrorPage';
import { ImageLoader } from '../../shared/components/ImageLoader';
import { Scaffold } from '../../shared/components/Scaffold';

function AudioBookItemCard ({ item }: { item: AudioBookItemResponse; }) {
  return (
    <Paper>
      <Stack>
        <Typography variant='body1' sx={{ direction: 'rtl', lineHeight: 1.75 }}>
          {item.sentence}
        </Typography>

        {item.translation && (
          <Typography variant="caption" sx={{ color: 'text.secondary', direction: 'ltr' }}>
            {item.translation}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}

export default function AudioBookDetailPage () {
  const { audioBookId } = useParams<{ audioBookId: string; }>();
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

  const metadata = [audioBook?.level, audioBook?.author, audioBook?.wordCount ? `${audioBook.wordCount} Words` : null]
    .filter((value): value is string => Boolean(value));

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
    <Scaffold header={<DefaultHeader header={audioBook.title} />}>

      <Stack spacing={2} >
        <Paper
          sx={(theme) => ({
            position: 'relative',
            overflow: 'hidden',
            aspectRatio: '6/9',
            p: 0,
          })}
        >
          {audioBook.coverId && (
            <ImageLoader
              coverId={audioBook.coverId}
              alt={audioBook.title}
              sx={{
                position: 'absolute',
                inset: 0,
              }}
            />
          )}

          <Box
            sx={{
              position: 'absolute',
              inset: 0,
            }}
          />

          <Stack
            spacing={1}
            sx={(theme) => ({
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              direction: 'rtl',
              p: 2,
              background: 'rgba(25, 23, 29, 0.3)',
              color: 'common.white',
              backdropFilter: audioBook.coverId ? 'blur(18px)' : undefined,
            })}
          >
            <Typography variant="h6">
              {audioBook.title}
            </Typography>

            {metadata.length > 0 && (
              <Stack direction='row' sx={{ gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                {metadata.map((value) => (
                  <Typography key={value} variant="body2">
                    {value}
                  </Typography>
                ))}
              </Stack>
            )}

            {audioBook.description && (
              <Typography variant="body2" sx={{ direction: 'ltr' }}>
                {audioBook.description}
              </Typography>
            )}
          </Stack>
        </Paper>

        <Stack spacing={1}>
          {items.map((item) => (
            <AudioBookItemCard key={item.id} item={item} />
          ))}
        </Stack>

      </Stack>

    </Scaffold>
  );
}
