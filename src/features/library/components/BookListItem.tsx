import { Box, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import type { UserBookResponse } from '../../../api/Learnup';
import { getFileById } from '../../../services/fetchFile';

interface BookListItemProps {
  book: UserBookResponse;
  onClick?: (book: UserBookResponse) => void;
}

export function BookListItem ({ book, onClick }: BookListItemProps) {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!book.coverId) {
      setCoverUrl(null);
      return;
    }

    let cancelled = false;
    let objectUrl: string | null = null;

    getFileById(book.coverId)
      .then((buffer) => {
        const url = URL.createObjectURL(new Blob([buffer]));
        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }
        objectUrl = url;
        setCoverUrl(url);
      })
      .catch(() => {
        if (!cancelled) setCoverUrl(null);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [book.coverId]);

  return (
    <Paper
      onClick={() => onClick?.(book)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        p: 0,
        borderRadius: 2,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <Box
        sx={{
          aspectRatio: '6 / 9',
          borderRadius: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          bgcolor: 'action.hover',
          color: 'text.secondary',
          position: 'relative',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        }}
      >
        {coverUrl ? (
          <Box
            component="img"
            src={coverUrl}
            alt={book.title}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Stack sx={{ flex: 1, justifyContent: 'space-between', p: 2, mb: 1, direction: 'rtl', }}>
            <Typography
              sx={{
                textAlign: 'center',
                fontWeight: 600,
              }}
            >
              {book.title}
            </Typography>
            <Typography variant='caption' sx={{
              color: 'text.secondary',
              textAlign: 'center',
            }}>
              {book.author}
            </Typography>
            <Box component='img'
              src='/images/subscriptions/book.png'
              sx={{ position: 'absolute', bottom: 0, right: -100, width: '250px', opacity: 0.05 }} />
          </Stack>
        )}

        <LinearProgress variant='determinate' value={book.progress ?? 0} sx={{ position: 'absolute', left: 12, right: 12, bottom: 12, borderRadius: 1 }} />
      </Box>

    </Paper>
  );
}
