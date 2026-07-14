/** Bu dosya, statistics effects'in API sonuçlarını mapper ve failure actionlarına çevirdiğini doğrular. */
import { TestBed } from '@angular/core/testing';
import { ApiError } from '@core/errors/api-error.model';
import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { firstValueFrom, of, Subject, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StatisticsApiService } from '../api/statistics-api.service';
import { StatisticsActions } from './statistics.actions';
import { StatisticsEffects } from './statistics.effects';

describe('StatisticsEffects', () => {
  let actions: Subject<Action>;
  const getLearningSummary = vi.fn();
  const getQuizStatistics = vi.fn();
  const getDifficultItems = vi.fn();
  const getDeckStatistics = vi.fn();
  const getConfidenceDistribution = vi.fn();
  /** Her testte isolated action stream ve API mock containerını kurar. */
  beforeEach(() => {
    actions = new Subject<Action>();
    [
      getLearningSummary,
      getQuizStatistics,
      getDifficultItems,
      getDeckStatistics,
      getConfidenceDistribution,
    ].forEach((mock) => mock.mockReset());
    TestBed.configureTestingModule({
      providers: [
        StatisticsEffects,
        { provide: Actions, useFactory: () => new Actions(actions) },
        {
          provide: StatisticsApiService,
          useValue: {
            getLearningSummary,
            getQuizStatistics,
            getDifficultItems,
            getDeckStatistics,
            getConfidenceDistribution,
          },
        },
      ],
    });
  });
  /** Nullable difficult item listesini success actionında boş diziye normalize eder. */
  it('maps difficult items page', async () => {
    const dto = {
      items: null,
      pageNumber: 1,
      pageSize: 20,
      totalCount: 0,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    };
    getDifficultItems.mockReturnValue(of(dto));
    const output = firstValueFrom(TestBed.inject(StatisticsEffects).loadDifficultItems$);
    const query = { pageNumber: 1, pageSize: 20, source: 'both' as const };
    actions.next(StatisticsActions.loadDifficultItems({ query }));
    await expect(output).resolves.toEqual(
      StatisticsActions.loadDifficultItemsSuccess({ page: { ...dto, items: [] } }),
    );
    expect(getDifficultItems).toHaveBeenCalledWith(query);
  });
  /** Normalize ApiError mesajını confidence failure actionında korur. */
  it('preserves normalized confidence error', async () => {
    const error = new ApiError({
      kind: 'server',
      statusCode: 500,
      message: 'Statistics unavailable.',
      errorCode: null,
      detail: null,
      traceId: null,
      validationErrors: [],
      timestamp: null,
    });
    getConfidenceDistribution.mockReturnValue(throwError(() => error));
    const output = firstValueFrom(TestBed.inject(StatisticsEffects).loadConfidenceDistribution$);
    actions.next(StatisticsActions.loadConfidenceDistribution());
    await expect(output).resolves.toEqual(
      StatisticsActions.loadConfidenceDistributionFailure({ message: 'Statistics unavailable.' }),
    );
  });
});
