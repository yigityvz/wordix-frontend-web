/** Tests persistence, explicit selection, and live system-theme behavior of ThemeService. */
import { TestBed } from '@angular/core/testing';

import { WORDIX_THEME_STORAGE_KEY } from './theme.models';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let prefersDark = false;
  let changeListener: (() => void) | undefined;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = '';

    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: () => ({
        get matches() {
          return prefersDark;
        },
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addEventListener: (_event: string, listener: () => void) => {
          changeListener = listener;
        },
        removeEventListener: () => {
          changeListener = undefined;
        },
        addListener: () => undefined,
        removeListener: () => undefined,
        dispatchEvent: () => true,
      }),
    });

    prefersDark = false;
    changeListener = undefined;
    TestBed.configureTestingModule({});
  });

  it('uses system theme by default and follows system changes', () => {
    const service = TestBed.inject(ThemeService);
    service.initialize();

    expect(service.theme()).toBe('system');
    expect(service.resolvedTheme()).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    prefersDark = true;
    changeListener?.();

    expect(service.resolvedTheme()).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('stores and applies an explicit preference', () => {
    const service = TestBed.inject(ThemeService);
    service.initialize();
    service.setTheme('dark');

    expect(service.theme()).toBe('dark');
    expect(service.resolvedTheme()).toBe('dark');
    expect(localStorage.getItem(WORDIX_THEME_STORAGE_KEY)).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
