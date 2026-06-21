import { Typography, SxProps, Theme } from '@mui/material';
import { useEffect, useState } from 'react';

type TypeWriterProps = {
  words: string[];
  typeSpeed?: number;
  eraseSpeed?: number;
  pauseMs?: number;
  sx?: SxProps<Theme>;
};

export function TypeWriter ({
  words,
  typeSpeed = 120,
  eraseSpeed = 50,
  pauseMs = 2000,
  sx,
}: TypeWriterProps) {
  const [displayed, setDisplayed] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'erasing'>('typing');

  useEffect(() => {
    if (words.length === 0) return;

    const current = words[wordIndex];

    if (phase === 'typing') {
      if (displayed.length < current.length) {
        const t = setTimeout(
          () => setDisplayed(current.slice(0, displayed.length + 1)),
          typeSpeed,
        );
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase('erasing'), pauseMs);
        return () => clearTimeout(t);
      }
    }

    if (phase === 'erasing') {
      if (displayed.length > 0) {
        const t = setTimeout(
          () => setDisplayed(prev => prev.slice(0, -1)),
          eraseSpeed,
        );
        return () => clearTimeout(t);
      } else {
        setWordIndex(i => (i + 1) % words.length);
        setPhase('typing');
      }
    }
  }, [displayed, phase, wordIndex, words, typeSpeed, eraseSpeed, pauseMs]);

  return (
    <Typography component='span' sx={[{ fontSize: 'inherit', color: 'inherit', lineHeight: 'inherit' }, ...(Array.isArray(sx) ? sx : [sx])]}>{displayed}</Typography>
  );
}
