import { Box, Button, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserBookResponse } from '../../api/Learnup';
import { AudioBooksService, BooksControllersService } from '../../api/Learnup';
import { AppIcon } from '../../shared/components/AppIcon';
import { AppLoader } from '../../shared/components/AppLoader';
import { DefaultHeader } from '../../shared/components/DefaultHeader';
import { Scaffold } from '../../shared/components/Scaffold';
import { AudioBookListItem } from './components/AudioBookListItem';
import { BookListItem } from './components/BookListItem';

type LibrarySection = 'ebooks' | 'audioBooks';

export default function ListBooksPage () {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [section, setSection] = useState<LibrarySection>('audioBooks');

  const booksQuery = useQuery({
    queryKey: ['userBooks'],
    queryFn: () => BooksControllersService.getUserBooks(),
    enabled: section === 'ebooks',
  });

  const audioBooksQuery = useQuery({
    queryKey: ['audioBooks'],
    queryFn: () => AudioBooksService.getMobileAudioBooks(),
    enabled: section === 'audioBooks',
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

  const isEbooksSection = section === 'ebooks';
  const books = booksQuery.data ?? [];
  const audioBooks = audioBooksQuery.data ?? [];
  const isLoading = isEbooksSection
    ? booksQuery.isLoading || booksQuery.isFetching
    : audioBooksQuery.isLoading || audioBooksQuery.isFetching;

  if (isLoading) {
    return <AppLoader />;
  }

  return (
    <Scaffold
      header={
        <DefaultHeader header="کتابخانه">
        </DefaultHeader>
      }
    >

      <Stack spacing={2} sx={{ minHeight: 0, flex: 1 }}>
        <ToggleButtonGroup
          exclusive
          fullWidth
          color="primary"
          value={section}
          onChange={(_, value: LibrarySection | null) => {
            if (value) setSection(value);
          }}
          sx={{
            bgcolor: 'background.paper',
            '& .MuiToggleButton-root': {
              gap: 0.75,
              py: 1,
            },
          }}
        >
          <ToggleButton value="audioBooks">
            <AppIcon fontSize="small">volume_up</AppIcon>
            کتاب‌های صوتی
          </ToggleButton>
          <ToggleButton value="ebooks">
            <AppIcon fontSize="small">menu_book</AppIcon>
            کتاب‌ها
          </ToggleButton>
        </ToggleButtonGroup>

        {isEbooksSection && books.length === 0 ? (
          <Stack sx={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 1, opacity: 0.6 }}>
            <AppIcon sx={{ fontSize: 48 }}>menu_book</AppIcon>
            <Typography variant="body2">هنوز کتابی اضافه نکرده‌ای</Typography>
          </Stack>
        ) : isEbooksSection ? (
          <Box
            sx={{
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
        ) : audioBooks.length === 0 ? (
          <Stack sx={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 1, opacity: 0.6 }}>
            <AppIcon sx={{ fontSize: 48 }}>volume_up</AppIcon>
            <Typography variant="body2">هنوز کتاب صوتی‌ای برای نمایش نیست</Typography>
          </Stack>
        ) : (
          <Box
            sx={{
              overflowY: 'auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: 1.5,
              pt: 1
            }}
          >
            {audioBooks.map((audioBook) => (
              <AudioBookListItem
                key={audioBook.id}
                audioBook={audioBook}
                onClick={(item) => navigate(`/library/audio-book/${item.id}`)}
              />
            ))}
          </Box>
        )}

      </Stack>

      {isEbooksSection && (
        <Stack >
          <Typography variant='caption' sx={{ color: 'text.secondary', textAlign: 'center' }}>میدونستی میتونی کتاب خودت رو هم اضافه کنی؟</Typography>
          <Button variant='outlined' sx={{ mt: 2 }} size='small'
            onClick={() => navigate('/library/user-books/upload')}
            endIcon={
              <AppIcon>add</AppIcon>
            }>افزودن کتاب</Button>
        </Stack>

      )}

    </Scaffold>
  );
}
