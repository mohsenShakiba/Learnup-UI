export interface ReaderConfig {
  fontSize: number;
}

export interface NavItem {
  id: string;
  href: string;
  label: string;
  subitems?: NavItem[];
}

// The reader always uses Roboto; only the font size is configurable.
export const READER_FONT_FAMILY = 'Roboto';

// The five selectable font sizes (px).
export const FONT_SIZES = [14, 16, 18, 20, 24];

export const DEFAULT_CONFIG: ReaderConfig = {
  fontSize: 20,
};
