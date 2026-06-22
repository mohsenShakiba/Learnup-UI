import { Box, IconButton, Stack, Typography } from '@mui/material';
import Epub, { Rendition } from 'epubjs';
import { useEffect, useRef, useState } from 'react';
import { UserBooksService } from '../../../api/Learnup';
import { calculateTotalPages, SectionLocation } from '../../../utils/Calculate';

interface Props {
  bookData: ArrayBuffer;
  bookId?: number;
  initialCfi?: string | null;
}

declare global {
  interface Window {
    ePubViewer?: {
      Book: {
        nextPage: () => void;
        prevPage: () => void;
      };
    };
  }
}

export function ReaderComponent ({ bookData, bookId, initialCfi }: Props) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const renditionRef = useRef<Rendition | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string | null>(initialCfi ?? null);
  // Cumulative page count preceding each spine section, indexed by spine position.
  const sectionOffsetsRef = useRef<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);

  useEffect(() => {
    if (!viewerRef.current) return;

    const book = Epub(bookData);

    const rendition = book.renderTo(viewerRef.current, {
      flow: 'paginated',
      manager: 'continuous',
      width: '100%',
      height: '100%',
      snap: true,
    });

    renditionRef.current = rendition;

    window.ePubViewer = {
      Book: {
        nextPage: () => rendition.next(),
        prevPage: () => rendition.prev(),
      },
    };

    // Translate a section-relative location into a whole-book page number.
    const toGlobalPage = (start?: SectionLocation) => {
      if (!start) return null;
      const offset = sectionOffsetsRef.current[start.index] ?? 0;
      return offset + start.displayed.page;
    };

    // Persist the reading position whenever the page changes.
    rendition.on('relocated', (location: { start?: SectionLocation; }) => {
      const start = location?.start;
      const cfi = start?.cfi;
      if (!cfi) return;

      const page = toGlobalPage(start);
      if (page != null) setCurrentPage(page);

      if (bookId == null || cfi === lastSavedRef.current) return;
      lastSavedRef.current = cfi;

      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        UserBooksService.updateUserBookCurrentPage(bookId, { currentRef: cfi });
      }, 800);
    });

    // Restore the saved page on load, falling back to the start of the book.
    rendition.display(initialCfi ?? undefined);

    // Pre-paginate every section in a hidden rendition sized like the viewer so
    // we know how many pages each contains. This yields a stable "page X / Y"
    // that advances by one per flip, instead of the character-based location
    // count which can skip several numbers per page.
    let cancelled = false;

    book.ready.then(async () => {
      if (cancelled || !viewerRef.current) return;
      const pageCalculation = await calculateTotalPages(book, viewerRef.current, () => cancelled);
      if (!pageCalculation) return;

      sectionOffsetsRef.current = pageCalculation.offsets;
      setTotalPages(pageCalculation.totalPages);

      // Reflect the page for the position the visible rendition already shows.
      const current = (renditionRef.current?.currentLocation() as unknown as { start?: SectionLocation; })?.start;
      const page = toGlobalPage(current);
      if (page != null) setCurrentPage(page);
    });

    return () => {
      cancelled = true;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      rendition.destroy();
      book.destroy();
      renditionRef.current = null;
      delete window.ePubViewer;
    };

  }, [bookData, bookId, initialCfi]);

  return (
    <Stack sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <Box ref={viewerRef} sx={{ flex: 1, minHeight: 0, width: '100%', bgcolor: 'transparent' }} />
      <Stack
        direction="row"
        sx={{
          justifyContent: 'space-between',
        }}
      >
        <IconButton
          onClick={() => renditionRef.current?.next()}>
          <span className="material-icons">chevron_right</span>
        </IconButton>
        <Typography variant="body2" sx={{ alignSelf: 'center', color: 'text.secondary' }}>
          {currentPage != null && totalPages != null ? `${currentPage} / ${totalPages}` : '…'}
        </Typography>
        <IconButton
          onClick={() => renditionRef.current?.prev()}>
          <span className="material-icons">chevron_left</span>
        </IconButton>
      </Stack>
    </Stack>
  );
}
