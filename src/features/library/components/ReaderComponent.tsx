import { Box, IconButton, Stack } from '@mui/material';
import Epub, { Rendition } from 'epubjs';
import { useEffect, useRef, useState } from 'react';

interface Props {
  bookData: ArrayBuffer;
}

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
      width: '100%',
      height: '100%',
      snap: true,
    });
    renditionRef.current = rendition;

    rendition.on('relocated', (location: { atStart: boolean; atEnd: boolean; }) => {
      setAtStart(location.atStart);
      setAtEnd(location.atEnd);
    });

    rendition.display();

    return () => {
      rendition.destroy();
      book.destroy();
      renditionRef.current = null;
    };
  }, [bookData]);

  return (
    <Stack sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <Box ref={viewerRef} sx={{ flex: 1, minHeight: 0, width: '100%', }} />
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
