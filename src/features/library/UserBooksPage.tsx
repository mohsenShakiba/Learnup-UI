import { Fab, Paper, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { UserBooksService } from '../../api/Learnup';
import { AppLoader } from '../../shared/components/AppLoader';
import { Scaffold } from '../../shared/components/Scaffold';

export default function UserBooksPage () {
  const navigate = useNavigate();

  const booksQuery = useQuery({
    queryKey: ['userBooks'],
    queryFn: () => UserBooksService.getUserBooks(),
  });

  if (booksQuery.isLoading || booksQuery.isFetching) {
    return <AppLoader />;
  }

  const books = booksQuery.data ?? [];

  return (
    <Scaffold>
      <Stack sx={{ height: '100%' }} spacing={2}>
        <Typography variant="h6">کتاب‌های من</Typography>

        {books.length === 0 ? (
          <Stack sx={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 1, opacity: 0.6 }}>
            <span className="material-icons" style={{ fontSize: 48 }}>menu_book</span>
            <Typography variant="body2">هنوز کتابی اضافه نکرده‌ای</Typography>
          </Stack>
        ) : (
          <Stack spacing={1.5} sx={{ flex: 1, overflowY: 'auto' }}>
            {books.map((book) => (
              <Paper
                key={book.id}
                onClick={() => navigate(`/library/book/${encodeURIComponent(book.fileName)}`)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1,
                  borderRadius: 2,
                  cursor: 'pointer',
                }}
              >
                <Stack sx={{ minWidth: 0, flex: 1 }}>
                  <Typography noWrap sx={{ fontSize: '1rem' }}>
                    {book.title}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.6 }}>
                    {new Date(book.uploadedAt).toLocaleDateString('fa-IR')}
                  </Typography>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Stack>

      <Fab
        color="primary"
        onClick={() => navigate('/library/user-books/upload')}
        sx={{ position: 'absolute', bottom: 24, right: 24 }}
      >
        <span className="material-icons">add</span>
      </Fab>
    </Scaffold>
  );
}
