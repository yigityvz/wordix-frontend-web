/**
 * Basic user alanının route sahipliğini ve navigation listesini tanımlar.
 * Admin route'larını user uygulamasından uzak tutarak iki panelin bağımsız gelişmesini sağlar.
 */
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AppShell } from '../app-shell/app-shell';
import { ShellNavigationItem } from '../navigation.models';

/** Basic user tarafında backend planıyla desteklenen canonical sayfalardır. */
const USER_NAVIGATION_ITEMS: readonly ShellNavigationItem[] = [
  { label: 'Dashboard', route: '/dashboard', shortLabel: 'DB' },
  { label: 'Lookup', route: '/lookup', shortLabel: 'LU' },
  { label: 'Dictionary', route: '/dictionary', shortLabel: 'DI' },
  { label: 'Decks', route: '/decks', shortLabel: 'DE' },
  { label: 'Quiz', route: '/quizzes/start', shortLabel: 'QZ' },
  { label: 'Statistics', route: '/statistics', shortLabel: 'ST' },
  { label: 'Profile', route: '/profile', shortLabel: 'PR' },
  { label: 'Settings', route: '/settings', shortLabel: 'SE' },
];

@Component({
  selector: 'wx-user-shell',
  imports: [AppShell],
  templateUrl: './user-shell.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserShell {
  /** Template'in yalnızca user route'larını generic shell'e iletmesini sağlar. */
  protected readonly navigationItems = USER_NAVIGATION_ITEMS;
}
