/**
 * Masaüstü, üst ve mobil navigation ile routed içeriği birleştiren generic responsive frame'dir.
 * User ve admin shell'lerinin kendi başlık ve navigation listelerini ayrı vermesine temel olur.
 */
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MobileNav } from '../mobile-nav/mobile-nav';
import { Navbar } from '../navbar/navbar';
import { ShellNavigationItem } from '../navigation.models';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'wx-app-shell',
  imports: [MobileNav, Navbar, RouterOutlet, Sidebar],
  templateUrl: './app-shell.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShell {
  /** Navbar üzerinde gösterilecek sayfa bağlamını shell sahibinden alır. */
  readonly pageTitle = input('Wordix');

  /** Sidebar ve mobile nav tarafından ortak render edilecek izinli route listesidir. */
  readonly navigationItems = input<readonly ShellNavigationItem[]>([]);
}
