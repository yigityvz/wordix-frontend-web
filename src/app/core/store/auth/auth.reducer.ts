/** Bu dosya, authentication action sonuçlarını immutable root auth state değişimlerine uygular. */
import { createFeature, createReducer, on } from '@ngrx/store';

import { AuthActions } from './auth.actions';
import { initialAuthState } from './auth.state';

/** Auth actionlarının state üzerindeki tek ve saf güncelleme noktasıdır. */
export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.initialize, (state) => ({
    ...state,
    status: 'initializing' as const,
    error: null,
  })),
  on(AuthActions.initializeSuccess, (_state, { user }) => ({
    status: 'authenticated' as const,
    user,
    error: null,
  })),
  on(AuthActions.initializeUnauthenticated, () => ({
    status: 'unauthenticated' as const,
    user: null,
    error: null,
  })),
  on(AuthActions.initializeFailure, (_state, { message }) => ({
    status: 'error' as const,
    user: null,
    error: message,
  })),
  on(AuthActions.sessionChanged, (_state, { user }) => ({
    status: user ? ('authenticated' as const) : ('unauthenticated' as const),
    user,
    error: null,
  })),
  on(AuthActions.redirectFailure, (state, { message }) => ({
    ...state,
    error: message,
  })),
);

/** Root store'a `auth` adıyla kaydedilecek NgRx feature tanımıdır. */
export const authFeature = createFeature({
  name: 'auth',
  reducer: authReducer,
});
