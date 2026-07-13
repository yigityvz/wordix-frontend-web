/** Bu dosya, dashboard sayfasını profile ve statistics feature providerlarıyla lazy route olarak tanımlar. */
import { Routes } from '@angular/router';
import { provideProfileFeature } from '../profile/profile.providers';
import { provideStatisticsFeature } from '../statistics/statistics.providers';

/** User shell child outletinde açılan dashboard feature route kaydıdır. */
export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    providers: [provideProfileFeature(), provideStatisticsFeature()],
    loadComponent: () =>
      import('./pages/dashboard-page/dashboard-page').then((module) => module.DashboardPage),
  },
];
