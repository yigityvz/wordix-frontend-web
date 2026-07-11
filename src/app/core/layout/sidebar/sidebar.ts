/**
 * Masaüstü shell navigation alanını ve kullanıcı kontrollü kompakt modu yönetir.
 * Navigation verisini shell sahibinden alarak user ve admin route listelerini birbirinden ayırır.
 */
import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { ShellNavigationItem } from '../navigation.models';

@Component({
  selector: 'wx-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  /** Yalnızca shell tarafından izin verilen route bağlantılarını render eder. */
  readonly items = input<readonly ShellNavigationItem[]>([]);

  /** Sidebar genişliğinin tam veya kompakt olduğunu browser-local UI state olarak tutar. */
  protected readonly collapsed = signal(false);

  /** Kullanıcı butona bastığında sidebar genişliğini iki mod arasında değiştirir. */
  protected toggleCollapsed(): void {
    // Mevcut değer tersine çevrilerek tek bir deterministik local mutation uygulanır.
    this.collapsed.update((collapsed) => !collapsed);
  }
}
