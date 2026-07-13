/** Bu dosya, quiz API service'in canlı Swagger route, method, body ve unwrap davranışını doğrular. */
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AppConfigService } from '@core/config/app-config.service';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { QuizApiService } from './quiz-api.service';

/** Dört canonical quiz operasyonunu Angular HTTP test backend'iyle sınar. */
describe('QuizApiService', () => {
  /** Her testte bekleyen HTTP requestlerini yöneten controllerı tutar. */
  let httpTestingController: HttpTestingController;

  /** Quiz service ve kontrollü API base URL providerlarını test containerına kaydeder. */
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        QuizApiService,
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:5000/api/' } },
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  /** Test sonunda karşılanmamış veya beklenmeyen HTTP requesti kalmadığını doğrular. */
  afterEach(() => {
    httpTestingController.verify();
  });

  /** Start requestinin Swagger alanlarını ownership ve difficulty eklemeden gönderdiğini doğrular. */
  it('starts a quiz with the canonical request body', async () => {
    const body = {
      quizType: 'Test',
      quizSourceType: 'UserDictionary',
      quizContentMode: 'Mixed',
      questionCount: 10,
      deckId: null,
      includeSystemRecommendations: true,
    } as const;
    const result = firstValueFrom(TestBed.inject(QuizApiService).startQuiz(body));
    const request = httpTestingController.expectOne('http://localhost:5000/api/quizzes');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(body);
    expect(request.request.body).not.toHaveProperty('difficulty');
    expect(request.request.body).not.toHaveProperty('userId');
    request.flush(createApiResponse({ quizSessionId: 'session-1', questions: null }));

    await expect(result).resolves.toMatchObject({ quizSessionId: 'session-1' });
  });

  /** Answer requestinin canonical session route'una backend değerlendirmesi için gönderildiğini doğrular. */
  it('submits an answer without calculating correctness locally', async () => {
    const sessionId = '11111111-1111-1111-1111-111111111111';
    const body = {
      quizQuestionId: '22222222-2222-2222-2222-222222222222',
      selectedQuizOptionId: '33333333-3333-3333-3333-333333333333',
      userAnswer: null,
      questionResponseTimeInMilliseconds: 1250,
    } as const;
    const result = firstValueFrom(TestBed.inject(QuizApiService).submitAnswer(sessionId, body));
    const request = httpTestingController.expectOne(
      `http://localhost:5000/api/quizzes/${sessionId}/answers`,
    );

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(body);
    request.flush(createApiResponse({ isCorrect: false, correctAnswerText: 'ocean' }));

    await expect(result).resolves.toMatchObject({ isCorrect: false, correctAnswerText: 'ocean' });
  });

  /** Summary requestinin canonical session UUID route segmentini kullandığını doğrular. */
  it('loads the backend-calculated quiz summary', async () => {
    const sessionId = '11111111-1111-1111-1111-111111111111';
    const result = firstValueFrom(TestBed.inject(QuizApiService).getSummary(sessionId));
    const request = httpTestingController.expectOne(
      `http://localhost:5000/api/quizzes/${sessionId}/summary`,
    );

    expect(request.request.method).toBe('GET');
    request.flush(createApiResponse({ quizSessionId: sessionId, questions: null }));

    await expect(result).resolves.toMatchObject({ quizSessionId: sessionId });
  });

  /** Recommendation save requestinin body olmadan kendi canonical nested route'una gittiğini doğrular. */
  it('saves a recommended item to the real dictionary endpoint', async () => {
    const recommendationId = '44444444-4444-4444-4444-444444444444';
    const result = firstValueFrom(
      TestBed.inject(QuizApiService).saveRecommendation(recommendationId),
    );
    const request = httpTestingController.expectOne(
      `http://localhost:5000/api/quizzes/recommendations/${recommendationId}/save-to-dictionary`,
    );

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toBeNull();
    request.flush(
      createApiResponse({ quizRecommendationItemId: recommendationId, wasAddedToDictionary: true }),
    );

    await expect(result).resolves.toMatchObject({ wasAddedToDictionary: true });
  });
});

/** Test payloadını production `ApiResponse<T>` zarfına sarar. */
function createApiResponse<T>(data: T): {
  readonly success: true;
  readonly message: null;
  readonly data: T;
  readonly timestamp: string;
} {
  return { success: true, message: null, data, timestamp: '2026-07-13T12:00:00Z' };
}
