/** Bu dosya, statistics ekranını feature providerlarıyla lazy route olarak tanımlar. */
import { Routes } from '@angular/router';
import { provideStatisticsFeature } from './statistics.providers';
/** Statistics route ağacını gerçek NgRx/API providerlarıyla açar. */
export const STATISTICS_ROUTES:Routes=[{path:'',providers:[provideStatisticsFeature()],loadComponent:()=>import('./pages/statistics-page/statistics-page').then(module=>module.StatisticsPage)}];
