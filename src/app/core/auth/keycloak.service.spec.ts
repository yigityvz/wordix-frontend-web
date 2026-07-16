/** Bu dosya, Keycloak service'in PKCE ayarlarını ve güvenli auth kullanıcı dönüşümünü doğrular. */
import { TestBed } from '@angular/core/testing';
import Keycloak from 'keycloak-js';
import { firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { KEYCLOAK_CLIENT, KeycloakService } from './keycloak.service';

// Resmi adapter yerine kontrollü test clientı kullanarak service davranışlarını sınar.
describe('KeycloakService', () => {
  /** Her testte Keycloak adapter metodlarını ve callback alanlarını yeniden oluşturur. */
  let client: Keycloak;

  /** Her testte bağımsız DI container ve adapter mocku hazırlar. */
  beforeEach(() => {
    client = {
      authenticated: true,
      token: 'access-token',
      tokenParsed: {
        sub: 'hidden-keycloak-id',
        preferred_username: 'wordix-user',
        email: 'user@wordix.test',
        realm_access: { roles: ['offline_access', 'basic_user', 'admin'] },
      },
      realmAccess: { roles: ['offline_access', 'basic_user', 'admin'] },
      init: vi.fn().mockResolvedValue(true),
      login: vi.fn().mockResolvedValue(undefined),
      register: vi.fn().mockResolvedValue(undefined),
      logout: vi.fn().mockResolvedValue(undefined),
      updateToken: vi.fn().mockResolvedValue(false),
      clearToken: vi.fn(),
    } as unknown as Keycloak;

    TestBed.configureTestingModule({
      providers: [KeycloakService, { provide: KEYCLOAK_CLIENT, useValue: client }],
    });
  });

  // Adapter'ın implicit flow olmadan standard Authorization Code + S256 PKCE ile başladığını doğrular.
  it('initializes Keycloak with standard flow and S256 PKCE', async () => {
    const service = TestBed.inject(KeycloakService);

    await expect(service.initialize()).resolves.toEqual({
      username: 'wordix-user',
      email: 'user@wordix.test',
      roles: ['basic_user', 'admin'],
    });
    expect(client.init).toHaveBeenCalledWith({
      onLoad: 'check-sso',
      flow: 'standard',
      pkceMethod: 'S256',
    });
  });

  // F4B interceptor'ın request öncesinde token yenileme kontrolü yaptığını doğrular.
  it('returns a refreshed access token for authenticated requests', async () => {
    const service = TestBed.inject(KeycloakService);

    await expect(service.getAccessToken()).resolves.toBe('access-token');
    expect(client.updateToken).toHaveBeenCalledWith(30);
  });

  /** Login ve registration işlemlerinin kök yerine gerçek Angular callback route'una döndüğünü doğrular. */
  it('uses the Angular callback route for login and registration', async () => {
    const service = TestBed.inject(KeycloakService);

    await service.login('/dictionary');
    await service.register('/decks');

    expect(client.login).toHaveBeenCalledWith({
      redirectUri: expect.stringMatching(/\/auth\/callback$/),
    });
    expect(client.register).toHaveBeenCalledWith({
      redirectUri: expect.stringMatching(/\/auth\/callback$/),
    });
  });

  /** Logout sonrasında Keycloak'ın izinli Angular callback adresini kullandığını doğrular. */
  it('uses the Angular callback route after logout', async () => {
    const service = TestBed.inject(KeycloakService);

    await service.logout();

    expect(client.logout).toHaveBeenCalledWith({
      redirectUri: expect.stringMatching(/\/auth\/callback$/),
    });
  });

  // Keycloak logout callbackinin store effectine unauthenticated session olayı gönderdiğini doğrular.
  it('publishes a cleared session when Keycloak reports logout', async () => {
    const service = TestBed.inject(KeycloakService);
    await service.initialize();
    const sessionChange = firstValueFrom(service.sessionChanges$);

    client.onAuthLogout?.();

    await expect(sessionChange).resolves.toBeNull();
  });
});
