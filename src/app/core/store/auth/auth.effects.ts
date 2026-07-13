/** Bu dosya, auth actionlarını Keycloak adapter çağrılarına ve session eventlerine bağlar. */
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, from, map, mergeMap, of } from 'rxjs';

import { KeycloakService } from '../../auth/keycloak.service';
import { AuthActions } from './auth.actions';

/** Keycloak yan etkilerini reducer ve componentlerden izole eden root auth effect grubudur. */
@Injectable()
export class AuthEffects {
  /** NgRx action akışını effectlere sağlar. */
  private readonly actions$ = inject(Actions);

  /** Resmi Keycloak adapter operasyonlarını merkezi service üzerinden yürütür. */
  private readonly keycloakService = inject(KeycloakService);

  /** Uygulama açılışında mevcut SSO oturumunu kontrol eder ve store'u başlatır. */
  readonly initialize$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.initialize),
      exhaustMap(() =>
        from(this.keycloakService.initialize()).pipe(
          map((user) =>
            user
              ? AuthActions.initializeSuccess({ user })
              : AuthActions.initializeUnauthenticated(),
          ),
          catchError(() =>
            of(
              AuthActions.initializeFailure({
                message: 'Kimlik doğrulama servisine ulaşılamadı.',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  /** Sign-in kullanıcı niyetini Keycloak login yönlendirmesine dönüştürür. */
  readonly login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signInRequested),
      exhaustMap(({ returnUrl }) =>
        from(this.keycloakService.login(returnUrl)).pipe(
          mergeMap(() => []),
          catchError(() => of(AuthActions.redirectFailure({ message: 'Giriş ekranı açılamadı.' }))),
        ),
      ),
    ),
  );

  /** Create-account kullanıcı niyetini Keycloak registration yönlendirmesine dönüştürür. */
  readonly register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registrationRequested),
      exhaustMap(({ returnUrl }) =>
        from(this.keycloakService.register(returnUrl)).pipe(
          mergeMap(() => []),
          catchError(() => of(AuthActions.redirectFailure({ message: 'Kayıt ekranı açılamadı.' }))),
        ),
      ),
    ),
  );

  /** Logout kullanıcı niyetini Keycloak session sonlandırma yönlendirmesine dönüştürür. */
  readonly logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logoutRequested),
      exhaustMap(() =>
        from(this.keycloakService.logout()).pipe(
          mergeMap(() => []),
          catchError(() =>
            of(AuthActions.redirectFailure({ message: 'Çıkış işlemi başlatılamadı.' })),
          ),
        ),
      ),
    ),
  );

  /** Adapter callbacklerinden gelen login, refresh ve logout değişimlerini auth state'e taşır. */
  readonly sessionChanges$ = createEffect(() =>
    this.keycloakService.sessionChanges$.pipe(map((user) => AuthActions.sessionChanged({ user }))),
  );
}
