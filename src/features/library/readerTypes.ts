export type ReaderThemeKey = 'light' | 'sepia' | 'dark';
export type TextAlign = 'left' | 'justify' | 'right' | 'center';
export type TextJustify = 'auto' | 'inter-word' | 'inter-character' | 'none';

export interface ReaderConfig {
  fontSize: number;
  // CSS font-family stack of the selected reader font.
  fontFamily: string;
  theme: ReaderThemeKey;
  textAlign: TextAlign;
  // CSS text-justify: how space is distributed when textAlign is 'justify'.
  textJustify: TextJustify;
  lineHeight: number;
}

export interface NavItem {
  id: string;
  href: string;
  label: string;
  subitems?: NavItem[];
}

export interface ReaderTheme {
  key: ReaderThemeKey;
  label: string;
  background: string;
  color: string;
}

// Reading themes. `background`/`color` are applied to both the section iframe
// body and the surrounding viewer so the whole page matches.
export const READER_THEMES: ReaderTheme[] = [
  { key: 'light', label: 'Light', background: '#ffffff', color: '#1a1a1a' },
  { key: 'sepia', label: 'Sepia', background: '#f5ecd9', color: '#5b4636' },
  { key: 'dark', label: 'Dark', background: '#1a1a1a', color: '#cfcfcf' },
];

export interface ReaderFont {
  key: string;
  label: string;
  stack: string;
}

export interface ReaderFontFace {
  family: string;
  weight: string;
  src: string;
}

// Bundled fonts that must be injected into the section iframe, which does not
// inherit the @font-face rules declared in index.css. Each maps to a file in
// /public/fonts; URLs are root-absolute since the iframe's base is the epub blob.
export const READER_FONT_FACES: ReaderFontFace[] = [
  { family: 'Roboto', weight: '300', src: "url('/fonts/Roboto-Light.ttf') format('truetype')" },
  { family: 'Roboto', weight: '400', src: "url('/fonts/Roboto-Regular.ttf') format('truetype')" },
  { family: 'IranSans', weight: '400', src: "url('/fonts/IranSans.woff2') format('woff2')" },
  { family: 'FredokaOne', weight: '300', src: "url('/fonts/FredokaOne.ttf') format('truetype')" },
  { family: 'Bookerly', weight: '400', src: "url('/fonts/Bookerly.ttf') format('truetype')" },
  { family: 'Merriweather', weight: '400', src: "url('/fonts/Merriweather-Regular.ttf') format('truetype')" },
  { family: 'Georgia', weight: '400', src: "url('/fonts/georgia.ttf') format('truetype')" },
];

// Selectable reader fonts. All but the last use bundled faces above; the
// final one falls back to whatever sans the device provides.
export const READER_FONTS: ReaderFont[] = [
  { key: 'roboto', label: 'Roboto', stack: "'Roboto', sans-serif" },
  { key: 'bookerly', label: 'Bookerly', stack: "'Bookerly', Georgia, serif" },
  { key: 'merriweather', label: 'Merriweather', stack: "'Merriweather', Georgia, serif" },
  { key: 'georgia', label: 'Georgia', stack: "'Georgia', 'Times New Roman', serif" },
  { key: 'sans', label: 'Sans', stack: "system-ui, -apple-system, sans-serif" },
];

export const TEXT_ALIGNMENTS: { key: TextAlign; label: string; }[] = [
  { key: 'left', label: 'Left' },
  { key: 'justify', label: 'Justify' },
  { key: 'right', label: 'Right' },
  { key: 'center', label: 'Center' },
];

// CSS text-justify values. Only takes effect while textAlign is 'justify'.
export const TEXT_JUSTIFY: { key: TextJustify; label: string; }[] = [
  { key: 'auto', label: 'Auto' },
  { key: 'inter-word', label: 'Word' },
  { key: 'inter-character', label: 'Char' },
  { key: 'none', label: 'None' },
];

// Selectable line heights (unitless multipliers).
export const LINE_HEIGHTS = [1.2, 1.5, 1.8, 2.1];

// The five selectable font sizes (px).
export const FONT_SIZES = [14, 16, 18, 20, 24];

export const DEFAULT_CONFIG: ReaderConfig = {
  fontSize: 20,
  fontFamily: READER_FONTS[0].stack,
  theme: 'light',
  textAlign: 'justify',
  textJustify: 'auto',
  lineHeight: 1.5,
};

const READER_CONFIG_STORAGE_KEY = 'reader-config';

// Load the persisted reader config, merged over the defaults so missing or
// newly added fields fall back gracefully. Returns defaults if nothing is
// stored or the stored value is malformed.
export function loadReaderConfig (): ReaderConfig {
  try {
    const raw = localStorage.getItem(READER_CONFIG_STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    const parsed = JSON.parse(raw) as Partial<ReaderConfig>;
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveReaderConfig (config: ReaderConfig): void {
  try {
    localStorage.setItem(READER_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch {
    // Ignore write failures (e.g. storage disabled or quota exceeded).
  }
}
