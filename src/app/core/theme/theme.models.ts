export type WordixTheme = 'light' | 'dark' | 'system';

export type ResolvedWordixTheme = Exclude<WordixTheme, 'system'>;

export const WORDIX_THEME_STORAGE_KEY = 'wordix-theme';

export const WORDIX_THEMES: readonly WordixTheme[] = ['light', 'dark', 'system'];

export function isWordixTheme(value: unknown): value is WordixTheme {
  return typeof value === 'string' && WORDIX_THEMES.includes(value as WordixTheme);
}
