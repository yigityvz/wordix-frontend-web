/** Bu dosya, bearer tokenın yalnızca Wordix API sınırına güvenli biçimde eklendiğini doğrular. */
import { HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { KeycloakService } from '../auth/keycloak.service';
import { AppConfigService } from '../config/app-config.service';
import { authTokenInterceptor } from './auth-token.interceptor';

// API, dış origin, boş oturum ve refresh hatası senaryolarında interceptor güvenlik sınırını sınar.
describe('authTokenInterceptor', () => {
  /** Her testte bağımsız Keycloak token mockunu yeniden oluşturur. */
  let getAccessToken: ReturnType<typeof vi.fn>;

  /** Functional interceptor için gerekli config ve auth servislerini DI container'a sağlar. */
  beforeEach(() => {
    getAccessToken = vi.fn().mockResolvedValue('access-token');

    TestBed.configureTestingModule({
      providers: [
        {
          provide: AppConfigService,
          useValue: { apiBaseUrl: 'http://localhost:5000/api' },
        },
        {
          provide: KeycloakService,
          useValue: { getAccessToken },
        },
      ],
    });
  });

  // Wordix API requestinin güncel Keycloak bearer tokenıyla gönderildiğini doğrular.
  it('adds the bearer token to Wordix API requests', async () => {
    const request = new HttpRequest('GET', 'http://localhost:5000/api/profile/me');
    const handledRequests: HttpRequest<unknown>[] = [];
    const next: HttpHandlerFn = (outgoingRequest) => {
      handledRequests.push(outgoingRequest);
      return of(new HttpResponse({ status: 200 }));
    };

    const result = TestBed.runInInjectionContext(() => authTokenInterceptor(request, next));
    await firstValueFrom(result);

    expect(handledRequests[0]?.headers.get('Authorization')).toBe('Bearer access-token');
    expect(getAccessToken).toHaveBeenCalledOnce();
  });

  // Keycloak veya üçüncü taraf originlerine access token eklenmediğini doğrular.
  it('does not request or attach a token for external origins', async () => {
    const request = new HttpRequest('GET', 'http://localhost:8080/realms/wordix');
    const handledRequests: HttpRequest<unknown>[] = [];
    const next: HttpHandlerFn = (outgoingRequest) => {
      handledRequests.push(outgoingRequest);
      return of(new HttpResponse({ status: 200 }));
    };

    const result = TestBed.runInInjectionContext(() => authTokenInterceptor(request, next));
    await firstValueFrom(result);

    expect(handledRequests[0]?.headers.has('Authorization')).toBe(false);
    expect(getAccessToken).not.toHaveBeenCalled();
  });

  // Oturum yokken requestin sahte veya boş Authorization headerıyla değiştirilmediğini doğrular.
  it('leaves the API request unchanged when no session token exists', async () => {
    getAccessToken.mockResolvedValue(null);
    const request = new HttpRequest('GET', 'http://localhost:5000/api/profile/me');
    const handledRequests: HttpRequest<unknown>[] = [];
    const next: HttpHandlerFn = (outgoingRequest) => {
      handledRequests.push(outgoingRequest);
      return of(new HttpResponse({ status: 200 }));
    };

    const result = TestBed.runInInjectionContext(() => authTokenInterceptor(request, next));
    await firstValueFrom(result);

    expect(handledRequests[0]).toBe(request);
  });

  // Token refresh hatasının request gönderilmeden authentication ApiError olarak yayınlandığını doğrular.
  it('stops the request when token refresh fails', async () => {
    getAccessToken.mockRejectedValue(new Error('refresh failed'));
    const request = new HttpRequest('GET', 'http://localhost:5000/api/profile/me');
    const next = vi.fn<HttpHandlerFn>();
    const result = TestBed.runInInjectionContext(() => authTokenInterceptor(request, next));

    await expect(firstValueFrom(result)).rejects.toMatchObject({
      name: 'ApiError',
      kind: 'authentication',
      statusCode: 401,
      errorCode: 'TOKEN_REFRESH_FAILED',
    });
    expect(next).not.toHaveBeenCalled();
  });
});
