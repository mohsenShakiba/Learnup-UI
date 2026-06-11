import { Box } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';

type TextCarouselProps = {
  items: ReactNode[];
  intervalMs?: number;
  fadeMs?: number;
};

export function TextCarousel ({
  items,
  intervalMs = 2000,
  fadeMs = 400,
}: TextCarouselProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (items.length < 2) return;

    const fadeOut = setTimeout(() => setVisible(false), intervalMs);
    const swap = setTimeout(() => {
      setIndex(i => (i + 1) % items.length);
      setVisible(true);
    }, intervalMs + fadeMs);

    return () => {
      clearTimeout(fadeOut);
      clearTimeout(swap);
    };
  }, [index, items.length, intervalMs, fadeMs]);

  if (items.length === 0) return null;

  return (
    <Box
      component='span'
      sx={{
        display: 'inline-block',
        opacity: visible ? 1 : 0,
        transition: `opacity ${fadeMs}ms ease-in-out`,
      }}
    >
      {items[index]}
    </Box>
  );
}
