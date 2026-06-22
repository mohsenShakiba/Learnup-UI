import { Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFileById } from '../../services/fetchFile';
import { AppLoader } from '../../shared/components/AppLoader';
import { Scaffold } from '../../shared/components/Scaffold';
import { getCachedBook, setCachedBook } from './bookCache';
import { ReaderComponent } from './components/ReaderComponent';



export default function BookDetailPage () {
  const { fileName } = useParams<{ fileName: string; }>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bookData, setBookData] = useState<ArrayBuffer | null>(null);
  const [loadError, setLoadError] = useState(false);

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

  return (
    <Scaffold >

      {
        isLoading && <AppLoader />
      }

      {
        !isLoading && loadError && (
          <Stack sx={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              خطا در بارگذاری کتاب
            </Typography>
          </Stack>
        )
      }

      {
        !isLoading && !loadError && bookData && (
          <ReaderComponent bookData={bookData} />
        )
      }

    </Scaffold>
  );
}


