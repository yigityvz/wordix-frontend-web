/** Bu dosya, canlı Swagger'daki beş user-statistics endpointinin gerçek HTTP entegrasyonunu yönetir. */
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppConfigService } from '@core/config/app-config.service';
import { unwrapApiResponse } from '@core/http/api-response.mapper';
import { ApiResponse } from '@core/http/models/api-response.model';
import { map, Observable } from 'rxjs';
import { ConfidenceScoreDistributionResponseDto, DeckStatisticsResponseDto, DifficultLearningItemsPagedResponseDto, QuizStatisticsResponseDto, UserLearningSummaryResponseDto } from '../models/statistics-api.models';
import { DifficultItemsQuery, QuizStatisticsQuery } from '../models/statistics-query.models';

/** Statistics endpointlerini component ve state katmanından izole eder. */
@Injectable()
export class StatisticsApiService {
  /** Protected requestleri interceptor zinciri üzerinden gönderen HTTP clienttır. */
  private readonly httpClient = inject(HttpClient);
  /** Environment bazlı API adresini merkezi config servisinden okur. */
  private readonly apiBaseUrl = inject(AppConfigService).apiBaseUrl.replace(/\/+$/, '');
  /** Kullanıcının aggregate learning summary cevabını getirir. */
  getLearningSummary(): Observable<UserLearningSummaryResponseDto> { return this.get<UserLearningSummaryResponseDto>('learning-summary'); }
  /** Swagger-supported optional filtrelerle quiz statistics cevabını getirir. */
  getQuizStatistics(query: QuizStatisticsQuery = {}): Observable<QuizStatisticsResponseDto> { return this.get<QuizStatisticsResponseDto>('quizzes', buildQueryParams(query)); }
  /** Swagger-supported pagination ve filtrelerle difficult items cevabını getirir. */
  getDifficultItems(query: DifficultItemsQuery = {}): Observable<DifficultLearningItemsPagedResponseDto> { return this.get<DifficultLearningItemsPagedResponseDto>('difficult-items', buildQueryParams(query)); }
  /** Authenticated kullanıcının deck statistics collectionını getirir. */
  getDeckStatistics(): Observable<DeckStatisticsResponseDto> { return this.get<DeckStatisticsResponseDto>('decks'); }
  /** Confidence score bucket dağılımını gerçek endpointten getirir. */
  getConfidenceDistribution(): Observable<ConfidenceScoreDistributionResponseDto> { return this.get<ConfidenceScoreDistributionResponseDto>('confidence-distribution'); }
  /** Ortak ApiResponse unwrap davranışıyla tek statistics GET isteği gönderir. */
  private get<T>(path: string, params?: HttpParams): Observable<T> { return this.httpClient.get<ApiResponse<T>>(`${this.apiBaseUrl}/user-statistics/${path}`, { params }).pipe(map(unwrapApiResponse)); }
}

/** Undefined/boş query değerlerini göndermeden Swagger alan adlarıyla HttpParams üretir. */
function buildQueryParams(query: QuizStatisticsQuery | DifficultItemsQuery): HttpParams {
  const names: Record<string, string> = { fromUtc:'FromUtc', toUtc:'ToUtc', quizType:'QuizType', quizSourceType:'QuizSourceType', quizContentMode:'QuizContentMode', difficultyGroup:'DifficultyGroup', pageNumber:'PageNumber', pageSize:'PageSize', source:'Source', sortBy:'SortBy', itemType:'ItemType', learningStatus:'LearningStatus' };
  let params = new HttpParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') params = params.set(names[key] ?? key, String(value));
  }
  return params;
}
