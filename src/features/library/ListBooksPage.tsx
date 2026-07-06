import { Box, Button, Stack, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { BooksControllersService } from '../../api/Learnup';
import type { UserBookResponse } from '../../api/Learnup';
import { AppIcon } from '../../shared/components/AppIcon';
import { AppLoader } from '../../shared/components/AppLoader';
import { DefaultHeader } from '../../shared/components/DefaultHeader';
import { Scaffold } from '../../shared/components/Scaffold';
import { BookListItem } from './components/BookListItem';

export default function ListBooksPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const booksQuery = useQuery({
    queryKey: ['userBooks'],
    queryFn: () => BooksControllersService.getUserBooks(),
  });

  const removeMutation = useMutation({
    mutationFn: (id: number) => BooksControllersService.deleteUserBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userBooks'] });
    },
  });

  const handleRemove = (book: UserBookResponse) => {
    if (book.id == null) return;
    if (!window.confirm(`آیا از حذف «${book.title}» مطمئن هستید؟`)) return;
    removeMutation.mutate(book.id);
  };

  if (booksQuery.isLoading || booksQuery.isFetching) {
    return <AppLoader />;
  }

  const books = booksQuery.data ?? [];

  return (
    <Scaffold
      header={
        <DefaultHeader header="لیست کتاب ها">
        </DefaultHeader>
      }
    >

      <Stack spacing={1}>
        {books.length === 0 ? (
          <Stack sx={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 1, opacity: 0.6 }}>
            <AppIcon sx={{ fontSize: 48 }}>menu_book</AppIcon>
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
                onRemove={handleRemove}
              />
            ))}
          </Box>
        )}

      </Stack>

      <Button sx={{ mt: 2 }} size='small'
        onClick={() => navigate('/library/user-books/upload')}
        endIcon={
          <AppIcon>add</AppIcon>
        }>افزودن کتاب</Button>

    </Scaffold>
  );
}
