import {
  Box,
  Dialog,
  DialogContent,
  Icon,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { VocabsService } from '../../api/Learnup';
import { AppLoader } from '../../shared/components/AppLoader';
import { Scaffold } from '../../shared/components/Scaffold';
import { VocabListItem } from './components/VocabListItem';

interface ISpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}

interface ISpeechRecognitionConstructor {
  new(): ISpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: ISpeechRecognitionConstructor;
    webkitSpeechRecognition: ISpeechRecognitionConstructor;
  }
}

export default function VocabSearchPage() {
  const [input, setInput] = useState('');
  const [searchWord, setSearchWord] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [micLang, setMicLang] = useState<'fa-IR' | 'en-US'>('en-US');
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setSearchWord(input.trim()), 200);
    return () => clearTimeout(timer);
  }, [input]);

  useEffect(() => {
    return () => recognitionRef.current?.stop();
  }, []);

  const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
  const isMicSupported = !!SpeechRecognitionAPI;

  const startListening = (lang: 'fa-IR' | 'en-US') => {
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      setDialogOpen(false);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const openMicDialog = () => {
    setDialogOpen(true);
    startListening(micLang);
  };

  const closeMicDialog = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setDialogOpen(false);
  };

  const toggleMicInDialog = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      startListening(micLang);
    }
  };

  const switchLang = (newLang: 'fa-IR' | 'en-US') => {
    if (newLang === micLang) return;
    setMicLang(newLang);
    if (isListening) {
      recognitionRef.current?.stop();
    }
  };

  const query = useQuery({
    queryKey: ['vocab-search', searchWord],
    queryFn: () => VocabsService.getVocabByWord(searchWord),
    enabled: searchWord.length > 0,
  });

  return (
    <Scaffold>
      <Stack spacing={2}>
        <TextField
          fullWidth
          placeholder="جستجوی کلمات و لغات"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  {isMicSupported && (
                    <IconButton onClick={openMicDialog} size="small">
                      <Icon>mic_none</Icon>
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            },
          }}
        />

        {input.length === 0 && (
          <Stack spacing={1} sx={{ alignItems: 'center', py: 4, color: 'text.secondary' }}>
            <Icon sx={{ fontSize: 48, opacity: 0.3 }}>search</Icon>
            <Typography variant="body2" sx={{ textAlign: 'center' }}>
              کلمه‌ای را به فارسی یا انگلیسی تایپ کنید
            </Typography>
            <Typography variant="caption" sx={{ textAlign: 'center', opacity: 0.7 }}>
              برای جستجوی صوتی روی آیکون میکروفون ضربه بزنید
            </Typography>
          </Stack>
        )}

        {query.isLoading && <AppLoader />}

        {query.isError && <Typography color="error">خطا در جستجو</Typography>}

        {query.data && query.data.length === 0 && (
          <Stack spacing={1} sx={{ alignItems: 'center', py: 4, color: 'text.secondary' }}>
            <Icon sx={{ fontSize: 48, opacity: 0.3 }}>sentiment_dissatisfied</Icon>
            <Typography variant="body2">نتیجه‌ای برای «{searchWord}» یافت نشد</Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>املای کلمه را بررسی کنید یا کلمه دیگری امتحان کنید</Typography>
          </Stack>
        )}

        {query.data && query.data.length > 0 && (
          <Stack spacing={1.5}>
            {query.data.map((vocab) => (
              <VocabListItem key={vocab.id} vocab={vocab} />
            ))}
          </Stack>
        )}
      </Stack>

      <Dialog open={dialogOpen} onClose={closeMicDialog} slotProps={{ paper: { sx: { borderRadius: 4, m: 2 } } }}>
        <DialogContent>
          <Stack spacing={3} sx={{ py: 2, px: 3, alignItems: 'center' }}>

            {/* Mic button with pulse animation */}
            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isListening && (
                <Box sx={{
                  position: 'absolute',
                  width: 80,
                  height: 80,
                  borderRadius: 999,
                  backgroundColor: 'error.main',
                  opacity: 0.3,
                  animation: 'ripple 1.4s ease-out infinite',
                  '@keyframes ripple': {
                    '0%': { transform: 'scale(1)', opacity: 0.3 },
                    '100%': { transform: 'scale(2.2)', opacity: 0 },
                  },
                }} />
              )}
              <IconButton
                onClick={toggleMicInDialog}
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 999,
                  backgroundColor: isListening ? 'error.main' : 'action.selected',
                  color: isListening ? 'white' : 'text.primary',
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    backgroundColor: isListening ? 'error.dark' : 'action.hover',
                  },
                }}
              >
                <Icon sx={{ fontSize: 36 }}>{isListening ? 'mic' : 'mic_none'}</Icon>
              </IconButton>
            </Box>

            <Typography variant="body2" color={'text.secondary'}>
              {isListening ? 'در حال گوش دادن...' : 'برای شروع ضربه بزنید'}
            </Typography>

            {/* Language toggle */}
            <ToggleButtonGroup
              fullWidth
              value={micLang}
              exclusive
              onChange={(_, val) => val && switchLang(val)}
              size="small"
            >
              <ToggleButton value="fa-IR" sx={{ width: '75px' }}>فارسی</ToggleButton>
              <ToggleButton value="en-US" sx={{ width: '75px' }}>English</ToggleButton>
            </ToggleButtonGroup>

          </Stack>
        </DialogContent>
      </Dialog>
    </Scaffold>
  );
}
