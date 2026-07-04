import { Box, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BooksControllersService } from '../../api/Learnup';
import { BookManagarService, BookPageInfo } from '../../services/BookManagarService';
import type { SentenceDetectionResult } from '../../services/SentenceDetection';
import { AppIcon } from '../../shared/components/AppIcon';
import { AppLoader } from '../../shared/components/AppLoader';
import { useSwipeableDrawerStore } from '../../shared/swipeableDrawer';
import { ReaderConfigDrawer } from './components/ReaderConfigDrawer';
import { ReaderTranslationDrawer } from './components/ReaderTranslationDrawer';
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
    refetchOnMount: "always",
  });

  const book = booksQuery.data;

  // loading: wait for the book query as well as the reader revealing itself
  // (which only happens once the configured font has finished loading).
  const isLoading = booksQuery.isLoading || !pageInfo?.display;

  // initialize the manager
  if (!bookManagerRef.current) {
    bookManagerRef.current = new BookManagarService();
  }

  const bookManager = bookManagerRef.current;

  const handleWordSelect = useCallback((selection: SentenceDetectionResult) => {
    show(<ReaderTranslationDrawer selection={selection} />);
  }, [show]);

  useEffect(() => {
    if (!readerContainer) return;
    if (!book) return;
    void bookManager.display(book, readerContainer, theme, setPageInfo, handleWordSelect);
  }, [book, readerContainer, bookManager, theme, handleWordSelect]);

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

      {isLoading &&
        <Box sx={{ position: 'fixed', inset: 0, zIndex: 2, bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AppLoader />
        </Box>
      }

      {/* The reader container must always be mounted so the book can render and
          reveal itself once its font is ready; it is kept hidden behind the
          loader until then. */}
      <Box sx={{ position: 'fixed', left: 0, right: 0, top: 0, bottom: 0, visibility: isLoading ? 'hidden' : 'visible' }}>

        <Stack direction='row' sx={{ position: 'fixed', left: 16, right: 16, top: 16, gap: 2, zIndex: 1, alignItems: 'center', justifyContent: 'space-between', }}>
          <IconButton onClick={() => navigate(-1)} sx={{ color: 'inherit' }}>
            <AppIcon sx={{ opacity: 0.5 }}>arrow_forward</AppIcon>
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
            <AppIcon sx={{ opacity: 0.5 }}>settings</AppIcon>
          </IconButton>
        </Stack>

        <Box ref={setReaderContainer} sx={{ width: '100%', direction: 'rtl', position: 'fixed', left: 0, right: 0, top: 16, bottom: 8, }} />

        {/* Invisible overlay covering the bottom 100px. It sits above the epub
            iframe and swallows pointer/touch events so gestures in this area do
            not reach (and scroll) the reader. */}
        <Box
          sx={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            height: 100,
            zIndex: 1,
          }}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        />

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

      </Box>
    </Box>
  );
}

