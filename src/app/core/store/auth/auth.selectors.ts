/** Bu dosya, root auth state değerlerini UI için güvenli ve türetilmiş selectorlara dönüştürür. */
import { createSelector } from '@ngrx/store';

import { authFeature } from './auth.reducer';

/** NgRx feature tarafından üretilen temel auth selectorlarıdır. */
export const { selectAuthState, selectStatus, selectUser, selectError } = authFeature;

/** Kullanıcının doğrulanmış bir Keycloak oturumuna sahip olup olmadığını seçer. */
export const selectIsAuthenticated = createSelector(
  selectStatus,
  (status) => status === 'authenticated',
);

/** Uygulamanın ilk Keycloak kontrolünü tamamlayıp tamamlamadığını seçer. */
export const selectIsInitialized = createSelector(
  selectStatus,
  (status) => status !== 'idle' && status !== 'initializing',
);

/** Admin rolünün route yönlendirmesinde basic_user rolüne göre öncelikli olduğunu seçer. */
export const selectIsAdmin = createSelector(
  selectUser,
  (user) => user?.roles.includes('admin') ?? false,
);
