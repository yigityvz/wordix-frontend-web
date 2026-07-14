/** Bu dosya, canlı Swagger'daki beş admin analytics endpointinin gerçek HTTP entegrasyonunu yönetir. */
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WordixApiService } from '@core/http/wordix-api.service';
import { Observable } from 'rxjs';

import {
  AdminDashboardAnalyticsResponseDto,
  MostWrongLearningItemsAnalyticsResponseDto,
  ProviderStatsAnalyticsResponseDto,
  TopSavedLearningItemsAnalyticsResponseDto,
  TopSearchesAnalyticsResponseDto,
} from '../models/admin-analytics-api.models';
import {
  AdminAnalyticsDateRangeQuery,
  AdminAnalyticsListQuery,
} from '../models/admin-analytics-query.models';

/** Admin analytics endpointlerini component ve state katmanından izole eder. */
@Injectable()
export class AdminAnalyticsApiService extends WordixApiService {
  /** Admin dashboard aggregate cevabını getirir. */
  getDashboard(
    query: AdminAnalyticsDateRangeQuery = {},
  ): Observable<AdminDashboardAnalyticsResponseDto> {
    // Opsiyonel tarih aralığını canonical query adlarıyla merkezi GET adaptörüne iletir.
    return this.getData<AdminDashboardAnalyticsResponseDto>('admin/analytics/dashboard', {
      params: buildParams(query),
    });
  }

  /** En çok aranan sorguları opsiyonel tarih/limit filtresiyle getirir. */
  getTopSearches(query: AdminAnalyticsListQuery = {}): Observable<TopSearchesAnalyticsResponseDto> {
    // Liste filtrelerini admin authorization zincirini değiştirmeden gerçek endpointine gönderir.
    return this.getData<TopSearchesAnalyticsResponseDto>('admin/analytics/top-searches', {
      params: buildParams(query),
    });
  }

  /** En çok kaydedilen learning itemları opsiyonel tarih/limit filtresiyle getirir. */
  getTopSaved(
    query: AdminAnalyticsListQuery = {},
  ): Observable<TopSavedLearningItemsAnalyticsResponseDto> {
    // Liste filtrelerini ortak request seçenekleri üzerinden top-saved endpointine taşır.
    return this.getData<TopSavedLearningItemsAnalyticsResponseDto>('admin/analytics/top-saved', {
      params: buildParams(query),
    });
  }

  /** En çok yanlış cevaplanan learning itemları opsiyonel tarih/limit filtresiyle getirir. */
  getMostWrong(
    query: AdminAnalyticsListQuery = {},
  ): Observable<MostWrongLearningItemsAnalyticsResponseDto> {
    // Liste filtrelerini ortak request seçenekleri üzerinden most-wrong endpointine taşır.
    return this.getData<MostWrongLearningItemsAnalyticsResponseDto>('admin/analytics/most-wrong', {
      params: buildParams(query),
    });
  }

  /** Provider operasyon aggregate ve collection cevabını getirir. */
  getProviderStats(
    query: AdminAnalyticsDateRangeQuery = {},
  ): Observable<ProviderStatsAnalyticsResponseDto> {
    // Tarih aralığını provider aggregate endpointine merkezi response unwrap davranışıyla iletir.
    return this.getData<ProviderStatsAnalyticsResponseDto>('admin/analytics/provider-stats', {
      params: buildParams(query),
    });
  }
}

/** Undefined query değerlerini göndermeden Swagger PascalCase alanlarıyla params üretir. */
function buildParams(query: AdminAnalyticsDateRangeQuery | AdminAnalyticsListQuery): HttpParams {
  // Angular HttpClient ile uyumlu immutable query parametre koleksiyonunu boş olarak başlatır.
  let params = new HttpParams();

  // Yalnızca dolu başlangıç tarihini Swagger sözleşmesindeki alan adıyla ekler.
  if (query.fromUtc) {
    params = params.set('FromUtc', query.fromUtc);
  }

  // Yalnızca dolu bitiş tarihini Swagger sözleşmesindeki alan adıyla ekler.
  if (query.toUtc) {
    params = params.set('ToUtc', query.toUtc);
  }

  // Liste sorgularında tanımlı limit değerini sıfır dahil kaybetmeden query stringe ekler.
  if ('limit' in query && query.limit !== undefined) {
    params = params.set('Limit', String(query.limit));
  }

  // Hazırlanan parametreleri ortak API client request seçeneklerinde kullanılmak üzere döndürür.
  return params;
}
