import { Paper, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { AudioBooksService, type AudioBookItemResponse } from '../../api/Learnup';
import { AppLoader } from '../../shared/components/AppLoader';
import { DefaultHeader } from '../../shared/components/DefaultHeader';
import { ErrorPage } from '../../shared/components/ErrorPage';
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
        <Paper sx={{ p: 2 }}>
          <Stack spacing={1} sx={{ direction: 'rtl' }}>
            <Typography variant="h6" >
              {audioBook.title}
            </Typography>

            <Stack direction='row' sx={{ gap: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {audioBook.level}
              </Typography>

              <Typography variant='body2' sx={{ color: 'text.secondary' }}>-</Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {audioBook.author}
              </Typography>

              <Typography variant='body2' sx={{ color: 'text.secondary' }}>-</Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {audioBook.wordCount} Words
              </Typography>
            </Stack>

            {audioBook.description && (
              <Typography variant="body2" sx={{ color: 'text.secondary', direction: 'ltr' }}>
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
