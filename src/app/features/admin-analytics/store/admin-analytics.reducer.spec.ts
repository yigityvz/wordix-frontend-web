/** Bu dosya, admin analytics reducer'ın bağımsız read lifecycle geçişlerini doğrular. */
import { describe, expect, it } from 'vitest';
import { AdminDashboardAnalytics } from '../models/admin-analytics.models';
import { AdminAnalyticsActions } from './admin-analytics.actions';
import { adminAnalyticsReducer } from './admin-analytics.reducer';
import { initialAdminAnalyticsState } from './admin-analytics.state';

/** Reducer state izolasyonu ve teardown davranışını sınar. */
describe('adminAnalyticsReducer', () => {
  /** Top searches yüklenirken dashboard verisini korur. */
  it('keeps independent state while loading top searches', () => {
    const dashboard = { generatedAt: '2026-01-01' } as AdminDashboardAnalytics;
    const result = adminAnalyticsReducer(
      { ...initialAdminAnalyticsState, dashboardStatus: 'loaded', dashboard },
      AdminAnalyticsActions.loadTopSearches({ query: { limit: 50 } }),
    );
    expect(result.topSearchesStatus).toBe('loading');
    expect(result.topSearchesQuery.limit).toBe(50);
    expect(result.dashboard?.generatedAt).toBe('2026-01-01');
  });

  /** Clear actionı feature state'ini canonical başlangıca döndürür. */
  it('clears all admin analytics state', () => {
    const dirtyState = {
      ...initialAdminAnalyticsState,
      providerStatsStatus: 'error' as const,
      providerStatsError: 'x',
    };
    expect(adminAnalyticsReducer(dirtyState, AdminAnalyticsActions.clear())).toEqual(
      initialAdminAnalyticsState,
    );
  });
});
