import { Box, Icon, IconButton, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BooksControllersService } from '../../api/Learnup';
import { getFileById } from '../../services/fetchFile';
import { AppLoader } from '../../shared/components/AppLoader';
import { getCachedBook, setCachedBook } from '../../stores/bookCache';
import { ReaderComponent } from './components/ReaderComponent';
import { loadReaderConfig, READER_THEMES, ReaderConfig, saveReaderConfig } from './readerTypes';



export default function BookDetailPage () {
  const { fileName } = useParams<{ fileName: string; }>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bookData, setBookData] = useState<ArrayBuffer | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const navigate = useNavigate();

  const booksQuery = useQuery({
    queryKey: ['userBooks'],
    queryFn: () => BooksControllersService.getUserBooks(),
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

  const [config, setConfig] = useState<ReaderConfig>(loadReaderConfig);

  const handleConfigChange = (patch: Partial<ReaderConfig>) =>
    setConfig((prev) => {
      const next = { ...prev, ...patch };
      saveReaderConfig(next);
      return next;
    });

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
          <Box sx={{ position: 'fixed', left: 16, right: 16, top: 16, bottom: 60 }}>

            <Stack direction='row' sx={{ alignItems: 'center', justifyContent: 'space-between', color: activeTheme.color }}>
              <IconButton onClick={() => navigate(-1)} sx={{ color: 'inherit' }}>
                <Icon sx={{ opacity: 0.5 }}>arrow_forward</Icon>
              </IconButton>

              <Stack
                onClick={() => setTocOpen(true)}
                sx={{ flex: 1, minWidth: 0, alignItems: 'center', cursor: 'pointer' }}
              >
                <Typography noWrap sx={{ color: 'inherit', textAlign: 'center', opacity: 0.5, maxWidth: '100%' }}>
                  {book?.title}
                </Typography>
                {currentSection && (
                  <Typography variant="caption" noWrap sx={{ color: 'inherit', textAlign: 'center', opacity: 0.4, maxWidth: '100%' }}>
                    {currentSection}
                  </Typography>
                )}
              </Stack>

              <IconButton onClick={() => setSettingsOpen(true)} sx={{ color: 'inherit' }}>
                <Icon sx={{ opacity: 0.5 }}>settings</Icon>
              </IconButton>
            </Stack>

            <ReaderComponent
              bookData={bookData}
              bookId={book?.id}
              initialCfi={book?.currentRef}
              settingsOpen={settingsOpen}
              onSettingsClose={() => setSettingsOpen(false)}
              tocOpen={tocOpen}
              onTocClose={() => setTocOpen(false)}
              onSectionChange={setCurrentSection}
              config={config}
              onConfigChange={handleConfigChange}
            />
          </Box>
        )
      }

    </Box>
  );
}


