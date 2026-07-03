import { alpha } from "@mui/material";
import type { Theme } from "@mui/material";

export type LevelTone = {
  color: string;
  softColor: string;
  status: string;
};

export function getLevelTone(level: number, theme: Theme): LevelTone {
  if (level <= 5) {
    return {
      color: '#fc8f30',
      softColor: alpha(theme.palette.warning.main, 0.14),
      status: "Learning",
    };
  }

  if (level <= 10) {
    return {
      color: '#31c48c',
      softColor: alpha(theme.palette.success.main, 0.14),
      status: "Reviewing",
    };
  }

  return {
    color: '#246cc9',
    softColor: alpha(theme.palette.primary.main, 0.14),
    status: "Mastered",
  };
}
