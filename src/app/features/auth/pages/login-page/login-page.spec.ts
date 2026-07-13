/** Bu dosya, login ekranÄ±nÄ±n credential formu iÃ§ermediÄŸini ve gerÃ§ek auth facade aksiyonlarÄ±nÄ± Ã§aÄŸÄ±rdÄ±ÄŸÄ±nÄ± doÄŸrular. */
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthFacade } from '@core/auth/auth.facade';
import { ThemeFacade } from '@core/theme/theme.facade';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LoginPage } from './login-page';

/** Public auth yÃ¼zeyinin gÃ¼venli UI ve facade entegrasyonunu sÄ±nar. */
describe('LoginPage', () => {
  /** Her testte isolated component ve auth/theme baÄŸÄ±mlÄ±lÄ±klarÄ±nÄ± hazÄ±rlar. */
  let fixture: ComponentFixture<LoginPage>;
  const login = vi.fn();
  const register = vi.fn();

  /** Componenti authenticated olmayan kararlÄ± auth state ile oluÅŸturur. */
  beforeEach(async () => {
    login.mockClear();
    register.mockClear();

    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [
        {
          provide: AuthFacade,
          useValue: {
            status: signal('unauthenticated'),
            error: signal(null),
            isAuthenticated: signal(false),
            login,
            register,
            initialize: vi.fn(),
          },
        },
        {
          provide: ThemeFacade,
          useValue: { theme: signal('system'), resolvedTheme: signal('dark'), setTheme: vi.fn() },
        },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: { get: () => '/dictionary' } } },
        },
        { provide: Router, useValue: { navigateByUrl: vi.fn().mockResolvedValue(true) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();
  });

  /** Wordix'in kullanÄ±cÄ± adÄ± veya parola alanÄ± toplamadÄ±ÄŸÄ±nÄ± doÄŸrular. */
  it('does not render credential inputs', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('input')).toBeNull();
    expect(element.textContent).toContain('Continue with Keycloak');
  });

  /** Sign-in butonunun gÃ¼venli returnUrl ile gerÃ§ek facade aksiyonunu baÅŸlattÄ±ÄŸÄ±nÄ± doÄŸrular. */
  it('starts Keycloak sign-in with the requested return URL', () => {
    const buttons = fixture.nativeElement.querySelectorAll(
      'button',
    ) as NodeListOf<HTMLButtonElement>;
    const signInButton = Array.from(buttons).find((button) =>
      button.textContent?.includes('Continue with Keycloak'),
    );

    signInButton?.click();
    expect(login).toHaveBeenCalledWith('/dictionary');
  });

  /** Registration butonunun credential mutation yerine Keycloak facade aksiyonunu Ã§aÄŸÄ±rdÄ±ÄŸÄ±nÄ± doÄŸrular. */
  it('starts Keycloak registration', () => {
    const buttons = fixture.nativeElement.querySelectorAll(
      'button',
    ) as NodeListOf<HTMLButtonElement>;
    const registrationButton = Array.from(buttons).find((button) =>
      button.textContent?.includes('Create an account'),
    );

    registrationButton?.click();
    expect(register).toHaveBeenCalledWith('/dictionary');
  });
});

