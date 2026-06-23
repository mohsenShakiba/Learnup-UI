import { Box, Icon, IconButton, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserBooksService } from '../../api/Learnup';
import { getFileById } from '../../services/fetchFile';
import { AppLoader } from '../../shared/components/AppLoader';
import { getCachedBook, setCachedBook } from './bookCache';
import { ReaderComponent } from './components/ReaderComponent';
import { DEFAULT_CONFIG, READER_THEMES, ReaderConfig } from './readerTypes';



export default function BookDetailPage () {
  const { fileName } = useParams<{ fileName: string; }>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bookData, setBookData] = useState<ArrayBuffer | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();

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

  const [config, setConfig] = useState<ReaderConfig>(DEFAULT_CONFIG);

  const handleConfigChange = (patch: Partial<ReaderConfig>) =>
    setConfig((prev) => ({ ...prev, ...patch }));

  const activeTheme = READER_THEMES.find((t) => t.key === config.theme) ?? READER_THEMES[0];

  return (
    <Box sx={{ position: 'fixed', inset: 0, bgcolor: activeTheme.background }} >

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
          <Box sx={{ position: 'fixed', left: 16, right: 16, top: 24, bottom: 65 }}>

            <Stack direction='row' sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <IconButton onClick={() => navigate(-1)}>
                <Icon sx={{ opacity: 0.5 }}>arrow_forward</Icon>
              </IconButton>

              <Typography sx={{ colot: 'inherit', textAlign: 'center', opacity: 0.5 }}>{book?.title}</Typography>

              <IconButton onClick={() => setSettingsOpen(true)}>
                <Icon sx={{ opacity: 0.5 }}>settings</Icon>
              </IconButton>
            </Stack>

            <ReaderComponent
              bookData={bookData}
              bookId={book?.id}
              initialCfi={book?.currentRef}
              settingsOpen={settingsOpen}
              onSettingsClose={() => setSettingsOpen(false)}
              config={config}
              onConfigChange={handleConfigChange}
            />
          </Box>
        )
      }

    </Box>
  );
}


