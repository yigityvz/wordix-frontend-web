/** Defines the authenticated user settings feature route. */
import { Routes } from '@angular/router';

/** Lazy route table for browser-local production preferences. */
export const PREFERENCES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/settings-page/settings-page').then((module) => module.SettingsPage),
  },
];
