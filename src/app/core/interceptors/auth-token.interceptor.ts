/** Bu dosya, yalnızca Wordix API requestlerine güncel Keycloak bearer tokenı ekler. */
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, switchMap, throwError } from 'rxjs';

import { KeycloakService } from '../auth/keycloak.service';
import { AppConfigService } from '../config/app-config.service';
import { ApiError } from '../errors/api-error.model';

/** Protected Wordix API çağrılarına yenilenmiş access token ekleyen functional interceptordır. */
export const authTokenInterceptor: HttpInterceptorFn = (request, next) => {
  // Tokenın Keycloak veya üçüncü taraf adreslerine sızmasını önlemek için API sınırını doğrular.
  const apiBaseUrl = inject(AppConfigService).apiBaseUrl;
  if (!isWordixApiRequest(request.url, apiBaseUrl)) {
    return next(request);
  }

  // Keycloak service tokenın requestten önce geçerli süreye sahip olmasını sağlar.
  const keycloakService = inject(KeycloakService);
  return from(keycloakService.getAccessToken()).pipe(
    // Refresh hatasını HTTP request gönderilmeden merkezi authentication hatasına dönüştürür.
    catchError((error: unknown) => throwError(() => createTokenRefreshError(error))),
    switchMap((token) => {
      // Oturum yoksa requesti değiştirmez; protected endpointin gerçek 401 cevabını korur.
      if (!token) {
        return next(request);
      }

      // Mevcut Authorization değerini güvenilir Keycloak access tokenıyla değiştirir.
      const authenticatedRequest = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });

      return next(authenticatedRequest);
    }),
  );
};

/** Request URL'sinin origin ve path olarak yapılandırılmış Wordix API sınırında olduğunu doğrular. */
function isWordixApiRequest(requestUrl: string, apiBaseUrl: string): boolean {
  try {
    // URL parser relative pathleri güvenli biçimde API originine göre çözer ve traversal parçalarını normalize eder.
    const apiUrl = new URL(apiBaseUrl);
    const resolvedRequestUrl = new URL(requestUrl, apiUrl);
    const apiPath = apiUrl.pathname.replace(/\/+$/, '');

    return (
      resolvedRequestUrl.origin === apiUrl.origin &&
      (resolvedRequestUrl.pathname === apiPath ||
        resolvedRequestUrl.pathname.startsWith(`${apiPath}/`))
    );
  } catch {
    // Geçersiz URL hiçbir koşulda protected API requesti kabul edilmez.
    return false;
  }
}

/** Keycloak refresh başarısızlığını auth state ve UI'ın anlayacağı güvenli ApiError modeline çevirir. */
function createTokenRefreshError(cause: unknown): ApiError {
  return new ApiError({
    kind: 'authentication',
    statusCode: 401,
    message: 'Oturum tokenı yenilenemedi.',
    errorCode: 'TOKEN_REFRESH_FAILED',
    detail: null,
    traceId: null,
    validationErrors: [],
    timestamp: null,
    cause,
  });
}
