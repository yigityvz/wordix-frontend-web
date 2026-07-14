/** Bu dosya, canlı Swagger'daki quiz endpointlerinin gerçek HTTP entegrasyonunu yönetir. */
import { Injectable } from '@angular/core';
import { WordixApiService } from '@core/http/wordix-api.service';
import { Observable } from 'rxjs';

import {
  QuizSummaryResponseDto,
  SaveRecommendedItemToDictionaryResponseDto,
  StartQuizResponseDto,
  SubmitQuizAnswerResponseDto,
} from '../models/quiz-api.models';
import { StartQuizRequest, SubmitQuizAnswerRequest } from '../models/quiz-request.models';

/** Quiz endpointlerini component ve state katmanından izole eden feature API servisidir. */
@Injectable()
export class QuizApiService extends WordixApiService {
  /** Ownership alanı eklemeden yeni quiz sessionı gerçek start endpointinde oluşturur. */
  startQuiz(request: StartQuizRequest): Observable<StartQuizResponseDto> {
    // Quiz start body ve response tipini merkezi Wordix POST adaptörü üzerinden taşır.
    return this.postData<StartQuizRequest, StartQuizResponseDto>('quizzes', request);
  }

  /** Cevabı canonical session route'unda backend değerlendirmesine gönderir. */
  submitAnswer(
    quizSessionId: string,
    request: SubmitQuizAnswerRequest,
  ): Observable<SubmitQuizAnswerResponseDto> {
    // Route kimliğini path segmentine eklemeden önce güvenli URL encoding uygular.
    const encodedSessionId = encodeURIComponent(quizSessionId);

    // Cevap doğruluğunu frontendde hesaplamadan backend operasyonuna iletir.
    return this.postData<SubmitQuizAnswerRequest, SubmitQuizAnswerResponseDto>(
      `quizzes/${encodedSessionId}/answers`,
      request,
    );
  }

  /** Canonical session UUID ile backend tarafından hesaplanan quiz özetini getirir. */
  getSummary(quizSessionId: string): Observable<QuizSummaryResponseDto> {
    // Route kimliğini path segmentine eklemeden önce güvenli URL encoding uygular.
    const encodedSessionId = encodeURIComponent(quizSessionId);

    // Backend tarafından hesaplanan summary payloadını merkezi GET adaptöründen alır.
    return this.getData<QuizSummaryResponseDto>(`quizzes/${encodedSessionId}/summary`);
  }

  /** Recommendation itemını kendi canonical endpointiyle gerçek dictionary kaydına dönüştürür. */
  saveRecommendation(
    quizRecommendationItemId: string,
  ): Observable<SaveRecommendedItemToDictionaryResponseDto> {
    // Recommendation kimliğini path segmentine eklemeden önce güvenli URL encoding uygular.
    const encodedRecommendationId = encodeURIComponent(quizRecommendationItemId);

    // Swagger'ın body istemeyen POST sözleşmesini açık null body ile korur.
    return this.postData<null, SaveRecommendedItemToDictionaryResponseDto>(
      `quizzes/recommendations/${encodedRecommendationId}/save-to-dictionary`,
      null,
    );
  }
}
