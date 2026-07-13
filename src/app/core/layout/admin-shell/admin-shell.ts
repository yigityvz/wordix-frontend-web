/**
 * Admin analytics alanının route sahipliğini ve navigation listesini tanımlar.
 * User navigation ve business sayfalarını admin panelinden kesin olarak ayırır.
 */
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppShell } from '../app-shell/app-shell';
import { ShellNavigationItem } from '../navigation.models';

/** Yalnızca canlı Swagger desteği olan admin analytics sayfalarını navigation'a açar. */
const ADMIN_NAVIGATION_ITEMS: readonly ShellNavigationItem[] = [
  { label: 'Dashboard', route: '/admin/dashboard', icon: 'dashboard' },
  { label: 'Top Lookups', route: '/admin/analytics/top-lookups', icon: 'trending' },
  { label: 'Most Saved', route: '/admin/analytics/most-saved', icon: 'saved' },
  { label: 'Quiz Insights', route: '/admin/analytics/quiz-insights', icon: 'wrong' },
  { label: 'Provider Stats', route: '/admin/analytics/provider', icon: 'provider' },
  { label: 'Settings', route: '/admin/settings', icon: 'settings' },
];

@Component({
  selector: 'wx-admin-shell',
  imports: [AppShell],
  templateUrl: './admin-shell.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminShell {
  /** Template'in yalnızca admin analytics route'larını generic shell'e iletmesini sağlar. */
  protected readonly navigationItems = ADMIN_NAVIGATION_ITEMS;
}
