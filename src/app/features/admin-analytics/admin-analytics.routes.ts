/** Bu dosya, admin analytics sayfalarını tek protected admin shell route ağacında tanımlar. */
import { Routes } from '@angular/router';
import { provideProfileFeature } from '../profile/profile.providers';
import { provideAdminAnalyticsFeature } from './admin-analytics.providers';

/** Beş gerçek admin analytics ekranını ortak lazy provider scope altında açar. */
export const ADMIN_ANALYTICS_ROUTES: Routes = [
  {
    path: '',
    providers: [provideProfileFeature(), provideAdminAnalyticsFeature()],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/admin-dashboard-page/admin-dashboard-page').then(
            (module) => module.AdminDashboardPage,
          ),
      },
      {
        path: 'analytics/top-lookups',
        loadComponent: () =>
          import('./pages/top-searches-page/top-searches-page').then(
            (module) => module.TopSearchesPage,
          ),
      },
      {
        path: 'analytics/most-saved',
        loadComponent: () =>
          import('./pages/top-saved-page/top-saved-page').then(
            (module) => module.TopSavedPage,
          ),
      },
      {
        path: 'analytics/quiz-insights',
        loadComponent: () =>
          import('./pages/most-wrong-page/most-wrong-page').then(
            (module) => module.MostWrongPage,
          ),
      },
      {
        path: 'analytics/provider',
        loadComponent: () =>
          import('./pages/provider-stats-page/provider-stats-page').then(
            (module) => module.ProviderStatsPage,
          ),
      },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },
];
