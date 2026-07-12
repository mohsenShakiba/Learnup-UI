import { alpha, Box, Chip, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import type { AudioBookResponse } from '../../../api/Learnup';
import { getFileById } from '../../../services/fetchFile';

interface AudioBookListItemProps {
  audioBook: AudioBookResponse;
  onClick?: (audioBook: AudioBookResponse) => void;
}

export function AudioBookListItem ({ audioBook, onClick }: AudioBookListItemProps) {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!audioBook.coverId) {
      setCoverUrl(null);
      return;
    }

    let cancelled = false;
    let objectUrl: string | null = null;

    getFileById(audioBook.coverId)
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
  }, [audioBook.coverId]);

  const metadata = [audioBook.author, audioBook.level, audioBook.year].filter(Boolean).join(' • ');

  return (
    <Stack spacing={0.5}>
      <Paper
        onClick={() => onClick?.(audioBook)}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={(event) => {
          if (!onClick || (event.key !== 'Enter' && event.key !== ' ')) return;
          event.preventDefault();
          onClick(audioBook);
        }}
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          p: 0,
          borderRadius: 2,
          cursor: onClick ? 'pointer' : undefined,
        }}
      >
        <Chip size='small' variant='filled' sx={(theme) => ({ position: 'absolute', fontFamily: 'arial', top: 8, left: 8, zIndex: 1, bgcolor: alpha(theme.palette.background.default, 0.6), backdropFilter: 'blur(20px)', color: theme.palette.text.primary })} label={audioBook.level} />

        <Box
          component="img"
          src={coverUrl!}
          alt={audioBook.title}
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

      </Paper>

      <Typography variant='body2' sx={{ fontFamily: 'arial', direction: 'rtl' }} >
        {audioBook.title}
      </Typography>

    </Stack >
  );
}
