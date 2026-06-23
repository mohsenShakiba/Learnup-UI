import { Box, Icon, IconButton, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BooksControllersService } from '../../api/Learnup';
import { getFileById } from '../../services/fetchFile';
import { AppLoader } from '../../shared/components/AppLoader';
import { getCachedBook, setCachedBook } from '../../stores/bookCache';
import { AiResultDrawer } from './components/AiResultDrawer';
import { ReaderAiState, ReaderComponent } from './components/ReaderComponent';
import { ReaderConfigDrawer } from './components/ReaderConfigDrawer';
import { TableOfContentsDrawer } from './components/TableOfContentsDrawer';
import { loadReaderConfig, NavItem, READER_THEMES, ReaderConfig, saveReaderConfig } from './readerTypes';



export default function BookDetailPage () {
  const { fileName } = useParams<{ fileName: string; }>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bookData, setBookData] = useState<ArrayBuffer | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [toc, setToc] = useState<NavItem[]>([]);
  const [tocNavigate, setTocNavigate] = useState<((href: string) => void) | null>(null);
  const [aiState, setAiState] = useState<ReaderAiState>({
    open: false,
    loading: false,
    error: false,
    result: null,
    word: '',
    sentence: '',
  });
  const loggedServerCfiRef = useRef<string | null>(null);
  const navigate = useNavigate();

  const booksQuery = useQuery({
    queryKey: ['userBooks'],
    queryFn: () => BooksControllersService.getUserBooks(),
  });

  const book = booksQuery.data?.find((b) => b.fileName === fileName);

  useEffect(() => {
    if (!book || loggedServerCfiRef.current === book.currentRef) return;
    loggedServerCfiRef.current = book.currentRef ?? null;
  }, [book]);

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

  const handleTocNavigateChange = (nextNavigate: ((href: string) => void) | null) => {
    setTocNavigate(() => nextNavigate);
  };

  const handleAiStateChange = (patch: Partial<ReaderAiState>) => {
    setAiState((prev) => ({ ...prev, ...patch }));
  };

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

            <Stack direction='row' sx={{ gap: 2, alignItems: 'center', justifyContent: 'space-between', color: activeTheme.color }}>
              <IconButton onClick={() => navigate(-1)} sx={{ color: 'inherit' }}>
                <Icon sx={{ opacity: 0.5 }}>arrow_forward</Icon>
              </IconButton>

              <Stack
                onClick={() => setTocOpen(true)}
                sx={{ flex: 1, minWidth: 0, alignItems: 'center', cursor: 'pointer' }}
              >
                <Typography noWrap sx={{ direction: 'rtl', color: 'inherit', textAlign: 'center', opacity: 0.5, maxWidth: '100%' }}>
                  {book?.title}
                </Typography>
                <Typography variant="caption" noWrap sx={{ direction: 'rtl', color: 'inherit', textAlign: 'center', opacity: 0.4, maxWidth: '100%' }}>
                  {currentSection ?? '-'}
                </Typography>
              </Stack>

              <IconButton onClick={() => setSettingsOpen(true)} sx={{ color: 'inherit' }}>
                <Icon sx={{ opacity: 0.5 }}>settings</Icon>
              </IconButton>
            </Stack>

            <ReaderComponent
              bookData={bookData}
              bookId={book?.id}
              initialCfi={book?.currentRef}
              onSectionChange={setCurrentSection}
              onTocChange={setToc}
              onTocNavigateChange={handleTocNavigateChange}
              onAiStateChange={handleAiStateChange}
              config={config}
            />
          </Box>
        )
      }

      <ReaderConfigDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        config={config}
        onConfigChange={handleConfigChange}
      />

      <TableOfContentsDrawer
        open={tocOpen}
        onClose={() => setTocOpen(false)}
        toc={toc}
        onNavigate={(href) => tocNavigate?.(href)}
      />

      <AiResultDrawer
        open={aiState.open}
        onOpen={() => setAiState((prev) => ({ ...prev, open: true }))}
        onClose={() => setAiState((prev) => ({ ...prev, open: false }))}
        word={aiState.word}
        sentence={aiState.sentence}
        loading={aiState.loading}
        error={aiState.error}
        result={aiState.result}
      />

    </Box>
  );
}


