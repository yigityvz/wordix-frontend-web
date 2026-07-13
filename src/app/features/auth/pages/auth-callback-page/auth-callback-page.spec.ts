/** Bu dosya, authenticated callback akışının gerçek profile load niyetini başlattığını doğrular. */
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthFacade } from '@core/auth/auth.facade';
import { AuthNavigationService } from '@core/auth/auth-navigation.service';
import { ProfileFacade } from '@features/profile/facades/profile.facade';
import { describe, expect, it, vi } from 'vitest';

import { AuthCallbackPage } from './auth-callback-page';

/** Callback sayfasının fake timer olmadan auth ve profile state'ine tepki vermesini sınar. */
describe('AuthCallbackPage', () => {
  /** Authenticated session hazır olduğunda `/api/profile/me` facade yüklemesini tetikler. */
  it('requests the real profile after authentication is initialized', () => {
    const load = vi.fn();

    TestBed.configureTestingModule({
      imports: [AuthCallbackPage],
      providers: [
        {
          provide: AuthFacade,
          useValue: {
            status: signal('authenticated'),
            error: signal(null),
            isInitialized: signal(true),
            isAuthenticated: signal(true),
            initialize: vi.fn(),
          },
        },
        {
          provide: ProfileFacade,
          useValue: {
            status: signal('idle'),
            profile: signal(null),
            error: signal(null),
            load,
          },
        },
        { provide: AuthNavigationService, useValue: { consumeReturnUrl: () => null } },
        { provide: Router, useValue: { navigateByUrl: vi.fn().mockResolvedValue(true) } },
      ],
    });

    const fixture = TestBed.createComponent(AuthCallbackPage);
    fixture.detectChanges();

    expect(load).toHaveBeenCalledOnce();
  });
});
