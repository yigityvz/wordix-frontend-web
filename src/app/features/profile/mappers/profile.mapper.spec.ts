/** Bu dosya, profile mapper'ın hassas kimliği ve altyapı rollerini UI modelinden çıkardığını doğrular. */
import { describe, expect, it } from 'vitest';

import { mapProfile } from './profile.mapper';

// Swagger DTO'sundan güvenli profile görünümünün üretildiğini sınar.
describe('mapProfile', () => {
  // Keycloak ID'nin atıldığını ve yalnızca Wordix rollerinin korunduğunu doğrular.
  it('maps only safe profile fields and Wordix roles', () => {
    const profile = mapProfile({
      isAuthenticated: true,
      keycloakUserId: 'must-not-reach-ui',
      email: 'admin@wordix.test',
      username: 'wordix-admin',
      roles: ['offline_access', 'basic_user', 'admin', 'uma_authorization'],
    });

    expect(profile).toEqual({
      isAuthenticated: true,
      email: 'admin@wordix.test',
      username: 'wordix-admin',
      roles: ['basic_user', 'admin'],
    });
    expect(profile).not.toHaveProperty('keycloakUserId');
  });
});
