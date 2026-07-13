/** Bu dosya, public, authenticated user ve admin route ağaçlarını lazy featurelarla birleştirir. */
import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { adminGuard, roleGuard } from '@core/guards/role.guard';
import { AdminShell } from '@core/layout/admin-shell/admin-shell';
import { UserShell } from '@core/layout/user-shell/user-shell';
import { provideProfileFeature } from '@features/profile/profile.providers';

/** Uygulamanın guard ve shell sınırlarını koruyan canonical route tablosudur. */
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('@features/auth/pages/login-page/login-page').then((module) => module.LoginPage),
  },
  {
    path: 'auth/callback',
    providers: [provideProfileFeature()],
    loadComponent: () =>
      import('@features/auth/pages/auth-callback-page/auth-callback-page').then(
        (module) => module.AuthCallbackPage,
      ),
  },
  {
    path: 'forbidden',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@features/auth/pages/forbidden-page/forbidden-page').then(
        (module) => module.ForbiddenPage,
      ),
  },
  {
    path: 'dashboard',
    component: UserShell,
    canActivate: [authGuard, roleGuard(['basic_user'])],
    loadChildren: () =>
      import('@features/dashboard/dashboard.routes').then((module) => module.DASHBOARD_ROUTES),
  },
  {
    path: 'lookup',
    component: UserShell,
    canActivate: [authGuard, roleGuard(['basic_user'])],
    loadChildren: () =>
      import('@features/lookup/lookup.routes').then((module) => module.LOOKUP_ROUTES),
  },
  {
    path: 'dictionary',
    component: UserShell,
    canActivate: [authGuard, roleGuard(['basic_user'])],
    loadChildren: () =>
      import('@features/dictionary/dictionary.routes').then((module) => module.DICTIONARY_ROUTES),
  },
  {
    path: 'decks',
    component: UserShell,
    canActivate: [authGuard, roleGuard(['basic_user'])],
    loadChildren: () => import('@features/decks/deck.routes').then((module) => module.DECK_ROUTES),
  },
  {
    path: 'statistics',
    component: UserShell,
    canActivate: [authGuard, roleGuard(['basic_user'])],
    loadChildren: () =>
      import('@features/statistics/statistics.routes').then((module) => module.STATISTICS_ROUTES),
  },
  {
    path: 'quizzes',
    component: UserShell,
    canActivate: [authGuard, roleGuard(['basic_user'])],
    loadChildren: () =>
      import('@features/quizzes/quiz.routes').then((module) => module.QUIZ_ROUTES),
  },
  {
    path: 'settings',
    component: UserShell,
    canActivate: [authGuard, roleGuard(['basic_user'])],
    loadChildren: () =>
      import('@features/preferences/preferences.routes').then(
        (module) => module.PREFERENCES_ROUTES,
      ),
  },
  {
    path: 'admin/settings',
    component: AdminShell,
    canActivate: [authGuard, adminGuard],
    loadChildren: () =>
      import('@features/preferences/preferences.routes').then(
        (module) => module.PREFERENCES_ROUTES,
      ),
  },
  {
    path: 'admin',
    component: AdminShell,
    canActivate: [authGuard, adminGuard],
    loadChildren: () =>
      import('@features/admin-analytics/admin-analytics.routes').then(
        (module) => module.ADMIN_ANALYTICS_ROUTES,
      ),
  },
];
