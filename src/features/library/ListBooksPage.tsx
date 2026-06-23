import { Box, Fab, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { UserBooksService } from '../../api/Learnup';
import { AppLoader } from '../../shared/components/AppLoader';
import { DefaultHeader } from '../../shared/components/DefaultHeader';
import { Scaffold } from '../../shared/components/Scaffold';
import { BookListItem } from './components/BookListItem';

export default function ListBooksPage () {
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
    <Scaffold header={
      <DefaultHeader header='کتاب ها' />
    }>
      <Stack spacing={2}>

        {books.length === 0 ? (
          <Stack sx={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 1, opacity: 0.6 }}>
            <span className="material-icons" style={{ fontSize: 48 }}>menu_book</span>
            <Typography variant="body2">هنوز کتابی اضافه نکرده‌ای</Typography>
          </Stack>
        ) : (
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: 1.5,
            }}
          >
            {books.map((book) => (
              <BookListItem
                key={book.id}
                book={book}
                onClick={(b) => navigate(`/library/book/${encodeURIComponent(b.fileName)}`)}
              />
            ))}
          </Box>
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
