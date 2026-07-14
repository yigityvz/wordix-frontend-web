/** Bu dosya, canlı Swagger'daki beş user-statistics endpointinin gerçek HTTP entegrasyonunu yönetir. */
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WordixApiService } from '@core/http/wordix-api.service';
import { Observable } from 'rxjs';
import {
  ConfidenceScoreDistributionResponseDto,
  DeckStatisticsResponseDto,
  DifficultLearningItemsPagedResponseDto,
  QuizStatisticsResponseDto,
  UserLearningSummaryResponseDto,
} from '../models/statistics-api.models';
import { DifficultItemsQuery, QuizStatisticsQuery } from '../models/statistics-query.models';

/** Statistics endpointlerini component ve state katmanından izole eder. */
@Injectable()
export class StatisticsApiService extends WordixApiService {
  /** Kullanıcının aggregate learning summary cevabını getirir. */
  getLearningSummary(): Observable<UserLearningSummaryResponseDto> {
    // Ownership parametresi eklemeden summary payloadını merkezi GET adaptöründen alır.
    return this.getData<UserLearningSummaryResponseDto>('user-statistics/learning-summary');
  }

  /** Swagger-supported optional filtrelerle quiz statistics cevabını getirir. */
  getQuizStatistics(query: QuizStatisticsQuery = {}): Observable<QuizStatisticsResponseDto> {
    // Boş olmayan quiz filtrelerini canonical Swagger adlarıyla ortak request seçeneklerine ekler.
    return this.getData<QuizStatisticsResponseDto>('user-statistics/quizzes', {
      params: buildQueryParams(query),
    });
  }

  /** Swagger-supported pagination ve filtrelerle difficult items cevabını getirir. */
  getDifficultItems(
    query: DifficultItemsQuery = {},
  ): Observable<DifficultLearningItemsPagedResponseDto> {
    // Pagination ve difficult-item filtrelerini değiştirmeden merkezi GET adaptörüne iletir.
    return this.getData<DifficultLearningItemsPagedResponseDto>('user-statistics/difficult-items', {
      params: buildQueryParams(query),
    });
  }

  /** Authenticated kullanıcının deck statistics collectionını getirir. */
  getDeckStatistics(): Observable<DeckStatisticsResponseDto> {
    // Deck istatistiklerini kullanıcı kimliği göndermeden gerçek endpointten getirir.
    return this.getData<DeckStatisticsResponseDto>('user-statistics/decks');
  }

  /** Confidence score bucket dağılımını gerçek endpointten getirir. */
  getConfidenceDistribution(): Observable<ConfidenceScoreDistributionResponseDto> {
    // Confidence bucket payloadını merkezi response unwrap davranışıyla döndürür.
    return this.getData<ConfidenceScoreDistributionResponseDto>(
      'user-statistics/confidence-distribution',
    );
  }
}

/** Undefined/boş query değerlerini göndermeden Swagger alan adlarıyla HttpParams üretir. */
function buildQueryParams(query: QuizStatisticsQuery | DifficultItemsQuery): HttpParams {
  const names: Record<string, string> = {
    fromUtc: 'FromUtc',
    toUtc: 'ToUtc',
    quizType: 'QuizType',
    quizSourceType: 'QuizSourceType',
    quizContentMode: 'QuizContentMode',
    difficultyGroup: 'DifficultyGroup',
    pageNumber: 'PageNumber',
    pageSize: 'PageSize',
    source: 'Source',
    sortBy: 'SortBy',
    itemType: 'ItemType',
    learningStatus: 'LearningStatus',
  };

  // Angular HttpClient ile uyumlu immutable query parametre koleksiyonunu boş olarak başlatır.
  let params = new HttpParams();

  // Yalnızca backend sözleşmesinde anlamlı bir değeri bulunan filtreleri query stringe ekler.
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') {
      params = params.set(names[key] ?? key, String(value));
    }
  }

  // Hazırlanan parametreleri ortak API client request seçeneklerinde kullanılmak üzere döndürür.
  return params;
}
