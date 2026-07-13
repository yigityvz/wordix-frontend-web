/** Bu dosya, quiz session, answer, summary ve recommendation state geçişlerini doğrular. */
import { describe, expect, it } from 'vitest';

import { QuizAnswerResult, QuizSession } from '../models/quiz.models';
import { QuizActions } from './quiz.actions';
import { quizReducer } from './quiz.reducer';
import { initialQuizState } from './quiz.state';

/** Quiz reducerın bağımsız lifecycle alanlarını immutable güncellediğini sınar. */
describe('quizReducer', () => {
  /** Yeni start niyetinin önceki session ve answer sonuçlarını temizlediğini doğrular. */
  it('starts a clean quiz session lifecycle', () => {
    const previousAnswer = createAnswerResult();
    const result = quizReducer(
      {
        ...initialQuizState,
        session: createSession(),
        answersByQuestionId: { [previousAnswer.quizQuestionId]: previousAnswer },
      },
      QuizActions.startQuiz({
        request: {
          quizType: 'Test',
          quizSourceType: 'UserDictionary',
          quizContentMode: 'Mixed',
          questionCount: 10,
          deckId: null,
          includeSystemRecommendations: true,
        },
      }),
    );

    expect(result.sessionStatus).toBe('loading');
    expect(result.session).toBeNull();
    expect(result.answersByQuestionId).toEqual({});
  });

  /** Start success sonucunun yalnızca backend tarafından oluşturulan sessionı state'e aldığını doğrular. */
  it('stores the backend-created quiz session', () => {
    const session = createSession();
    const result = quizReducer(initialQuizState, QuizActions.startQuizSuccess({ session }));

    expect(result.sessionStatus).toBe('loaded');
    expect(result.session).toBe(session);
  });

  /** Answer success sonucunun backend değerlendirmesini question UUID altında sakladığını doğrular. */
  it('indexes the backend answer result by question id', () => {
    const answer = createAnswerResult();
    const result = quizReducer(
      initialQuizState,
      QuizActions.submitAnswerSuccess({ result: answer }),
    );

    expect(result.answerStatus).toBe('loaded');
    expect(result.answersByQuestionId[answer.quizQuestionId]).toBe(answer);
    expect(result.latestAnswer?.isCorrect).toBe(false);
  });

  /** Clear actionının bütün quiz feature state'ini başlangıç durumuna döndürdüğünü doğrular. */
  it('clears the complete quiz state', () => {
    const populatedState = {
      ...initialQuizState,
      sessionStatus: 'loaded' as const,
      session: createSession(),
    };

    expect(quizReducer(populatedState, QuizActions.clear())).toEqual(initialQuizState);
  });
});

/** Reducer testleri için tek sorulu normalize quiz session fixture'ı üretir. */
function createSession(): QuizSession {
  return {
    quizSessionId: '11111111-1111-1111-1111-111111111111',
    quizType: 'Test',
    quizSourceType: 'UserDictionary',
    quizContentMode: 'Mixed',
    includeSystemRecommendations: true,
    questionCount: 1,
    startedAt: '2026-07-13T12:00:00Z',
    status: 'InProgress',
    questions: [
      {
        quizQuestionId: '22222222-2222-2222-2222-222222222222',
        questionOrder: 1,
        questionText: 'Translate ocean',
        learningItemId: '33333333-3333-3333-3333-333333333333',
        wordId: '44444444-4444-4444-4444-444444444444',
        phraseId: null,
        sentenceId: null,
        itemType: 'Word',
        questionType: 'Writing',
        isSystemRecommended: false,
        recommendationReason: null,
        quizRecommendationItemId: null,
        options: [],
      },
    ],
  };
}

/** Reducer testleri için backend tarafından yanlış olarak değerlendirilmiş answer fixture'ı üretir. */
function createAnswerResult(): QuizAnswerResult {
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
