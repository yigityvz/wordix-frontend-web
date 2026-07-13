/**
 * Responsive shell başlığını ve gerçek tema tercih kontrolünü sunar.
 * Backend desteği gelmeden profil, arama veya bildirim davranışı taklit etmez.
 */
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ThemeToggle } from '@shared/components/theme-toggle/theme-toggle';

import { ThemeFacade } from '../../theme/theme.facade';
import { WordixTheme } from '../../theme/theme.models';

@Component({
  selector: 'wx-navbar',
  imports: [ThemeToggle],
  templateUrl: './navbar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  /** Tema state ve mutation detaylarını componentten ayırmak için facade kullanılır. */
  private readonly themeFacade = inject(ThemeFacade);

  /** Shell sahibinin o anki sayfa bağlamına göre göstereceği başlıktır. */
  readonly pageTitle = input('Wordix');

  /** Seçili tercihi template'e salt okunur signal olarak açar. */
  protected readonly theme = this.themeFacade.theme;

  /** Exposes the resolved visual mode used by the theme icon. */
  protected readonly resolvedTheme = this.themeFacade.resolvedTheme;

  /** Theme toggle tarafından yayınlanan kullanıcı tercihini merkezi facade'e iletir. */
  protected changeTheme(theme: WordixTheme): void {
    // Tercihin saklanması ve html.dark yönetimi ThemeService içinde tek noktadan yapılır.
    this.themeFacade.setTheme(theme);
  }
}
