import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import type { AudioBookResponse } from '../../../api/Learnup';
import { getFileById } from '../../../services/fetchFile';
import { AppIcon } from '../../../shared/components/AppIcon';

interface AudioBookListItemProps {
  audioBook: AudioBookResponse;
  onClick?: (audioBook: AudioBookResponse) => void;
}

export function AudioBookListItem({ audioBook, onClick }: AudioBookListItemProps) {
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
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        p: 0,
        borderRadius: 2,
        cursor: onClick ? 'pointer' : undefined,
      }}
    >
      <Box
        sx={{
          aspectRatio: '6 / 9',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          bgcolor: 'action.hover',
          color: 'text.secondary',
          position: 'relative',
        }}
      >
        {coverUrl ? (
          <Box
            component="img"
            src={coverUrl}
            alt={audioBook.title}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Stack sx={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 1.25, p: 2, direction: 'rtl' }}>
            <AppIcon sx={{ fontSize: 42, color: 'primary.main' }}>volume_up</AppIcon>
            <Typography
              sx={{
                textAlign: 'center',
                fontWeight: 700,
                color: 'text.primary',
              }}
            >
              {audioBook.title}
            </Typography>
            {audioBook.author && (
              <Typography variant="caption" sx={{ textAlign: 'center' }}>
                {audioBook.author}
              </Typography>
            )}
          </Stack>
        )}

        <Chip
          size="small"
          icon={<AppIcon>{audioBook.isVoiced ? 'mic' : 'mic_none'}</AppIcon>}
          label={audioBook.isVoiced ? 'صوتی' : 'بدون صدا'}
          color={audioBook.isVoiced ? 'primary' : 'default'}
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            height: 24,
            '& .MuiChip-icon': {
              fontSize: 16,
              mr: 0.5,
            },
          }}
        />
      </Box>

      <Stack spacing={0.5} sx={{ px: 1, py: 1, minHeight: 72, direction: 'rtl' }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            lineHeight: 1.45,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {audioBook.title}
        </Typography>
        {metadata && (
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {metadata}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}
