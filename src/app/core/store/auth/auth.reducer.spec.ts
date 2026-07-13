/** Bu dosya, auth lifecycle actionlarının root auth state'i doğru güncellediğini doğrular. */
import { describe, expect, it } from 'vitest';

import { AuthActions } from './auth.actions';
import { authReducer } from './auth.reducer';
import { initialAuthState } from './auth.state';

// Reducer'ın initialization, authenticated ve session temizleme durumlarını sınar.
describe('authReducer', () => {
  // Uygulama başlangıcında state'in loading durumuna geçtiğini doğrular.
  it('marks authentication as initializing', () => {
    expect(authReducer(initialAuthState, AuthActions.initialize())).toMatchObject({
      status: 'initializing',
      user: null,
      error: null,
    });
  });

  // Başarılı Keycloak sonucunun güvenli kullanıcı görünümünü state'e yazdığını doğrular.
  it('stores the authenticated user', () => {
    const user = { username: 'wordix-user', email: 'user@wordix.test', roles: ['admin'] as const };

    expect(authReducer(initialAuthState, AuthActions.initializeSuccess({ user }))).toEqual({
      status: 'authenticated',
      user,
      error: null,
    });
  });

  // Keycloak logout callbackinin kullanıcı ve hata state'ini temizlediğini doğrular.
  it('clears authentication when the session ends', () => {
    const authenticatedState = {
      status: 'authenticated' as const,
      user: { username: 'wordix-user', email: null, roles: ['basic_user'] as const },
      error: 'old error',
    };

    expect(authReducer(authenticatedState, AuthActions.sessionChanged({ user: null }))).toEqual({
      status: 'unauthenticated',
      user: null,
      error: null,
    });
  });
});
