import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { createLearnupTheme } from "./theme";

const rtlCache = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

import {
  getStoredThemeMode,
  THEME_MODE_STORAGE_KEY,
  ThemeModeContext,
  type ThemeMode,
} from "./themeMode";

export function LearnupThemeProvider({ children }: { children: ReactNode }) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setModeState] = useState<ThemeMode>(getStoredThemeMode);

  const setMode = (next: ThemeMode) => {
    setModeState(next);
    localStorage.setItem(THEME_MODE_STORAGE_KEY, next);
  };

  const isDark = mode === "system" ? prefersDarkMode : mode === "dark";

  const theme = useMemo(
    () => createLearnupTheme(isDark ? "dark" : "light"),
    [isDark],
  );

  useEffect(() => {
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  }, [isDark]);

  return (
    <ThemeModeContext.Provider value={{ mode, setMode, isDark }}>
      <CacheProvider value={rtlCache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </CacheProvider>
    </ThemeModeContext.Provider>
  );
}
