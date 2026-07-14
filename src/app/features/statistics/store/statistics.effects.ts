/** Bu dosya, statistics actions akışını beş gerçek API çağrısı ve DTO mapperlarla birleştirir. */
import { inject, Injectable } from '@angular/core';
import { ApiError } from '@core/errors/api-error.model';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { StatisticsApiService } from '../api/statistics-api.service';
import {
  mapConfidenceDistribution,
  mapDeckStatistics,
  mapDifficultItems,
  mapLearningSummary,
  mapQuizStatistics,
} from '../mappers/statistics.mapper';
import { StatisticsActions } from './statistics.actions';

/** Statistics HTTP yan etkilerini component, reducer ve facade katmanlarından izole eder. */
@Injectable()
export class StatisticsEffects {
  /** NgRx action akışını effectlere sağlar. */
  private readonly actions$ = inject(Actions);
  /** Canlı user-statistics endpointlerini çağırır. */
  private readonly api = inject(StatisticsApiService);

  /** Son learning-summary isteğinin gerçek sonucunu state'e taşır. */
  readonly loadLearningSummary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StatisticsActions.loadLearningSummary),
      switchMap(() =>
        this.api.getLearningSummary().pipe(
          map((dto) =>
            StatisticsActions.loadLearningSummarySuccess({ summary: mapLearningSummary(dto) }),
          ),
          catchError((error: unknown) =>
            of(
              StatisticsActions.loadLearningSummaryFailure({
                message: getStatisticsError(error, 'Learning summary yüklenemedi.'),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  /** Filtre değişiminde önceki quiz statistics isteğini iptal edip son sorguyu taşır. */
  readonly loadQuizStatistics$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StatisticsActions.loadQuizStatistics),
      switchMap(({ query }) =>
        this.api.getQuizStatistics(query).pipe(
          map((dto) =>
            StatisticsActions.loadQuizStatisticsSuccess({ statistics: mapQuizStatistics(dto) }),
          ),
          catchError((error: unknown) =>
            of(
              StatisticsActions.loadQuizStatisticsFailure({
                message: getStatisticsError(error, 'Quiz istatistikleri yüklenemedi.'),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  /** Pagination/filtre değişiminde yalnızca son difficult-items sorgusunu state'e taşır. */
  readonly loadDifficultItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StatisticsActions.loadDifficultItems),
      switchMap(({ query }) =>
        this.api.getDifficultItems(query).pipe(
          map((dto) =>
            StatisticsActions.loadDifficultItemsSuccess({ page: mapDifficultItems(dto) }),
          ),
          catchError((error: unknown) =>
            of(
              StatisticsActions.loadDifficultItemsFailure({
                message: getStatisticsError(error, 'Zor öğeler yüklenemedi.'),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  /** Deck statistics collectionını gerçek endpointten yükler. */
  readonly loadDeckStatistics$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StatisticsActions.loadDeckStatistics),
      switchMap(() =>
        this.api.getDeckStatistics().pipe(
          map((dto) =>
            StatisticsActions.loadDeckStatisticsSuccess({ statistics: mapDeckStatistics(dto) }),
          ),
          catchError((error: unknown) =>
            of(
              StatisticsActions.loadDeckStatisticsFailure({
                message: getStatisticsError(error, 'Deste istatistikleri yüklenemedi.'),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  /** Confidence bucket dağılımını gerçek endpointten yükler. */
  readonly loadConfidenceDistribution$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StatisticsActions.loadConfidenceDistribution),
      switchMap(() =>
        this.api.getConfidenceDistribution().pipe(
          map((dto) =>
            StatisticsActions.loadConfidenceDistributionSuccess({
              distribution: mapConfidenceDistribution(dto),
            }),
          ),
          catchError((error: unknown) =>
            of(
              StatisticsActions.loadConfidenceDistributionFailure({
                message: getStatisticsError(error, 'Güven dağılımı yüklenemedi.'),
              }),
            ),
          ),
        ),
      ),
    ),
  );
}

/** Normalize ApiError mesajını korur; bilinmeyen hatada güvenli fallback döndürür. */
function getStatisticsError(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}
