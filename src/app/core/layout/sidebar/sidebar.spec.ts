/**
 * Verifies safe session rendering, settings navigation, and the real logout intent.
 * The profile card must never become a demo-only interaction.
 */
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthFacade } from '../../auth/auth.facade';
import { Sidebar } from './sidebar';

describe('Sidebar', () => {
  /** Creates a sidebar with a safe token view and observable logout mock. */
  async function createSidebar(): Promise<{
    fixture: ComponentFixture<Sidebar>;
    logout: ReturnType<typeof vi.fn>;
  }> {
    const logout = vi.fn();

    // Router and auth providers mirror the production dependencies of the sidebar.
    await TestBed.configureTestingModule({
      imports: [Sidebar],
      providers: [
        provideRouter([]),
        {
          provide: AuthFacade,
          useValue: {
            user: signal({
              username: 'ali.yilmaz',
              email: 'ali@example.com',
              roles: ['basic_user'],
            }),
            logout,
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(Sidebar);
    fixture.detectChanges();
    return { fixture, logout };
  }

  /** Shows the safe username and readable role in the profile card. */
  it('renders the authenticated user summary', async () => {
    const { fixture } = await createSidebar();
    expect(fixture.nativeElement.textContent).toContain('ali.yilmaz');
    expect(fixture.nativeElement.textContent).toContain('Basic User');
  });

  /** Makes the complete profile card a real link to the settings page. */
  it('links the profile card to settings', async () => {
    const { fixture } = await createSidebar();
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a[href="/settings"]');
    expect(link).toBeTruthy();
    expect(link.getAttribute('aria-label')).toContain('ali.yilmaz');
  });

  /** Delegates sign out to AuthFacade instead of changing fake local state. */
  it('dispatches logout through the auth facade', async () => {
    const { fixture, logout } = await createSidebar();
    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('[aria-label="Sign out"]');
    button.click();
    expect(logout).toHaveBeenCalledOnce();
  });
});
