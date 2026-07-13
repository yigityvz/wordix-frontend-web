/** Bu dosya, auth guard'ın initialization bekleme ve login returnUrl davranışını doğrular. */
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { firstValueFrom, Observable, of } from 'rxjs';
import { describe, expect, it } from 'vitest';

import { AuthFacade } from '../auth/auth.facade';
import { authGuard } from './auth.guard';

// Authenticated ve unauthenticated route kararlarını gerçek Angular UrlTree ile sınar.
describe('authGuard', () => {
  // Initialization tamamlandıktan sonra authenticated kullanıcının route'a devam ettiğini doğrular.
  it('allows an authenticated user after initialization', async () => {
    configureAuthFacade(of(false, true), of(true));

    await expect(runGuard('/dashboard')).resolves.toBe(true);
  });

  // Oturumu olmayan kullanıcı için login route'u ve güvenli returnUrl üretildiğini doğrular.
  it('redirects an unauthenticated user to the login entry', async () => {
    configureAuthFacade(of(true), of(false));

    const result = await runGuard('/dictionary');
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe(
      '/?returnUrl=%2Fdictionary',
    );
  });
});

/** Test senaryosuna uygun observable auth facade ve boş router yapılandırmasını hazırlar. */
function configureAuthFacade(
  isInitialized$: Observable<boolean>,
  isAuthenticated$: Observable<boolean>,
): void {
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      {
        provide: AuthFacade,
        useValue: { isInitialized$, isAuthenticated$ },
      },
    ],
  });
}

/** Functional auth guard'ı Angular injection context içinde çalıştırıp ilk kararını döndürür. */
function runGuard(url: string): Promise<boolean | UrlTree> {
  const result = TestBed.runInInjectionContext(() =>
    authGuard({} as ActivatedRouteSnapshot, { url } as RouterStateSnapshot),
  ) as Observable<boolean | UrlTree>;

  return firstValueFrom(result);
}
