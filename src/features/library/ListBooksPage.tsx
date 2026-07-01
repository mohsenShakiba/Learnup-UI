import { Box, Button, Fab, Stack, Typography } from '@mui/material';
import { Icon } from '../../shared/components/Icon';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { BooksControllersService } from '../../api/Learnup';
import { AppLoader } from '../../shared/components/AppLoader';
import { DefaultHeader } from '../../shared/components/DefaultHeader';
import { Scaffold } from '../../shared/components/Scaffold';
import { BookListItem } from './components/BookListItem';

export default function ListBooksPage() {
  const navigate = useNavigate();

  const booksQuery = useQuery({
    queryKey: ['userBooks'],
    queryFn: () => BooksControllersService.getUserBooks(),
  });

  if (booksQuery.isLoading || booksQuery.isFetching) {
    return <AppLoader />;
  }

  const books = booksQuery.data ?? [];

  return (
    <Scaffold
      header={
        <DefaultHeader header="لیست کتاب ها">
          <Button size='small'
            onClick={() => navigate('/library/user-books/upload')}
            endIcon={
              <Icon>add</Icon>
            }>افزودن کتاب</Button>
        </DefaultHeader>
      }
    >

      <Stack spacing={1}>

        {books.length === 0 ? (
          <Stack sx={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 1, opacity: 0.6 }}>
            <Icon sx={{ fontSize: 48 }}>menu_book</Icon>
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
              pt: 1
            }}
          >
            {books.map((book) => (
              <BookListItem
                key={book.id}
                book={book}
                onClick={(b) => navigate(`/library/book/${b.id}`)}
              />
            ))}
          </Box>
        )}
      </Stack>
    </Scaffold>
  );
}
