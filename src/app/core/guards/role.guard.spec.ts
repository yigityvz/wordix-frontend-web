/** Bu dosya, role guard'ın Keycloak realm rollerine göre admin erişimini sınırlandırdığını doğrular. */
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
import { AuthUser } from '../auth/auth.models';
import { adminGuard } from './role.guard';

// Admin, basic_user ve unauthenticated kullanıcı kararlarını ayrı ayrı sınar.
describe('adminGuard', () => {
  // Tokenında admin rolü bulunan kullanıcının admin route'una devam ettiğini doğrular.
  it('allows users with the admin realm role', async () => {
    configureAuthUser({ username: 'admin', email: null, roles: ['basic_user', 'admin'] });

    await expect(runAdminGuard('/admin/dashboard')).resolves.toBe(true);
  });

  // Sadece basic_user rolü bulunan authenticated kullanıcının forbidden sayfasına gittiğini doğrular.
  it('redirects authenticated users without the admin role to forbidden', async () => {
    configureAuthUser({ username: 'user', email: null, roles: ['basic_user'] });

    const result = await runAdminGuard('/admin/dashboard');
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/forbidden');
  });

  // Oturumu olmayan kullanıcının önce login girişine ve returnUrl bilgisine yönlendirildiğini doğrular.
  it('redirects unauthenticated users to login before checking roles', async () => {
    configureAuthUser(null);

    const result = await runAdminGuard('/admin/dashboard');
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe(
      '/?returnUrl=%2Fadmin%2Fdashboard',
    );
  });
});

/** Role guard için initialization tamamlanmış auth kullanıcı state'i ve router sağlar. */
function configureAuthUser(user: AuthUser | null): void {
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      {
        provide: AuthFacade,
        useValue: { isInitialized$: of(true), user$: of(user) },
      },
    ],
  });
}

/** Canonical admin guard'ı Angular injection context içinde çalıştırıp ilk kararını döndürür. */
function runAdminGuard(url: string): Promise<boolean | UrlTree> {
  const result = TestBed.runInInjectionContext(() =>
    adminGuard({} as ActivatedRouteSnapshot, { url } as RouterStateSnapshot),
  ) as Observable<boolean | UrlTree>;

  return firstValueFrom(result);
}
