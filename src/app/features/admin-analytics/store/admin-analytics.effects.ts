/** Bu dosya, admin analytics actionlarını beş gerçek API çağrısı ve DTO mapperlarıyla birleştirir. */
import { inject, Injectable } from '@angular/core';
import { ApiError } from '@core/errors/api-error.model';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { AdminAnalyticsApiService } from '../api/admin-analytics-api.service';
import { mapAdminDashboard, mapMostWrong, mapProviderStats, mapTopSaved, mapTopSearches } from '../mappers/admin-analytics.mapper';
import { AdminAnalyticsActions } from './admin-analytics.actions';

/** Admin analytics HTTP yan etkilerini component, reducer ve facade katmanlarından izole eder. */
@Injectable()
export class AdminAnalyticsEffects {
  /** NgRx action akışını effectlere sağlar. */
  private readonly actions$ = inject(Actions);
  /** Canlı ve admin yetkili analytics endpointlerini çağırır. */
  private readonly api = inject(AdminAnalyticsApiService);

  /** Dashboard aggregate cevabını son tarih sorgusuyla state'e taşır. */
  readonly loadDashboard$ = createEffect(() => this.actions$.pipe(
    ofType(AdminAnalyticsActions.loadDashboard),
    switchMap(({ query }) => this.api.getDashboard(query).pipe(
      map((dto) => AdminAnalyticsActions.loadDashboardSuccess({ dashboard: mapAdminDashboard(dto) })),
      catchError((error: unknown) => of(AdminAnalyticsActions.loadDashboardFailure({ message: getAdminAnalyticsError(error, 'Admin dashboard verileri yüklenemedi.') }))),
    )),
  ));

  /** Top searches cevabını nullable collectiondan normalize ederek state'e taşır. */
  readonly loadTopSearches$ = createEffect(() => this.actions$.pipe(
    ofType(AdminAnalyticsActions.loadTopSearches),
    switchMap(({ query }) => this.api.getTopSearches(query).pipe(
      map((dto) => AdminAnalyticsActions.loadTopSearchesSuccess({ analytics: mapTopSearches(dto) })),
      catchError((error: unknown) => of(AdminAnalyticsActions.loadTopSearchesFailure({ message: getAdminAnalyticsError(error, 'En çok arananlar yüklenemedi.') }))),
    )),
  ));

  /** Top saved cevabını son tarih ve limit sorgusuyla state'e taşır. */
  readonly loadTopSaved$ = createEffect(() => this.actions$.pipe(
    ofType(AdminAnalyticsActions.loadTopSaved),
    switchMap(({ query }) => this.api.getTopSaved(query).pipe(
      map((dto) => AdminAnalyticsActions.loadTopSavedSuccess({ analytics: mapTopSaved(dto) })),
      catchError((error: unknown) => of(AdminAnalyticsActions.loadTopSavedFailure({ message: getAdminAnalyticsError(error, 'En çok kaydedilenler yüklenemedi.') }))),
    )),
  ));

  /** Most wrong cevabını backend doğruluk oranlarını değiştirmeden state'e taşır. */
  readonly loadMostWrong$ = createEffect(() => this.actions$.pipe(
    ofType(AdminAnalyticsActions.loadMostWrong),
    switchMap(({ query }) => this.api.getMostWrong(query).pipe(
      map((dto) => AdminAnalyticsActions.loadMostWrongSuccess({ analytics: mapMostWrong(dto) })),
      catchError((error: unknown) => of(AdminAnalyticsActions.loadMostWrongFailure({ message: getAdminAnalyticsError(error, 'En çok yanlış cevaplananlar yüklenemedi.') }))),
    )),
  ));

  /** Provider aggregate ve collection cevabını son tarih sorgusuyla state'e taşır. */
  readonly loadProviderStats$ = createEffect(() => this.actions$.pipe(
    ofType(AdminAnalyticsActions.loadProviderStats),
    switchMap(({ query }) => this.api.getProviderStats(query).pipe(
      map((dto) => AdminAnalyticsActions.loadProviderStatsSuccess({ analytics: mapProviderStats(dto) })),
      catchError((error: unknown) => of(AdminAnalyticsActions.loadProviderStatsFailure({ message: getAdminAnalyticsError(error, 'Provider istatistikleri yüklenemedi.') }))),
    )),
  ));
}

/** Normalize ApiError mesajını korur; bilinmeyen hatada güvenli fallback döndürür. */
function getAdminAnalyticsError(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}
