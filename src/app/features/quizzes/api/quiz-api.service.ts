/** Bu dosya, canlı Swagger'daki quiz endpointlerinin gerçek HTTP entegrasyonunu yönetir. */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppConfigService } from '@core/config/app-config.service';
import { unwrapApiResponse } from '@core/http/api-response.mapper';
import { ApiResponse } from '@core/http/models/api-response.model';
import { map, Observable } from 'rxjs';

import {
  QuizSummaryResponseDto,
  SaveRecommendedItemToDictionaryResponseDto,
  StartQuizResponseDto,
  SubmitQuizAnswerResponseDto,
} from '../models/quiz-api.models';
import { StartQuizRequest, SubmitQuizAnswerRequest } from '../models/quiz-request.models';

/** Quiz endpointlerini component ve state katmanından izole eden feature API servisidir. */
@Injectable()
export class QuizApiService {
  /** Interceptor zincirini kullanan Angular HTTP client üzerinden protected request gönderir. */
  private readonly httpClient = inject(HttpClient);

  /** Environment bazlı Wordix API adresini merkezi config servisinden okur. */
  private readonly apiBaseUrl = inject(AppConfigService).apiBaseUrl.replace(/\/+$/, '');

  /** Ownership alanı eklemeden yeni quiz sessionı gerçek start endpointinde oluşturur. */
  startQuiz(request: StartQuizRequest): Observable<StartQuizResponseDto> {
    return this.httpClient
      .post<ApiResponse<StartQuizResponseDto>>(`${this.apiBaseUrl}/quizzes`, request)
      .pipe(map(unwrapApiResponse));
  }

  /** Cevabı canonical session route'unda backend değerlendirmesine gönderir. */
  submitAnswer(
    quizSessionId: string,
    request: SubmitQuizAnswerRequest,
  ): Observable<SubmitQuizAnswerResponseDto> {
    const encodedSessionId = encodeURIComponent(quizSessionId);
    return this.httpClient
      .post<ApiResponse<SubmitQuizAnswerResponseDto>>(
        `${this.apiBaseUrl}/quizzes/${encodedSessionId}/answers`,
        request,
      )
      .pipe(map(unwrapApiResponse));
  }

  /** Canonical session UUID ile backend tarafından hesaplanan quiz özetini getirir. */
  getSummary(quizSessionId: string): Observable<QuizSummaryResponseDto> {
    const encodedSessionId = encodeURIComponent(quizSessionId);
    return this.httpClient
      .get<ApiResponse<QuizSummaryResponseDto>>(
        `${this.apiBaseUrl}/quizzes/${encodedSessionId}/summary`,
      )
      .pipe(map(unwrapApiResponse));
  }

  /** Recommendation itemını kendi canonical endpointiyle gerçek dictionary kaydına dönüştürür. */
  saveRecommendation(
    quizRecommendationItemId: string,
  ): Observable<SaveRecommendedItemToDictionaryResponseDto> {
    const encodedRecommendationId = encodeURIComponent(quizRecommendationItemId);
    return this.httpClient
      .post<ApiResponse<SaveRecommendedItemToDictionaryResponseDto>>(
        `${this.apiBaseUrl}/quizzes/recommendations/${encodedRecommendationId}/save-to-dictionary`,
        null,
      )
      .pipe(map(unwrapApiResponse));
  }
}
