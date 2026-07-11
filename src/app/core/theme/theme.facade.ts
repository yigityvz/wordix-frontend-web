import { Injectable, inject } from '@angular/core';

import { WordixTheme } from './theme.models';
import { ThemeService } from './theme.service';

@Injectable({ providedIn: 'root' })
export class ThemeFacade {
  private readonly themeService = inject(ThemeService);

  readonly theme = this.themeService.theme;
  readonly resolvedTheme = this.themeService.resolvedTheme;

  setTheme(theme: WordixTheme): void {
    this.themeService.setTheme(theme);
  }
}
