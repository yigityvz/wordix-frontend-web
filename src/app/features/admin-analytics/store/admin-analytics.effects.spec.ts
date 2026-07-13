/** Bu dosya, admin analytics effects'in API sonuçlarını mapper ve failure actionlarına çevirdiğini doğrular. */
import { TestBed } from '@angular/core/testing';
import { ApiError } from '@core/errors/api-error.model';
import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { firstValueFrom, of, Subject, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminAnalyticsApiService } from '../api/admin-analytics-api.service';
import { AdminAnalyticsActions } from './admin-analytics.actions';
import { AdminAnalyticsEffects } from './admin-analytics.effects';

/** Effect success mapping ve normalize error davranışını isolated action stream ile sınar. */
describe('AdminAnalyticsEffects', () => {
  let actions: Subject<Action>;
  const getDashboard = vi.fn();
  const getTopSearches = vi.fn();
  const getTopSaved = vi.fn();
  const getMostWrong = vi.fn();
  const getProviderStats = vi.fn();

  /** Her testte isolated action stream ve API mock containerını kurar. */
  beforeEach(() => {
    actions = new Subject<Action>();
    [getDashboard, getTopSearches, getTopSaved, getMostWrong, getProviderStats].forEach((mock) => mock.mockReset());
    TestBed.configureTestingModule({
      providers: [
        AdminAnalyticsEffects,
        { provide: Actions, useFactory: () => new Actions(actions) },
        { provide: AdminAnalyticsApiService, useValue: { getDashboard, getTopSearches, getTopSaved, getMostWrong, getProviderStats } },
      ],
    });
  });

  /** Nullable provider listesini success actionında boş diziye normalize eder. */
  it('maps provider stats', async () => {
    const dto = {
      from: null,
      to: null,
      generatedAt: '2026-01-01',
      totalProviderRequestCount: 0,
      totalExternalCacheEntryCount: 0,
      totalExternalCacheHitCount: 0,
      totalImportJobCount: 0,
      items: null,
    };
    getProviderStats.mockReturnValue(of(dto));
    const output = firstValueFrom(TestBed.inject(AdminAnalyticsEffects).loadProviderStats$);
    const query = { fromUtc: '2026-01-01T00:00:00Z' };
    actions.next(AdminAnalyticsActions.loadProviderStats({ query }));
    await expect(output).resolves.toEqual(AdminAnalyticsActions.loadProviderStatsSuccess({ analytics: { ...dto, items: [] } }));
    expect(getProviderStats).toHaveBeenCalledWith(query);
  });

  /** Normalize ApiError mesajını dashboard failure actionında korur. */
  it('preserves normalized dashboard error', async () => {
    const error = new ApiError({
      kind: 'server',
      statusCode: 500,
      message: 'Admin analytics unavailable.',
      errorCode: null,
      detail: null,
      traceId: null,
      validationErrors: [],
      timestamp: null,
    });
    getDashboard.mockReturnValue(throwError(() => error));
    const output = firstValueFrom(TestBed.inject(AdminAnalyticsEffects).loadDashboard$);
    actions.next(AdminAnalyticsActions.loadDashboard({ query: {} }));
    await expect(output).resolves.toEqual(AdminAnalyticsActions.loadDashboardFailure({ message: 'Admin analytics unavailable.' }));
  });
});
