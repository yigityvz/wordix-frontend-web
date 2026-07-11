/**
 * Generic light/dark/system selector with no dependency on Wordix core state.
 * Remains reusable by emitting user intent while its parent owns theme orchestration.
 */
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export type ThemeToggleValue = 'light' | 'dark' | 'system';

interface ThemeOption {
  readonly value: ThemeToggleValue;
  readonly label: string;
}

@Component({
  selector: 'wx-theme-toggle',
  templateUrl: './theme-toggle.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggle {
  readonly theme = input.required<ThemeToggleValue>();
  readonly themeChange = output<ThemeToggleValue>();

  protected readonly options: readonly ThemeOption[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
  ];

  protected selectTheme(theme: ThemeToggleValue): void {
    this.themeChange.emit(theme);
  }
}
