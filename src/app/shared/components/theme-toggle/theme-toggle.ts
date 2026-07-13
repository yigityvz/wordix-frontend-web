/**
 * Generic light/dark/system geçiş butonunu sunar.
 * Tek ikonlu görünümü korurken üç tema tercihinin tamamını erişilebilir kılar.
 */
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

export type ThemeToggleValue = 'light' | 'dark' | 'system';

@Component({
  selector: 'wx-theme-toggle',
  templateUrl: './theme-toggle.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggle {
  /** Merkezi tema katmanındaki seçili kullanıcı tercihini alır. */
  readonly theme = input.required<ThemeToggleValue>();

  /** System tercihinin ekranda çözüldüğü gerçek light veya dark görünümü alır. */
  readonly resolvedTheme = input<'light' | 'dark'>('light');

  /** Kullanıcının seçtiği sıradaki tema tercihini parent bileşene yayınlar. */
  readonly themeChange = output<ThemeToggleValue>();

  /** Mevcut tercihten sonra uygulanacak light, dark veya system değerini hesaplar. */
  protected readonly nextTheme = computed<ThemeToggleValue>(() => {
    if (this.theme() === 'system') {
      return this.resolvedTheme() === 'dark' ? 'light' : 'dark';
    }

    return this.theme() === 'light' ? 'dark' : 'system';
  });

  /** System tercihini görünür sun/moon ikonu için çözümlenmiş moda dönüştürür. */
  protected readonly displayTheme = computed(() =>
    this.theme() === 'system' ? this.resolvedTheme() : this.theme(),
  );

  /** Screen reader ve tooltip için mevcut ve sıradaki modu açıklar. */
  protected readonly accessibleLabel = computed(
    () => this.themeLabel(this.theme()) + ' theme. Switch to ' + this.themeLabel(this.nextTheme()) + ' theme',
  );

  /** Tek ikon butonuna basıldığında sıradaki tema tercihini yayınlar. */
  protected selectNextTheme(): void {
    this.themeChange.emit(this.nextTheme());
  }

  /** Teknik tema anahtarını kullanıcıya okunabilir etikete dönüştürür. */
  private themeLabel(theme: ThemeToggleValue): string {
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  }
}
