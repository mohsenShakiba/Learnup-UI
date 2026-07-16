import { Box, type SxProps, type Theme } from "@mui/material";
import type { ReactNode } from "react";

export type ImagePlaceholderProps = {
  width?: number | string;
  height?: number | string;
  alt?: string;
  loading?: boolean;
  sx?: SxProps<Theme>;
  children?: ReactNode;
};

export function ImagePlaceholder({
  width = "100%",
  height = "100%",
  alt = "",
  loading = false,
  sx,
  children,
}: ImagePlaceholderProps) {
  return (
    <Box
      role="img"
      aria-label={alt}
      sx={{
        width,
        height,
        bgcolor: "action.hover",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: loading
          ? "imagePlaceholderPulse 1.2s ease-in-out infinite"
          : undefined,
        "@keyframes imagePlaceholderPulse": {
          "0%": { opacity: 0.65 },
          "50%": { opacity: 1 },
          "100%": { opacity: 0.65 },
        },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

