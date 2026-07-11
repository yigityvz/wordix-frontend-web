/**
 * Admin analytics alanının route sahipliğini ve navigation listesini tanımlar.
 * User navigation ve business sayfalarını admin panelinden kesin olarak ayırır.
 */
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AppShell } from '../app-shell/app-shell';
import { ShellNavigationItem } from '../navigation.models';

/** Yalnızca Swagger snapshotında backend desteği bulunan admin analytics sayfalarıdır. */
const ADMIN_NAVIGATION_ITEMS: readonly ShellNavigationItem[] = [
  { label: 'Admin Dashboard', route: '/admin/dashboard', shortLabel: 'AD' },
  { label: 'Top Lookups', route: '/admin/analytics/top-lookups', shortLabel: 'TL' },
  { label: 'Most Saved', route: '/admin/analytics/most-saved', shortLabel: 'MS' },
  { label: 'Quiz Insights', route: '/admin/analytics/quiz-insights', shortLabel: 'QI' },
  { label: 'Provider', route: '/admin/analytics/provider', shortLabel: 'PV' },
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
