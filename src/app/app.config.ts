/**
 * Application-wide standalone Angular providers.
 * Centralizes router, NgRx, error handling, and startup services used once at bootstrap.
 */
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideRootStore } from '@core/store/root-store.providers';
import { ThemeService } from '@core/theme/theme.service';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideRootStore(),
    provideAppInitializer(() => inject(ThemeService).initialize()),
  ],
};
