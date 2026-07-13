/** Bu dosya, quiz mapperlarının nullable backend listelerini normalize edip backend kararlarını koruduğunu doğrular. */
import { describe, expect, it } from 'vitest';

import { StartQuizResponseDto, SubmitQuizAnswerResponseDto } from '../models/quiz-api.models';
import { mapQuizAnswerResult, mapQuizSession } from './quiz.mapper';

/** Session normalizasyonunu ve answer doğruluk değerinin değiştirilmediğini sınar. */
describe('quiz mappers', () => {
  /** Nullable question listesinin UI için boş diziye dönüştürüldüğünü doğrular. */
  it('normalizes a nullable question collection', () => {
    const dto: StartQuizResponseDto = {
      quizSessionId: '11111111-1111-1111-1111-111111111111',
      quizType: 'Mixed',
      quizSourceType: 'UserDictionary',
      quizContentMode: 'Mixed',
      includeSystemRecommendations: true,
      questionCount: 10,
      startedAt: '2026-07-13T12:00:00Z',
      status: 'InProgress',
      questions: null,
    };

    expect(mapQuizSession(dto).questions).toEqual([]);
  });

  /** Backendin false doğruluk ve progress değerlerinin frontend hesabıyla değiştirilmediğini doğrular. */
  it('preserves the backend answer evaluation', () => {
    const dto = createAnswerDto();

    expect(mapQuizAnswerResult(dto)).toMatchObject({
      isCorrect: false,
      answerResult: 'Incorrect',
      currentConfidenceScore: 25,
      progressUpdated: true,
    });
  });
});

/** Mapper testi için canlı sözleşmedeki bütün answer alanlarını içeren fixture üretir. */
function createAnswerDto(): SubmitQuizAnswerResponseDto {
  return {
    quizAnswerId: '11111111-1111-1111-1111-111111111111',
    quizSessionId: '22222222-2222-2222-2222-222222222222',
    quizQuestionId: '33333333-3333-3333-3333-333333333333',
    selectedQuizOptionId: null,
    isCorrect: false,
    answerResult: 'Incorrect',
    isPartiallyCorrect: false,
    userAnswerText: 'sea',
    selectedOptionText: null,
    correctAnswerText: 'ocean',
    questionResponseTimeInMilliseconds: 1200,
    answeredAt: '2026-07-13T12:00:00Z',
    correctCount: 0,
    wrongCount: 1,
    consecutiveCorrectCount: 0,
    consecutiveWrongCount: 1,
    previousLearningStatus: 'Learning',
    currentLearningStatus: 'Learning',
    previousConfidenceScore: 30,
    currentConfidenceScore: 25,
    nextReviewDate: '2026-07-14T12:00:00Z',
    progressUpdated: true,
    isSystemRecommended: false,
    quizRecommendationItemId: null,
    recommendationReason: null,
    canAddRecommendedItemToDictionary: false,
  };
}
