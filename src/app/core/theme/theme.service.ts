import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { DestroyRef, Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

import {
  isWordixTheme,
  ResolvedWordixTheme,
  WordixTheme,
  WORDIX_THEME_STORAGE_KEY,
} from './theme.models';

const DARK_MODE_QUERY = '(prefers-color-scheme: dark)';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);
  private readonly selectedTheme = signal<WordixTheme>('system');
  private readonly activeTheme = signal<ResolvedWordixTheme>('light');

  private mediaQuery: MediaQueryList | undefined;
  private initialized = false;

  readonly theme = this.selectedTheme.asReadonly();
  readonly resolvedTheme = this.activeTheme.asReadonly();

  initialize(): void {
    if (!this.isBrowser || this.initialized) {
      return;
    }

    this.initialized = true;
    this.mediaQuery = window.matchMedia(DARK_MODE_QUERY);
    this.selectedTheme.set(this.readStoredTheme());
    this.applyTheme();

    const handleSystemThemeChange = (): void => {
      if (this.selectedTheme() === 'system') {
        this.applyTheme();
      }
    };

    this.mediaQuery.addEventListener('change', handleSystemThemeChange);
    this.destroyRef.onDestroy(() =>
      this.mediaQuery?.removeEventListener('change', handleSystemThemeChange),
    );
  }

  setTheme(theme: WordixTheme): void {
    this.selectedTheme.set(theme);

    if (this.isBrowser) {
      this.storeTheme(theme);
      this.applyTheme();
    }
  }

  private applyTheme(): void {
    const resolvedTheme = this.resolveTheme();
    const root = this.document.documentElement;

    this.activeTheme.set(resolvedTheme);
    root.classList.toggle('dark', resolvedTheme === 'dark');
    root.style.colorScheme = resolvedTheme;
  }

  private resolveTheme(): ResolvedWordixTheme {
    const theme = this.selectedTheme();

    if (theme !== 'system') {
      return theme;
    }

    return this.mediaQuery?.matches ? 'dark' : 'light';
  }

  private readStoredTheme(): WordixTheme {
    try {
      const storedTheme = localStorage.getItem(WORDIX_THEME_STORAGE_KEY);
      return isWordixTheme(storedTheme) ? storedTheme : 'system';
    } catch {
      return 'system';
    }
  }

  private storeTheme(theme: WordixTheme): void {
    try {
      localStorage.setItem(WORDIX_THEME_STORAGE_KEY, theme);
    } catch {
      // The selected theme still applies when browser storage is unavailable.
    }
  }
}
