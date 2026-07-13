/** Bu dosya, component ve guard katmanına NgRx ayrıntısı göstermeden auth state ve niyetlerini sunar. */
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AuthActions } from '../store/auth/auth.actions';
import {
  selectError,
  selectIsAdmin,
  selectIsAuthenticated,
  selectIsInitialized,
  selectStatus,
  selectUser,
} from '../store/auth/auth.selectors';

/** UI ve route katmanının authentication için kullandığı tek state köprüsüdür. */
@Injectable({ providedIn: 'root' })
export class AuthFacade {
  /** Root auth store action ve selector erişimini sağlar. */
  private readonly store = inject(Store);

  /** Güncel authentication lifecycle durumunu signal olarak sunar. */
  readonly status = this.store.selectSignal(selectStatus);

  /** Guard'ların initialization tamamlanmasını bekleyebilmesi için status akışını sunar. */
  readonly isInitialized$ = this.store.select(selectIsInitialized);

  /** Hassas token veya Keycloak kimliği içermeyen kullanıcı görünümünü sunar. */
  readonly user = this.store.selectSignal(selectUser);

  /** Guard'ların rol kararını tek state emissionı üzerinden verebilmesi için kullanıcı akışını sunar. */
  readonly user$ = this.store.select(selectUser);

  /** Kullanıcının doğrulanmış oturum durumunu sunar. */
  readonly isAuthenticated = this.store.selectSignal(selectIsAuthenticated);

  /** Auth guard'ın initialization sonrası oturum kararını observable olarak tüketmesini sağlar. */
  readonly isAuthenticated$ = this.store.select(selectIsAuthenticated);

  /** İlk SSO kontrolünün tamamlanma durumunu guard ve shell katmanına sunar. */
  readonly isInitialized = this.store.selectSignal(selectIsInitialized);

  /** Admin öncelikli role redirect kararı için rol durumunu sunar. */
  readonly isAdmin = this.store.selectSignal(selectIsAdmin);

  /** Login/register yönlendirme veya initialization hatasını UI'a sunar. */
  readonly error = this.store.selectSignal(selectError);

  /** Uygulama başlangıcında mevcut Keycloak oturum kontrolünü başlatır. */
  initialize(): void {
    this.store.dispatch(AuthActions.initialize());
  }

  /** Kullanıcının Keycloak sign-in ekranına gitme niyetini yayınlar. */
  login(): void {
    this.store.dispatch(AuthActions.signInRequested());
  }

  /** Kullanıcının Keycloak create-account ekranına gitme niyetini yayınlar. */
  register(): void {
    this.store.dispatch(AuthActions.registrationRequested());
  }

  /** Kullanıcının Keycloak oturumunu kapatma niyetini yayınlar. */
  logout(): void {
    this.store.dispatch(AuthActions.logoutRequested());
  }
}
