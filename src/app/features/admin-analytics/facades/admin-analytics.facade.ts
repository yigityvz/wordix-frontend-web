/** Bu dosya, admin analytics page ve componentlerine NgRx ayrıntısı göstermeden state ve intent sunar. */
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AdminAnalyticsDateRangeQuery,
  AdminAnalyticsListQuery,
} from '../models/admin-analytics-query.models';
import { AdminAnalyticsActions } from '../store/admin-analytics.actions';
import * as AdminAnalyticsSelectors from '../store/admin-analytics.selectors';

/** Admin analytics feature için tek component-state/action köprüsüdür. */
@Injectable()
export class AdminAnalyticsFacade {
  /** Admin analytics feature selector ve action erişimini sağlar. */
  private readonly store = inject(Store);

  readonly dashboardStatus = this.store.selectSignal(AdminAnalyticsSelectors.selectDashboardStatus);
  readonly dashboard = this.store.selectSignal(AdminAnalyticsSelectors.selectDashboard);
  readonly dashboardQuery = this.store.selectSignal(AdminAnalyticsSelectors.selectDashboardQuery);
  readonly dashboardError = this.store.selectSignal(AdminAnalyticsSelectors.selectDashboardError);
  readonly topSearchesStatus = this.store.selectSignal(
    AdminAnalyticsSelectors.selectTopSearchesStatus,
  );
  readonly topSearches = this.store.selectSignal(AdminAnalyticsSelectors.selectTopSearches);
  readonly topSearchesQuery = this.store.selectSignal(
    AdminAnalyticsSelectors.selectTopSearchesQuery,
  );
  readonly topSearchesError = this.store.selectSignal(
    AdminAnalyticsSelectors.selectTopSearchesError,
  );
  readonly topSavedStatus = this.store.selectSignal(AdminAnalyticsSelectors.selectTopSavedStatus);
  readonly topSaved = this.store.selectSignal(AdminAnalyticsSelectors.selectTopSaved);
  readonly topSavedQuery = this.store.selectSignal(AdminAnalyticsSelectors.selectTopSavedQuery);
  readonly topSavedError = this.store.selectSignal(AdminAnalyticsSelectors.selectTopSavedError);
  readonly mostWrongStatus = this.store.selectSignal(AdminAnalyticsSelectors.selectMostWrongStatus);
  readonly mostWrong = this.store.selectSignal(AdminAnalyticsSelectors.selectMostWrong);
  readonly mostWrongQuery = this.store.selectSignal(AdminAnalyticsSelectors.selectMostWrongQuery);
  readonly mostWrongError = this.store.selectSignal(AdminAnalyticsSelectors.selectMostWrongError);
  readonly providerStatsStatus = this.store.selectSignal(
    AdminAnalyticsSelectors.selectProviderStatsStatus,
  );
  readonly providerStats = this.store.selectSignal(AdminAnalyticsSelectors.selectProviderStats);
  readonly providerStatsQuery = this.store.selectSignal(
    AdminAnalyticsSelectors.selectProviderStatsQuery,
  );
  readonly providerStatsError = this.store.selectSignal(
    AdminAnalyticsSelectors.selectProviderStatsError,
  );
  readonly isAnyLoading = this.store.selectSignal(
    AdminAnalyticsSelectors.selectIsAnyAdminAnalyticsLoading,
  );

  /** Admin dashboard endpoint intentini opsiyonel tarih aralığıyla gönderir. */
  loadDashboard(query: AdminAnalyticsDateRangeQuery = {}): void {
    this.store.dispatch(AdminAnalyticsActions.loadDashboard({ query }));
  }
  /** Top searches endpoint intentini canonical 20 limit ile gönderir. */
  loadTopSearches(query: AdminAnalyticsListQuery = { limit: 20 }): void {
    this.store.dispatch(AdminAnalyticsActions.loadTopSearches({ query }));
  }
  /** Top saved endpoint intentini canonical 20 limit ile gönderir. */
  loadTopSaved(query: AdminAnalyticsListQuery = { limit: 20 }): void {
    this.store.dispatch(AdminAnalyticsActions.loadTopSaved({ query }));
  }
  /** Most wrong endpoint intentini canonical 20 limit ile gönderir. */
  loadMostWrong(query: AdminAnalyticsListQuery = { limit: 20 }): void {
    this.store.dispatch(AdminAnalyticsActions.loadMostWrong({ query }));
  }
  /** Provider stats endpoint intentini opsiyonel tarih aralığıyla gönderir. */
  loadProviderStats(query: AdminAnalyticsDateRangeQuery = {}): void {
    this.store.dispatch(AdminAnalyticsActions.loadProviderStats({ query }));
  }
  /** Feature teardown için bütün admin analytics state'ini temizler. */
  clear(): void {
    this.store.dispatch(AdminAnalyticsActions.clear());
  }
}
