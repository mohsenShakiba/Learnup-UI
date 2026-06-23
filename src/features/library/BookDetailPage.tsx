import { Box, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserBooksService } from '../../api/Learnup';
import { getFileById } from '../../services/fetchFile';
import { AppLoader } from '../../shared/components/AppLoader';
import { getCachedBook, setCachedBook } from './bookCache';
import { ReaderComponent } from './components/ReaderComponent';



export default function BookDetailPage () {
  const { fileName } = useParams<{ fileName: string; }>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bookData, setBookData] = useState<ArrayBuffer | null>(null);
  const [loadError, setLoadError] = useState(false);

  const booksQuery = useQuery({
    queryKey: ['userBooks'],
    queryFn: () => UserBooksService.getUserBooks(),
  });

  const book = booksQuery.data?.find((b) => b.fileName === fileName);

  useEffect(() => {
    if (!fileName) return;

    let cancelled = false;

    setBookData(null);
    setLoadError(false);
    setIsLoading(true);

    (async () => {
      const cached = await getCachedBook(fileName);
      if (cancelled) return;

      if (cached) {
        setBookData(cached);
        setIsLoading(false);
        return;
      }

      try {
        const r = await getFileById(fileName);
        if (cancelled) return;
        setCachedBook(fileName, r);
        setBookData(r);
        setIsLoading(false);
      } catch {
        if (cancelled) return;
        setLoadError(true);
        setIsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [fileName]);

  // Wait for the book list too, so the saved page is known before first render.
  const showLoader = isLoading || booksQuery.isLoading;

  return (
    <Box sx={{ position: 'fixed', inset: 0 }} >

      {
        showLoader && <AppLoader />
      }

      {
        !showLoader && loadError && (
          <Stack sx={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              خطا در بارگذاری کتاب
            </Typography>
          </Stack>
        )
      }

      {
        !showLoader && !loadError && bookData && (
          <ReaderComponent
            bookData={bookData}
            bookId={book?.id}
            initialCfi={book?.currentRef}
          />
        )
      }

    </Box>
  );
}


