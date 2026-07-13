/** Bu dosya, quiz effects'in API sonuçlarını session, answer, summary ve save actionlarına çevirdiğini doğrular. */
import { TestBed } from '@angular/core/testing';
import { ApiError } from '@core/errors/api-error.model';
import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { firstValueFrom, of, Subject, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { QuizApiService } from '../api/quiz-api.service';
import { StartQuizRequest } from '../models/quiz-request.models';
import { QuizActions } from './quiz.actions';
import { QuizEffects } from './quiz.effects';

/** Dört quiz effectini isolated action/API akışıyla sınar. */
describe('QuizEffects', () => {
  /** Her testte effecte action gönderen hot observable kaynağını tutar. */
  let actionsSubject: Subject<Action>;

  /** Gerçek HTTP yerine kontrollü observable döndüren API mock metodlarıdır. */
  const startQuiz = vi.fn();
  const submitAnswer = vi.fn();
  const getSummary = vi.fn();
  const saveRecommendation = vi.fn();

  /** Her test için action stream, API mockları ve effect injection containerını yeniden kurar. */
  beforeEach(() => {
    actionsSubject = new Subject<Action>();
    startQuiz.mockReset();
    submitAnswer.mockReset();
    getSummary.mockReset();
    saveRecommendation.mockReset();

    TestBed.configureTestingModule({
      providers: [
        QuizEffects,
        { provide: Actions, useFactory: () => new Actions(actionsSubject) },
        {
          provide: QuizApiService,
          useValue: { startQuiz, submitAnswer, getSummary, saveRecommendation },
        },
      ],
    });
  });

  /** Nullable question listesinin mapper ile boş diziye dönüştürülüp success actionına taşındığını doğrular. */
  it('maps a started quiz session', async () => {
    const request = createStartRequest();
    startQuiz.mockReturnValue(
      of({
        quizSessionId: '11111111-1111-1111-1111-111111111111',
        quizType: request.quizType,
        quizSourceType: request.quizSourceType,
        quizContentMode: request.quizContentMode,
        includeSystemRecommendations: true,
        questionCount: 10,
        startedAt: '2026-07-13T12:00:00Z',
        status: 'InProgress',
        questions: null,
      }),
    );
    const effectResult = firstValueFrom(TestBed.inject(QuizEffects).startQuiz$);

    actionsSubject.next(QuizActions.startQuiz({ request }));

    await expect(effectResult).resolves.toEqual(
      QuizActions.startQuizSuccess({
        session: {
          quizSessionId: '11111111-1111-1111-1111-111111111111',
          quizType: request.quizType,
          quizSourceType: request.quizSourceType,
          quizContentMode: request.quizContentMode,
          includeSystemRecommendations: true,
          questionCount: 10,
          startedAt: '2026-07-13T12:00:00Z',
          status: 'InProgress',
          questions: [],
        },
      }),
    );
    expect(startQuiz).toHaveBeenCalledWith(request);
  });

  /** Backendin false doğruluk sonucunun değiştirilmeden success actionına taşındığını doğrular. */
  it('preserves the backend answer evaluation', async () => {
    const dto = createAnswerDto();
    const request = {
      quizQuestionId: dto.quizQuestionId,
      selectedQuizOptionId: null,
      userAnswer: 'sea',
      questionResponseTimeInMilliseconds: 1200,
    };
    submitAnswer.mockReturnValue(of(dto));
    const effectResult = firstValueFrom(TestBed.inject(QuizEffects).submitAnswer$);

    actionsSubject.next(QuizActions.submitAnswer({ quizSessionId: dto.quizSessionId, request }));

    await expect(effectResult).resolves.toEqual(QuizActions.submitAnswerSuccess({ result: dto }));
    expect(submitAnswer).toHaveBeenCalledWith(dto.quizSessionId, request);
  });

  /** Normalize summary API hatasının güvenli failure actionına taşındığını doğrular. */
  it('preserves a normalized summary error', async () => {
    const apiError = new ApiError({
      kind: 'not-found',
      statusCode: 404,
      message: 'Quiz session was not found.',
      errorCode: 'Quiz.SessionNotFound',
      detail: null,
      traceId: null,
      validationErrors: [],
      timestamp: '2026-07-13T12:00:00Z',
    });
    getSummary.mockReturnValue(throwError(() => apiError));
    const effectResult = firstValueFrom(TestBed.inject(QuizEffects).loadSummary$);

    actionsSubject.next(
      QuizActions.loadSummary({ quizSessionId: '11111111-1111-1111-1111-111111111111' }),
    );

    await expect(effectResult).resolves.toEqual(
      QuizActions.loadSummaryFailure({ message: 'Quiz session was not found.' }),
    );
  });

  /** Recommendation save DTO'sunun canonical dictionary kimliğiyle success actionına dönüştüğünü doğrular. */
  it('maps a saved quiz recommendation', async () => {
    const dto = createSavedRecommendationDto();
    saveRecommendation.mockReturnValue(of(dto));
    const effectResult = firstValueFrom(TestBed.inject(QuizEffects).saveRecommendation$);

    actionsSubject.next(
      QuizActions.saveRecommendation({
        quizRecommendationItemId: dto.quizRecommendationItemId,
      }),
    );

    await expect(effectResult).resolves.toEqual(
      QuizActions.saveRecommendationSuccess({ result: dto }),
    );
  });
});

/** Effect testlerinde kullanılan canonical start requestini üretir. */
function createStartRequest(): StartQuizRequest {
  return {
    quizType: 'Test',
    quizSourceType: 'UserDictionary',
    quizContentMode: 'Mixed',
    questionCount: 10,
    deckId: null,
    includeSystemRecommendations: true,
  };
}

/** Effect testi için canlı sözleşmedeki bütün answer alanlarını içeren DTO üretir. */
function createAnswerDto() {
  return {
    quizAnswerId: '55555555-5555-5555-5555-555555555555',
    quizSessionId: '11111111-1111-1111-1111-111111111111',
    quizQuestionId: '22222222-2222-2222-2222-222222222222',
    selectedQuizOptionId: null,
    isCorrect: false,
    answerResult: 'Incorrect',
    isPartiallyCorrect: false,
    userAnswerText: 'sea',
    selectedOptionText: null,
    correctAnswerText: 'ocean',
    questionResponseTimeInMilliseconds: 1200,
    answeredAt: '2026-07-13T12:01:00Z',
    correctCount: 0,
    wrongCount: 1,
    consecutiveCorrectCount: 0,
    consecutiveWrongCount: 1,
    previousLearningStatus: 'Learning',
    currentLearningStatus: 'Learning',
    previousConfidenceScore: 30,
    currentConfidenceScore: 25,
    nextReviewDate: null,
    progressUpdated: true,
    isSystemRecommended: false,
    quizRecommendationItemId: null,
    recommendationReason: null,
    canAddRecommendedItemToDictionary: false,
  };
}

/** Effect testi için recommendation save endpointinin eksiksiz DTO fixture'ını üretir. */
function createSavedRecommendationDto() {
  return {
    quizRecommendationItemId: '66666666-6666-6666-6666-666666666666',
    learningItemId: '77777777-7777-7777-7777-777777777777',
    userLearningItemId: '88888888-8888-8888-8888-888888888888',
    userLearningProgressId: '99999999-9999-9999-9999-999999999999',
    selectedMeaningId: null,
    recommendationReason: 'Needs more practice',
    wasAlreadySaved: false,
    wasReactivated: false,
    wasAddedToDictionary: true,
    savedAt: '2026-07-13T12:02:00Z',
    learningStatus: 'New',
    learningConfidenceScore: 0,
    isActive: true,
  };
}
