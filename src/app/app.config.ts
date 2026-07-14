/**
 * Uygulama genelindeki standalone Angular providerlarını tek bootstrap noktasında toplar.
 * Router, NgRx, HTTP altyapısı, tema ve authentication başlangıç akışlarını merkezi kurar.
 */
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AuthFacade } from '@core/auth/auth.facade';
import { apiErrorInterceptor } from '@core/interceptors/api-error.interceptor';
import { authTokenInterceptor } from '@core/interceptors/auth-token.interceptor';
import { provideRootStore } from '@core/store/root-store.providers';
import { ThemeService } from '@core/theme/theme.service';
import { environment } from '@env/environment';
import { provideApiClient } from 'angular-api-client-core';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // Genel API client library'yi aktif environment içindeki gerçek Wordix API adresine bağlar.
    provideApiClient({ baseUrl: environment.apiBaseUrl }),
    // Tüm feature HTTP çağrılarında ortak hata normalizasyonunu etkinleştirir.
    provideHttpClient(withInterceptors([apiErrorInterceptor, authTokenInterceptor])),
    provideRootStore(),
    provideAppInitializer(() => inject(ThemeService).initialize()),
    // Uygulama açılışında mevcut Keycloak SSO oturum kontrolünü NgRx üzerinden başlatır.
    provideAppInitializer(() => inject(AuthFacade).initialize()),
  ],
};
