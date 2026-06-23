import { Box, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import type { UserBookResponse } from '../../../api/Learnup';

interface BookListItemProps {
  book: UserBookResponse;
  coverUrl?: string | null;
  onClick?: (book: UserBookResponse) => void;
}

export function BookListItem ({ book, coverUrl, onClick }: BookListItemProps) {
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
          aspectRatio: '3 / 4',
          borderRadius: 1.5,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          bgcolor: 'action.hover',
          color: 'text.secondary',
          position: 'relative'
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
