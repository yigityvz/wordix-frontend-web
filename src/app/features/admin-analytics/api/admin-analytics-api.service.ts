/** Bu dosya, canlı Swagger'daki beş admin analytics endpointinin gerçek HTTP entegrasyonunu yönetir. */
import { HttpClient,HttpParams } from '@angular/common/http';
import { inject,Injectable } from '@angular/core';
import { AppConfigService } from '@core/config/app-config.service';
import { unwrapApiResponse } from '@core/http/api-response.mapper';
import { ApiResponse } from '@core/http/models/api-response.model';
import { map,Observable } from 'rxjs';
import { AdminDashboardAnalyticsResponseDto,MostWrongLearningItemsAnalyticsResponseDto,ProviderStatsAnalyticsResponseDto,TopSavedLearningItemsAnalyticsResponseDto,TopSearchesAnalyticsResponseDto } from '../models/admin-analytics-api.models';
import { AdminAnalyticsDateRangeQuery,AdminAnalyticsListQuery } from '../models/admin-analytics-query.models';
/** Admin analytics endpointlerini component ve state katmanından izole eder. */
@Injectable()
export class AdminAnalyticsApiService {
  /** Bearer interceptor zincirini kullanan HTTP clienttır. */ private readonly http=inject(HttpClient);
  /** Environment bazlı API adresini merkezi config servisinden okur. */ private readonly base=inject(AppConfigService).apiBaseUrl.replace(/\/+$/,'');
  /** Admin dashboard aggregate cevabını getirir. */ getDashboard(query:AdminAnalyticsDateRangeQuery={}):Observable<AdminDashboardAnalyticsResponseDto>{return this.get('dashboard',query);}
  /** En çok aranan sorguları opsiyonel tarih/limit filtresiyle getirir. */ getTopSearches(query:AdminAnalyticsListQuery={}):Observable<TopSearchesAnalyticsResponseDto>{return this.get('top-searches',query);}
  /** En çok kaydedilen learning itemları opsiyonel tarih/limit filtresiyle getirir. */ getTopSaved(query:AdminAnalyticsListQuery={}):Observable<TopSavedLearningItemsAnalyticsResponseDto>{return this.get('top-saved',query);}
  /** En çok yanlış cevaplanan learning itemları opsiyonel tarih/limit filtresiyle getirir. */ getMostWrong(query:AdminAnalyticsListQuery={}):Observable<MostWrongLearningItemsAnalyticsResponseDto>{return this.get('most-wrong',query);}
  /** Provider operasyon aggregate ve collection cevabını getirir. */ getProviderStats(query:AdminAnalyticsDateRangeQuery={}):Observable<ProviderStatsAnalyticsResponseDto>{return this.get('provider-stats',query);}
  /** Ortak ApiResponse unwrap davranışıyla admin analytics GET isteği gönderir. */ private get<T>(path:string,query:AdminAnalyticsDateRangeQuery|AdminAnalyticsListQuery):Observable<T>{return this.http.get<ApiResponse<T>>(`${this.base}/admin/analytics/${path}`,{params:buildParams(query)}).pipe(map(unwrapApiResponse));}
}
/** Undefined query değerlerini göndermeden Swagger PascalCase alanlarıyla params üretir. */
function buildParams(query:AdminAnalyticsDateRangeQuery|AdminAnalyticsListQuery):HttpParams{let params=new HttpParams();if(query.fromUtc)params=params.set('FromUtc',query.fromUtc);if(query.toUtc)params=params.set('ToUtc',query.toUtc);if('limit' in query&&query.limit!==undefined)params=params.set('Limit',String(query.limit));return params;}
