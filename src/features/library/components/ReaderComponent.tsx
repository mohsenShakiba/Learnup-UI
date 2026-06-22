import { Box, IconButton, Stack } from '@mui/material';
import Epub, { Rendition } from 'epubjs';
import { useEffect, useRef } from 'react';

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

export function ReaderComponent ({ bookData }: Props) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const renditionRef = useRef<Rendition | null>(null);

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
        <IconButton
          onClick={() => renditionRef.current?.prev()}>
          <span className="material-icons">chevron_left</span>
        </IconButton>
      </Stack>
    </Stack>
  );
}
