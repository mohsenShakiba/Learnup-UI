import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';

type ReplaceTypeWriterProps = {
  words: string[];
  typeSpeed?: number;
  pauseMs?: number;
};

export function ReplaceTypeWriter ({
  words,
  typeSpeed = 120,
  pauseMs = 2000,
}: ReplaceTypeWriterProps) {
  const [displayed, setDisplayed] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (words.length === 0) return;

    const target = words[wordIndex];

    if (charIndex < target.length) {
      const t = setTimeout(() => {
        setDisplayed(prev => target.slice(0, charIndex + 1) + prev.slice(charIndex + 1));
        setCharIndex(c => c + 1);
      }, typeSpeed);
      return () => clearTimeout(t);
    }

    if (displayed.length > target.length) {
      const t = setTimeout(
        () => setDisplayed(prev => prev.slice(0, -1)),
        typeSpeed,
      );
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      setWordIndex(i => (i + 1) % words.length);
      setCharIndex(0);
    }, pauseMs);
    return () => clearTimeout(t);
  }, [displayed, charIndex, wordIndex, words, typeSpeed, pauseMs]);

  return (
    <Typography component='span' sx={{ fontSize: 'inherit', color: 'inherit', lineHeight: 'inherit' }}>{displayed}</Typography>
  );
}
