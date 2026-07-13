/** Bu dosya, protected user ve admin route'larına yalnızca doğrulanmış oturumları kabul eder. */
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, switchMap, take } from 'rxjs';

import { AuthFacade } from '../auth/auth.facade';

/** Keycloak initialization tamamlandıktan sonra authenticated route erişimini değerlendirir. */
export const authGuard: CanActivateFn = (_route, state) => {
  const authFacade = inject(AuthFacade);
  const router = inject(Router);

  // Guard'ın başlangıçtaki idle/initializing state yüzünden yanlış login yönlendirmesi yapmasını önler.
  return authFacade.isInitialized$.pipe(
    filter((isInitialized) => isInitialized),
    take(1),
    switchMap(() => authFacade.isAuthenticated$.pipe(take(1))),
    map((isAuthenticated) => {
      // Geçerli Keycloak oturumu protected route aktivasyonuna devam eder.
      if (isAuthenticated) {
        return true;
      }

      // Login sonrasında hedef route'a dönülebilmesi için yalnızca uygulama içi URL'yi saklar.
      return router.createUrlTree(['/'], {
        queryParams: { returnUrl: state.url },
      });
    }),
  );
};
