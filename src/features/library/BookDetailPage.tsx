import { Box, Button, Icon, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BooksControllersService } from '../../api/Learnup';
import { BookManagarService, BookPageInfo } from '../../services/BookManagarService';
import { AppLoader } from '../../shared/components/AppLoader';
import { useSwipeableDrawerStore } from '../../shared/swipeableDrawer';
import { ReaderConfigDrawer } from './components/ReaderConfigDrawer';
import { TableOfContentsDrawer } from './components/TableOfContentsDrawer';

export default function BookDetailPage () {

  // book id
  const { bookId } = useParams<{ bookId: string; }>();
  const parsedBookId = Number(bookId);

  const bookManagerRef = useRef<BookManagarService | null>(null);
  const [readerContainer, setReaderContainer] = useState<HTMLDivElement | null>(null);
  const [pageInfo, setPageInfo] = useState<BookPageInfo | null>(null);

  const navigate = useNavigate();
  const { show, close } = useSwipeableDrawerStore();
  const theme = useTheme();

  // get the book from api
  const booksQuery = useQuery({
    queryKey: ['userBook', parsedBookId],
    queryFn: () => BooksControllersService.getUserBookById(parsedBookId),
  });

  const book = booksQuery.data;

  // loading
  const isLoading = booksQuery.isLoading;

  // initialize the manager
  if (!bookManagerRef.current) {
    bookManagerRef.current = new BookManagarService();
  }

  const bookManager = bookManagerRef.current;

  useEffect(() => {
    if (!readerContainer) return;
    if (!book) return;
    bookManager.display(book, readerContainer, theme, setPageInfo);
  }, [book, readerContainer, bookManager, theme]);

  const handleOpenToc = () => {
    show(<TableOfContentsDrawer
      toc={bookManager.navItems}
      onNavigate={async (href) => {
        await bookManager.setHref(href);
        close();
      }}
    />);
  };

  const handleOpenSettings = () => {
    if (bookManager.config === null) return;
    show(<ReaderConfigDrawer
      config={bookManager.config}
      onConfigChange={bookManager.setConfig}
    />);
  };

  return (
    <Box sx={{ position: 'fixed', inset: 0, }} >

      {
        isLoading ?
          <AppLoader /> :
          <Box sx={{ position: 'fixed', left: 16, right: 16, top: 16, bottom: 60 }}>

            <Stack direction='row' sx={{ gap: 2, alignItems: 'center', justifyContent: 'space-between', }}>
              <IconButton onClick={() => navigate(-1)} sx={{ color: 'inherit' }}>
                <Icon sx={{ opacity: 0.5 }}>arrow_forward</Icon>
              </IconButton>

              <Stack onClick={handleOpenToc}>
                <Typography noWrap sx={{ direction: 'rtl', color: 'inherit', textAlign: 'center', opacity: 0.5, maxWidth: '100%' }}>
                  {book?.title ?? 'loading'}
                </Typography>
                <Typography variant="caption" noWrap sx={{ direction: 'rtl', color: 'inherit', textAlign: 'center', opacity: 0.4, maxWidth: '100%' }}>
                  {pageInfo?.sectionTitle || 'loading...'}
                </Typography>
              </Stack>

              <IconButton
                onClick={handleOpenSettings}>
                <Icon sx={{ opacity: 0.5 }}>settings</Icon>
              </IconButton>
            </Stack>

            <Box ref={setReaderContainer} sx={{ width: '100%', height: '100%', direction: 'rtl', opacity: pageInfo?.display ? 1 : 0 }} />

            <Typography
              variant="caption"
              sx={{
                direction: 'rtl',
                position: 'fixed',
                left: 16,
                right: 16,
                bottom: 24,
                opacity: 0.45,
                textAlign: 'center',
                pointerEvents: 'none',
              }}
            >
              {pageInfo && `${pageInfo.currentPage} / ${pageInfo.totalPages}`}
            </Typography>

            <Button sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} onClick={bookManager.saveCurrentPage}>save</Button>

            {/* <AiResultDrawer
        open={aiState.open}
        word={aiState.word}
        sentence={aiState.sentence}
        loading={aiState.loading}
        error={aiState.error}
        result={aiState.result}
      /> */}

          </Box>
      }
    </Box>
  );
}

