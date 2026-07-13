/**
 * Verifies that user and admin shell navigation ownership never leaks across roles.
 * Each shell also owns the correct settings destination for its profile card.
 */
import { signal, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthFacade } from '../auth/auth.facade';
import { AdminShell } from './admin-shell/admin-shell';
import { UserShell } from './user-shell/user-shell';

describe('Shell navigation separation', () => {
  /** Creates a shell with the matching real application role. */
  async function createShell<T>(component: Type<T>): Promise<ComponentFixture<T>> {
    const roles = component === AdminShell ? ['admin'] : ['basic_user'];

    // Router and role-aware auth providers mirror the production shell dependencies.
    await TestBed.configureTestingModule({
      imports: [component],
      providers: [
        provideRouter([]),
        {
          provide: AuthFacade,
          useValue: {
            user: signal({ username: 'ali.yilmaz', email: 'ali@example.com', roles }),
            logout: vi.fn(),
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(component);
    fixture.detectChanges();
    return fixture;
  }

  /** Keeps admin analytics links out of the basic user shell. */
  it('does not render admin routes in the user shell', async () => {
    const fixture = await createShell(UserShell);
    expect(fixture.nativeElement.querySelectorAll('a[href="/dashboard"]')).toHaveLength(2);
    expect(fixture.nativeElement.querySelector('a[href^="/admin"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('a[href="/settings"]')).not.toBeNull();
  });

  /** Keeps basic user routes out of the admin shell and uses admin settings. */
  it('does not render user routes in the admin shell', async () => {
    const fixture = await createShell(AdminShell);
    expect(fixture.nativeElement.querySelectorAll('a[href="/admin/dashboard"]')).toHaveLength(2);
    expect(fixture.nativeElement.querySelector('a[href="/dashboard"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('a[href="/admin/settings"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('a[href="/settings"]')).toBeNull();
  });
});
