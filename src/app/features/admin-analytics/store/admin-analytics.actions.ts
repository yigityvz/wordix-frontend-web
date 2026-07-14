/** Bu dosya, admin analytics read lifecycle actionlarını endpoint bazında tanımlar. */
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  AdminAnalyticsDateRangeQuery,
  AdminAnalyticsListQuery,
} from '../models/admin-analytics-query.models';
import {
  AdminDashboardAnalytics,
  MostWrongAnalytics,
  ProviderStatsAnalytics,
  TopSavedAnalytics,
  TopSearchesAnalytics,
} from '../models/admin-analytics.models';
export const AdminAnalyticsActions = createActionGroup({
  source: 'Admin Analytics',
  events: {
    'Load Dashboard': props<{ readonly query: AdminAnalyticsDateRangeQuery }>(),
    'Load Dashboard Success': props<{ readonly dashboard: AdminDashboardAnalytics }>(),
    'Load Dashboard Failure': props<{ readonly message: string }>(),
    'Load Top Searches': props<{ readonly query: AdminAnalyticsListQuery }>(),
    'Load Top Searches Success': props<{ readonly analytics: TopSearchesAnalytics }>(),
    'Load Top Searches Failure': props<{ readonly message: string }>(),
    'Load Top Saved': props<{ readonly query: AdminAnalyticsListQuery }>(),
    'Load Top Saved Success': props<{ readonly analytics: TopSavedAnalytics }>(),
    'Load Top Saved Failure': props<{ readonly message: string }>(),
    'Load Most Wrong': props<{ readonly query: AdminAnalyticsListQuery }>(),
    'Load Most Wrong Success': props<{ readonly analytics: MostWrongAnalytics }>(),
    'Load Most Wrong Failure': props<{ readonly message: string }>(),
    'Load Provider Stats': props<{ readonly query: AdminAnalyticsDateRangeQuery }>(),
    'Load Provider Stats Success': props<{ readonly analytics: ProviderStatsAnalytics }>(),
    'Load Provider Stats Failure': props<{ readonly message: string }>(),
    Clear: emptyProps(),
  },
});
