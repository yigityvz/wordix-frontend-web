/** Bu dosya, profile API lifecycle actionlarının feature state'i doğru güncellediğini doğrular. */
import { describe, expect, it } from 'vitest';

import { ProfileActions } from './profile.actions';
import { profileReducer } from './profile.reducer';
import { initialProfileState } from './profile.state';

// Profile loading, success ve clear state geçişlerini sınar.
describe('profileReducer', () => {
  // Load actionının mevcut profile verisini koruyarak loading durumuna geçtiğini doğrular.
  it('marks the profile request as loading', () => {
    expect(profileReducer(initialProfileState, ProfileActions.load())).toEqual({
      status: 'loading',
      profile: null,
      error: null,
    });
  });

  // Başarılı API sonucunun güvenli profile modelini state'e yazdığını doğrular.
  it('stores a loaded profile', () => {
    const profile = {
      isAuthenticated: true,
      email: 'user@wordix.test',
      username: 'wordix-user',
      roles: ['basic_user'] as const,
    };

    expect(profileReducer(initialProfileState, ProfileActions.loadSuccess({ profile }))).toEqual({
      status: 'loaded',
      profile,
      error: null,
    });
  });

  // Clear actionının logout sonrası tüm profile state'ini temizlediğini doğrular.
  it('clears profile state', () => {
    const loadedState = {
      status: 'loaded' as const,
      profile: {
        isAuthenticated: true,
        email: null,
        username: 'wordix-user',
        roles: ['basic_user'] as const,
      },
      error: null,
    };

    expect(profileReducer(loadedState, ProfileActions.clear())).toEqual(initialProfileState);
  });
});
