import { Box, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import type { UserBookResponse } from '../../../api/Learnup';
import { getFileById } from '../../../services/fetchFile';
import { AppIcon } from '../../../shared/components/AppIcon';
import { ImagePlaceholder } from '../../../shared/components/ImagePlaceholder';

interface BookListItemProps {
  book: UserBookResponse;
  onClick?: (book: UserBookResponse) => void;
  onRemove?: (book: UserBookResponse) => void;
}

export function BookListItem ({ book, onClick, onRemove }: BookListItemProps) {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [imageStatus, setImageStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!book.coverId) {
      setCoverUrl(null);
      setImageStatus('idle');
      return;
    }

    let cancelled = false;
    let objectUrl: string | null = null;

    setCoverUrl(null);
    setImageStatus('loading');
    getFileById(book.coverId)
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
  }, [book.coverId]);

  return (
    <Stack>

      <Paper
        onClick={() => onClick?.(book)}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          p: 0,
          borderRadius: 2,
          cursor: onClick ? 'pointer' : 'default',
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
            imageStatus === 'loaded' ? (
              <Box
                component="img"
                src={coverUrl}
                alt={book.title}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onLoad={() => setImageStatus('loaded')}
                onError={() => {
                  setCoverUrl(null);
                  setImageStatus('error');
                }}
              />
            ) : (
              <ImagePlaceholder
                alt={book.title}
                loading={imageStatus === 'loading'}
                sx={{ width: '100%', height: '100%' }}
              >
                {imageStatus !== 'loading' && (
                  <Stack
                    sx={{ flex: 1, justifyContent: 'space-between', p: 2, mb: 1, direction: 'rtl' }}
                  >
                    <Typography
                      sx={{
                        textAlign: 'center',
                        fontWeight: 600,
                      }}
                    >
                      {book.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        textAlign: 'center',
                      }}
                    >
                      {book.author}
                    </Typography>
                    <Box
                      component="img"
                      src="/images/subscriptions/book.png"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: -100,
                        width: '250px',
                        opacity: 0.05,
                      }}
                    />
                  </Stack>
                )}
              </ImagePlaceholder>
            )
          ) : (
            <ImagePlaceholder alt={book.title} loading={imageStatus === 'loading'} sx={{ width: '100%', height: '100%' }}>
              {imageStatus === 'loading' ? null : (
                <Stack sx={{ flex: 1, justifyContent: 'space-between', p: 2, mb: 1, direction: 'rtl' }}>
                  <Typography
                    sx={{
                      textAlign: 'center',
                      fontWeight: 600,
                    }}
                  >
                    {book.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      textAlign: 'center',
                    }}
                  >
                    {book.author}
                  </Typography>
                  <Box
                    component="img"
                    src="/images/subscriptions/book.png"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: -100,
                      width: '250px',
                      opacity: 0.05,
                    }}
                  />
                </Stack>
              )}
            </ImagePlaceholder>
          )}

        </Box>

      </Paper>

      <Stack spacing={1} direction='row' sx={{ px: 1, alignItems: 'center', }}>
        <Typography variant='caption' sx={{ color: 'text.secondary' }}>
          {Math.round(book.progress ?? 0)}%
        </Typography>
        <Box sx={{ flex: 1 }} />
        <IconButton
          size='small'
          onClick={(e) => {
            e.stopPropagation();
            setMenuAnchor(e.currentTarget);
          }}
        >
          <AppIcon >more_horiz</AppIcon>
        </IconButton>
      </Stack>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={(e) => {
          (e as React.MouseEvent).stopPropagation?.();
          setMenuAnchor(null);
        }}
        onClick={(e) => e.stopPropagation()}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ list: { sx: { py: 0 } } }}
      >
        <MenuItem
          dense
          onClick={(e) => {
            e.stopPropagation();
            setMenuAnchor(null);
            onRemove?.(book);
          }}
          sx={{ color: 'error.main', gap: 1 }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 'auto' }}>
            <AppIcon fontSize='small'>delete</AppIcon>
          </ListItemIcon>
          <ListItemText slotProps={{ primary: { variant: 'body2' } }}>حذف کتاب</ListItemText>
        </MenuItem>
      </Menu>
    </Stack>

  );
}
