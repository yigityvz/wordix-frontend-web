/** Bu dosya, admin analytics feature state'ini page ve componentler için selectorlara dönüştürür. */
import { createSelector } from '@ngrx/store';
import { adminAnalyticsFeature } from './admin-analytics.reducer';

export const {
  selectDashboardStatus,
  selectDashboard,
  selectDashboardQuery,
  selectDashboardError,
  selectTopSearchesStatus,
  selectTopSearches,
  selectTopSearchesQuery,
  selectTopSearchesError,
  selectTopSavedStatus,
  selectTopSaved,
  selectTopSavedQuery,
  selectTopSavedError,
  selectMostWrongStatus,
  selectMostWrong,
  selectMostWrongQuery,
  selectMostWrongError,
  selectProviderStatsStatus,
  selectProviderStats,
  selectProviderStatsQuery,
  selectProviderStatsError,
} = adminAnalyticsFeature;

/** Herhangi bir admin analytics read isteğinin sürüp sürmediğini seçer. */
export const selectIsAnyAdminAnalyticsLoading = createSelector(
  selectDashboardStatus,
  selectTopSearchesStatus,
  selectTopSavedStatus,
  selectMostWrongStatus,
  selectProviderStatsStatus,
  (...statuses) => statuses.includes('loading'),
);
