import { Box, IconButton, Stack } from '@mui/material';
import Epub, { Rendition } from 'epubjs';
import { useEffect, useRef, useState } from 'react';

interface Props {
  bookData: ArrayBuffer;
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

// How far (fraction of a page) you must drag before release commits to the
// next/prev page instead of snapping back.
const SWIPE_THRESHOLD = 0.18;
// Snap-back / commit animation length in ms.
const SNAP_DURATION = 240;

export function ReaderComponent ({ bookData }: Props) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const renditionRef = useRef<Rendition | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

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

    // rendition.on('relocated', (location: { atStart: boolean; atEnd: boolean; }) => {
    //   setAtStart(location.atStart);
    //   setAtEnd(location.atEnd);
    // });

    rendition.display();

    return () => {
      rendition.destroy();
      book.destroy();
      renditionRef.current = null;
      delete window.ePubViewer;
    };
  }, [bookData]);

  return (
    <Stack sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <Box ref={viewerRef} sx={{ flex: 1, minHeight: 0, width: '100%' }} />
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          borderTop: 1,
          borderColor: 'divider',
          justifyContent: 'space-between',
          px: 1,
          py: 0.5,
        }}
      >
        <IconButton
          aria-label="Previous page"
          disabled={atStart}
          onClick={() => renditionRef.current?.prev()}
        >
          <span className="material-icons">chevron_left</span>
        </IconButton>
        <IconButton
          aria-label="Next page"
          disabled={atEnd}
          onClick={() => renditionRef.current?.next()}
        >
          <span className="material-icons">chevron_right</span>
        </IconButton>
      </Stack>
    </Stack>
  );
}
