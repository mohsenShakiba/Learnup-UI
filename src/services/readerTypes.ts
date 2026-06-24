export interface ReaderConfig {
  fontSize: number;
  fontFamily: string;
}

export interface ReaderFont {
  key: string;
  fontFace: string;
}

// Bundled reader fonts that must be injected into the section iframe, which
// does not inherit the @font-face rules declared in index.css. Each face maps
// to a file in /public/fonts; URLs are root-absolute since the iframe's base is
// the epub blob.
export const READER_FONTS: ReaderFont[] = [
  {
    key: 'Bookerly',
    fontFace: `@font-face{font-family:'Bookerly';font-style:normal;font-display:swap;src:url('/fonts/Bookerly.ttf') format('truetype');}`
  },
  {
    key: 'Merriweather',
    fontFace: `@font-face{font-family:'Merriweather';font-style:normal;font-display:swap;src:url('/fonts/Merriweather-Regular.ttf') format('truetype');}`
  },
  {
    key: 'Georgia',
    fontFace: `@font-face{font-family:'Georgia';font-style:normal;font-display:swap;src:url('/fonts/georgia.ttf') format('truetype');}`
  },
];

export const FONT_SIZES = [14, 16, 18, 20, 24];


