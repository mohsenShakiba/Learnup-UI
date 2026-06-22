import { Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserBooksService } from '../../api/Learnup';
import { AppLoader } from '../../shared/components/AppLoader';
import { Scaffold } from '../../shared/components/Scaffold';
import { ReaderComponent } from './components/ReaderComponent';

export default function BookDetailPage () {
  const { fileName } = useParams<{ fileName: string; }>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bookData, setBookData] = useState<ArrayBuffer | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!fileName) return;

    setBookData(null);
    setLoadError(false);

    UserBooksService.getUserBookFile(fileName).then(r => {
      setBookData(r.data);
      setIsLoading(false);
    }, () => {
      setLoadError(true);
      setIsLoading(false);
    });

  }, [fileName]);

  return (
    <Scaffold>

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
