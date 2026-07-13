/**
 * Settings page exposes the browser-local Wordix theme preference.
 * Unsupported notification, language, and quiz preferences are intentionally excluded.
 */
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeFacade } from '@core/theme/theme.facade';
import { WordixTheme } from '@core/theme/theme.models';

/** Describes one selectable theme option rendered by the settings page. */
interface ThemeOption {
  readonly value: WordixTheme;
  readonly label: string;
  readonly description: string;
}

/** Canonical settings choices supported by the current production application. */
const THEME_OPTIONS: readonly ThemeOption[] = [
  {
    value: 'light',
    label: 'Light',
    description: 'Use the bright Coastal Blues interface.',
  },
  {
    value: 'dark',
    label: 'Dark',
    description: 'Use the low-light Wordix interface.',
  },
  {
    value: 'system',
    label: 'System',
    description: 'Follow your device theme automatically.',
  },
];

@Component({
  selector: 'wx-settings-page',
  templateUrl: './settings-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPage {
  /** Connects the page to the single theme persistence and resolution owner. */
  private readonly themeFacade = inject(ThemeFacade);

  /** Makes the three canonical settings choices available to the template. */
  protected readonly themeOptions = THEME_OPTIONS;

  /** Exposes the persisted light, dark, or system preference. */
  protected readonly selectedTheme = this.themeFacade.theme;

  /** Exposes the actual visual mode while the system preference is selected. */
  protected readonly resolvedTheme = this.themeFacade.resolvedTheme;

  /** Persists and immediately applies the selected theme through ThemeService. */
  protected selectTheme(theme: WordixTheme): void {
    this.themeFacade.setTheme(theme);
  }
}
