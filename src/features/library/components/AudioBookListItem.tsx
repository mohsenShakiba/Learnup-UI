import { alpha, Box, Chip, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import type { AudioBookResponse } from '../../../api/Learnup';
import { getFileById } from '../../../services/fetchFile';
import { ImagePlaceholder } from '../../../shared/components/ImagePlaceholder';

interface AudioBookListItemProps {
  audioBook: AudioBookResponse;
  onClick?: (audioBook: AudioBookResponse) => void;
}

export function AudioBookListItem ({ audioBook, onClick }: AudioBookListItemProps) {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [imageStatus, setImageStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');

  useEffect(() => {
    if (!audioBook.coverId) {
      setCoverUrl(null);
      setImageStatus('idle');
      return;
    }

    let cancelled = false;
    let objectUrl: string | null = null;

    setCoverUrl(null);
    setImageStatus('loading');
    getFileById(audioBook.coverId)
      .then((buffer) => {
        const url = URL.createObjectURL(new Blob([buffer]));
        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }
        objectUrl = url;
        setCoverUrl(url);
        setImageStatus('loading');
      })
      .catch(() => {
        if (!cancelled) {
          setCoverUrl(null);
          setImageStatus('error');
        }
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [audioBook.coverId]);

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
          aspectRatio: '6 / 9',
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

        {coverUrl && imageStatus === 'loaded' ? (
          <Box
            component="img"
            src={coverUrl}
            alt={audioBook.title}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onLoad={() => setImageStatus('loaded')}
            onError={() => {
              setCoverUrl(null);
              setImageStatus('error');
            }}
          />
        ) : (
          <ImagePlaceholder
            alt={audioBook.title}
            loading={imageStatus === 'loading'}
            sx={{ width: '100%', height: '100%', flex: 1 }}
          />
        )}

      </Paper>

      <Typography variant='body2' sx={{ fontFamily: 'arial', direction: 'rtl' }} >
        {audioBook.title}
      </Typography>

    </Stack >
  );
}
