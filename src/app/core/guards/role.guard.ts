/** Bu dosya, authenticated route erişimini token içindeki Wordix realm rollerine göre sınırlar. */
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { combineLatest, filter, map, take } from 'rxjs';

import { AuthFacade } from '../auth/auth.facade';
import { WordixRole } from '../auth/auth.models';

/** Verilen Wordix rollerinden en az birine sahip kullanıcıları kabul eden functional guard üretir. */
export function roleGuard(allowedRoles: readonly WordixRole[]): CanActivateFn {
  /** Initialization ve güvenli auth kullanıcı state'ini birlikte değerlendirir. */
  return (_route, state) => {
    const authFacade = inject(AuthFacade);
    const router = inject(Router);

    // Kullanıcı ve rol kararı ancak ilk Keycloak SSO kontrolü tamamlandıktan sonra verilir.
    return combineLatest([authFacade.isInitialized$, authFacade.user$]).pipe(
      filter(([isInitialized]) => isInitialized),
      take(1),
      map(([_isInitialized, user]) => {
        // Oturumu olmayan kullanıcı login yüzeyine ve mevcut returnUrl bilgisine yönlendirilir.
        if (!user) {
          return router.createUrlTree(['/'], {
            queryParams: { returnUrl: state.url },
          });
        }

        // Token claimindeki rollerden biri route requirement ile eşleşirse erişime izin verir.
        if (allowedRoles.some((role) => user.roles.includes(role))) {
          return true;
        }

        // Authenticated fakat yetkisiz kullanıcı ayrı forbidden sayfasına gönderilir.
        return router.createUrlTree(['/forbidden']);
      }),
    );
  };
}

/** Admin route ağaçlarında tekrar kullanılacak canonical admin role guardıdır. */
export const adminGuard: CanActivateFn = roleGuard(['admin']);
