/**
 * Owns desktop shell navigation, the safe session summary, and compact mode.
 * Navigation items still come from the owning user or admin shell.
 */
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthFacade } from '../../auth/auth.facade';
import { NavigationIcon } from '../navigation-icon/navigation-icon';
import { ShellNavigationItem } from '../navigation.models';

@Component({
  selector: 'wx-sidebar',
  imports: [NavigationIcon, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  /** Provides the safe token view and the real Keycloak logout intent. */
  private readonly authFacade = inject(AuthFacade);

  /** Renders only the navigation routes allowed by the owning shell. */
  readonly items = input<readonly ShellNavigationItem[]>([]);

  /** Stores expanded or compact sidebar mode as local presentation state. */
  protected readonly collapsed = signal(false);

  /** Exposes the safe authenticated user view without token identifiers. */
  protected readonly user = this.authFacade.user;

  /** Uses username, then email, then a safe product fallback. */
  protected readonly displayName = computed(
    () => this.user()?.username ?? this.user()?.email ?? 'Wordix user',
  );

  /** Selects the settings route owned by the authenticated user or admin shell. */
  protected readonly settingsRoute = computed(() =>
    this.user()?.roles.includes('admin') ? '/admin/settings' : '/settings',
  );

  /** Produces the single avatar initial shown in the profile card. */
  protected readonly userInitial = computed(
    () => this.displayName().trim().charAt(0).toUpperCase() || 'W',
  );

  /** Converts token roles into a readable account label. */
  protected readonly roleLabel = computed(() =>
    this.user()?.roles.includes('admin') ? 'Administrator' : 'Basic User',
  );

  /** Switches the sidebar between full and compact presentation. */
  protected toggleCollapsed(): void {
    this.collapsed.update((collapsed) => !collapsed);
  }

  /** Ends the current session through the existing Keycloak logout flow. */
  protected logout(): void {
    this.authFacade.logout();
  }
}
