import { Box, type SxProps, type Theme } from "@mui/material";
import { useEffect, useState } from "react";

interface ImageLoaderProps {
  coverId: string | null;
  alt?: string;
  sx?: SxProps<Theme>;
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '';

export function ImageLoader ({ coverId, alt = '', sx }: ImageLoaderProps) {
  const [src, setSrc] = useState<string | null>(null);
  const [prevCoverId, setPrevCoverId] = useState(coverId);

  if (prevCoverId !== coverId) {
    setPrevCoverId(coverId);
    setSrc(null);
  }

  useEffect(() => {
    if (coverId == null) return;

    let objectUrl: string | null = null;
    const abortController = new AbortController();

    fetch(`${apiBaseUrl}/Mobile/Files/${coverId}`, {
      signal: abortController.signal,
    }).then(async (response) => {
      if (!response.ok) return;
      objectUrl = URL.createObjectURL(await response.blob());
      setSrc(objectUrl);
    }).catch(() => { /* aborted or failed — stay hidden */ });

    return () => {
      abortController.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [coverId]);

  if (!src) return null;

  return (
    <Box
      role="img"
      aria-label={alt}
      sx={{
        width: '100%',
        height: '100%',
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        animation: 'imageLoaderFadeIn 300ms ease',
        '@keyframes imageLoaderFadeIn': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        ...sx,
      }}
    />
  );
}
