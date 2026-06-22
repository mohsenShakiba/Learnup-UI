export type Theme = 'light' | 'sepia' | 'dark';

export interface ReaderConfig {
  theme: Theme;
  fontFamily: string;
  fontSize: number;
  lineSpacing: number;
  padding: number;
}

export interface NavItem {
  id: string;
  href: string;
  label: string;
  subitems?: NavItem[];
}

export const FONTS = ['Default', 'Georgia', 'Arial', 'Verdana', 'Courier New'];

export const THEMES: Record<Theme, { label: string; bg: string; color: string; border: string }> = {
  light: { label: 'Light', bg: '#ffffff', color: '#1a1a1a', border: '#e0e0e0' },
  sepia: { label: 'Sepia', bg: '#f4ecd8', color: '#5b4636', border: '#d4b896' },
  dark: { label: 'Dark', bg: '#1a1a1a', color: '#d4d4d4', border: '#333333' },
};

export const DEFAULT_CONFIG: ReaderConfig = {
  theme: 'light',
  fontFamily: 'Default',
  fontSize: 16,
  lineSpacing: 1.6,
  padding: 24,
};
