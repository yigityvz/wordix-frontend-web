/** Bu dosya, admin analytics actionlarını beş bağımsız endpoint state alanına uygular. */
import { createFeature, createReducer, on } from '@ngrx/store';
import { AdminAnalyticsActions } from './admin-analytics.actions';
import { initialAdminAnalyticsState } from './admin-analytics.state';

/** Her endpoint lifecycle'ını diğer endpoint verisini silmeden yöneten saf reduc erdır. */
export const adminAnalyticsReducer = createReducer(
  initialAdminAnalyticsState,
  on(AdminAnalyticsActions.loadDashboard, (state, { query }) => ({
    ...state,
    dashboardStatus: 'loading' as const,
    dashboardQuery: query,
    dashboardError: null,
  })),
  on(AdminAnalyticsActions.loadDashboardSuccess, (state, { dashboard }) => ({
    ...state,
    dashboardStatus: 'loaded' as const,
    dashboard,
    dashboardError: null,
  })),
  on(AdminAnalyticsActions.loadDashboardFailure, (state, { message }) => ({
    ...state,
    dashboardStatus: 'error' as const,
    dashboardError: message,
  })),
  on(AdminAnalyticsActions.loadTopSearches, (state, { query }) => ({
    ...state,
    topSearchesStatus: 'loading' as const,
    topSearchesQuery: query,
    topSearchesError: null,
  })),
  on(AdminAnalyticsActions.loadTopSearchesSuccess, (state, { analytics }) => ({
    ...state,
    topSearchesStatus: 'loaded' as const,
    topSearches: analytics,
    topSearchesError: null,
  })),
  on(AdminAnalyticsActions.loadTopSearchesFailure, (state, { message }) => ({
    ...state,
    topSearchesStatus: 'error' as const,
    topSearchesError: message,
  })),
  on(AdminAnalyticsActions.loadTopSaved, (state, { query }) => ({
    ...state,
    topSavedStatus: 'loading' as const,
    topSavedQuery: query,
    topSavedError: null,
  })),
  on(AdminAnalyticsActions.loadTopSavedSuccess, (state, { analytics }) => ({
    ...state,
    topSavedStatus: 'loaded' as const,
    topSaved: analytics,
    topSavedError: null,
  })),
  on(AdminAnalyticsActions.loadTopSavedFailure, (state, { message }) => ({
    ...state,
    topSavedStatus: 'error' as const,
    topSavedError: message,
  })),
  on(AdminAnalyticsActions.loadMostWrong, (state, { query }) => ({
    ...state,
    mostWrongStatus: 'loading' as const,
    mostWrongQuery: query,
    mostWrongError: null,
  })),
  on(AdminAnalyticsActions.loadMostWrongSuccess, (state, { analytics }) => ({
    ...state,
    mostWrongStatus: 'loaded' as const,
    mostWrong: analytics,
    mostWrongError: null,
  })),
  on(AdminAnalyticsActions.loadMostWrongFailure, (state, { message }) => ({
    ...state,
    mostWrongStatus: 'error' as const,
    mostWrongError: message,
  })),
  on(AdminAnalyticsActions.loadProviderStats, (state, { query }) => ({
    ...state,
    providerStatsStatus: 'loading' as const,
    providerStatsQuery: query,
    providerStatsError: null,
  })),
  on(AdminAnalyticsActions.loadProviderStatsSuccess, (state, { analytics }) => ({
    ...state,
    providerStatsStatus: 'loaded' as const,
    providerStats: analytics,
    providerStatsError: null,
  })),
  on(AdminAnalyticsActions.loadProviderStatsFailure, (state, { message }) => ({
    ...state,
    providerStatsStatus: 'error' as const,
    providerStatsError: message,
  })),
  on(AdminAnalyticsActions.clear, () => initialAdminAnalyticsState),
);

/** Lazy provider tarafından adminAnalytics adıyla kaydedilen feature tanımıdır. */
export const adminAnalyticsFeature = createFeature({
  name: 'adminAnalytics',
  reducer: adminAnalyticsReducer,
});
