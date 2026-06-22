import { Box, IconButton, Stack, Typography } from '@mui/material';
import Epub, { Rendition } from 'epubjs';
import { useEffect, useRef, useState } from 'react';
import { UserBooksService } from '../../../api/Learnup';

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

    // epub.js' bundled types are incomplete: at runtime locationFromCfi returns
    // a numeric index and length() reports the generated location count.
    const locations = book.locations as unknown as {
      locationFromCfi: (cfi: string) => number;
      length: () => number;
    };

    window.ePubViewer = {
      Book: {
        nextPage: () => rendition.next(),
        prevPage: () => rendition.prev(),
      },
    };

    // Persist the reading position whenever the page changes.
    rendition.on('relocated', (location: { start?: { cfi?: string; }; }) => {
      const cfi = location?.start?.cfi;
      if (!cfi) return;

      // Update the page indicator from the generated locations.
      if (locations.length()) {
        setCurrentPage(locations.locationFromCfi(cfi) + 1);
        setTotalPages(locations.length());
      }

      if (bookId == null || cfi === lastSavedRef.current) return;
      lastSavedRef.current = cfi;

      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        UserBooksService.updateUserBookCurrentPage(bookId, { currentRef: cfi });
      }, 800);
    });


    // Restore the saved page on load, falling back to the start of the book.
    rendition.display(initialCfi ?? undefined);

    // Generate locations so we can report page numbers. Refresh the indicator
    // once they are ready in case the book is already displayed.
    book.ready
      .then(() => book.locations.generate(1000))
      .then(() => {
        setTotalPages(locations.length());
        const loc = renditionRef.current?.currentLocation() as unknown as { start?: { cfi?: string; }; };
        const currentCfi = loc?.start?.cfi;
        if (currentCfi) setCurrentPage(locations.locationFromCfi(currentCfi) + 1);
      });

    return () => {
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
