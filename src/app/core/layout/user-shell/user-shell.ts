/**
 * Basic user alanının route sahipliğini ve navigation listesini tanımlar.
 * Admin route'larını user uygulamasından uzak tutarak iki panelin bağımsız gelişmesini sağlar.
 */
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppShell } from '../app-shell/app-shell';
import { ShellNavigationItem } from '../navigation.models';

/** Yalnızca route'u gerçekten uygulanmış user sayfalarını navigation'a açar. */
const USER_NAVIGATION_ITEMS: readonly ShellNavigationItem[] = [
  { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
  { label: 'Lookup', route: '/lookup', icon: 'search' },
  { label: 'Dictionary', route: '/dictionary', icon: 'dictionary' },
  { label: 'Decks', route: '/decks', icon: 'decks' },
  { label: 'Quiz', route: '/quizzes/start', icon: 'quiz' },
  { label: 'Statistics', route: '/statistics', icon: 'statistics' },
  { label: 'Settings', route: '/settings', icon: 'settings' },
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
