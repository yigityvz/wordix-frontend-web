/** Bu dosya, canlı Swagger'daki quiz response payloadlarını transport katmanı için birebir tanımlar. */

/** Multiple-choice soruda backend tarafından üretilen tek option transport modelidir. */
export interface QuizOptionResponseDto {
  readonly quizOptionId: string;
  readonly displayOrder: number;
  readonly optionText: string | null;
}

/** Session başlangıcında backend tarafından üretilen tek question transport modelidir. */
export interface QuizQuestionResponseDto {
  readonly quizQuestionId: string;
  readonly questionOrder: number;
  readonly questionText: string | null;
  readonly learningItemId: string;
  readonly wordId: string | null;
  readonly phraseId: string | null;
  readonly sentenceId: string | null;
  readonly itemType: string | null;
  readonly questionType: string | null;
  readonly isSystemRecommended: boolean;
  readonly recommendationReason: string | null;
  readonly quizRecommendationItemId: string | null;
  readonly options: readonly QuizOptionResponseDto[] | null;
}

/** Start endpointinin session ve nullable question listesini taşıyan transport modelidir. */
export interface StartQuizResponseDto {
  readonly quizSessionId: string;
  readonly quizType: string | null;
  readonly quizSourceType: string | null;
  readonly quizContentMode: string | null;
  readonly includeSystemRecommendations: boolean;
  readonly questionCount: number;
  readonly startedAt: string;
  readonly status: string | null;
  readonly questions: readonly QuizQuestionResponseDto[] | null;
}

/** Answer endpointinin doğruluk ve progress sonucunu taşıyan transport modelidir. */
export interface SubmitQuizAnswerResponseDto {
  readonly quizAnswerId: string;
  readonly quizSessionId: string;
  readonly quizQuestionId: string;
  readonly selectedQuizOptionId: string | null;
  readonly isCorrect: boolean;
  readonly answerResult: string | null;
  readonly isPartiallyCorrect: boolean;
  readonly userAnswerText: string | null;
  readonly selectedOptionText: string | null;
  readonly correctAnswerText: string | null;
  readonly questionResponseTimeInMilliseconds: number | null;
  readonly answeredAt: string;
  readonly correctCount: number;
  readonly wrongCount: number;
  readonly consecutiveCorrectCount: number;
  readonly consecutiveWrongCount: number;
  readonly previousLearningStatus: string | null;
  readonly currentLearningStatus: string | null;
  readonly previousConfidenceScore: number;
  readonly currentConfidenceScore: number;
  readonly nextReviewDate: string | null;
  readonly progressUpdated: boolean;
  readonly isSystemRecommended: boolean;
  readonly quizRecommendationItemId: string | null;
  readonly recommendationReason: string | null;
  readonly canAddRecommendedItemToDictionary: boolean;
}

/** Summary içindeki tek sorunun backend değerlendirme transport modelidir. */
export interface QuizSummaryQuestionResponseDto {
  readonly quizQuestionId: string;
  readonly questionOrder: number;
  readonly questionText: string | null;
  readonly learningItemId: string;
  readonly isAnswered: boolean;
  readonly isCorrect: boolean | null;
  readonly selectedQuizOptionId: string | null;
  readonly selectedAnswerText: string | null;
  readonly correctAnswerText: string | null;
  readonly questionResponseTimeInMilliseconds: number | null;
  readonly answeredAt: string | null;
}

/** Session summary endpointinin aggregate ve nullable question listesini taşıyan transport modelidir. */
export interface QuizSummaryResponseDto {
  readonly quizSessionId: string;
  readonly quizType: string | null;
  readonly quizSourceType: string | null;
  readonly quizContentMode: string | null;
  readonly status: string | null;
  readonly startedAt: string;
  readonly totalQuestionCount: number;
  readonly answeredQuestionCount: number;
  readonly unansweredQuestionCount: number;
  readonly correctAnswerCount: number;
  readonly wrongAnswerCount: number;
  readonly accuracyRate: number;
  readonly completionRate: number;
  readonly averageQuestionResponseTimeInMilliseconds: number | null;
  readonly fastestQuestionResponseTimeInMilliseconds: number | null;
  readonly slowestQuestionResponseTimeInMilliseconds: number | null;
  readonly questions: readonly QuizSummaryQuestionResponseDto[] | null;
}

/** Quiz recommendation save endpointinin gerçek dictionary sonucunu taşıyan transport modelidir. */
export interface SaveRecommendedItemToDictionaryResponseDto {
  readonly quizRecommendationItemId: string;
  readonly learningItemId: string;
  readonly userLearningItemId: string;
  readonly userLearningProgressId: string;
  readonly selectedMeaningId: string | null;
  readonly recommendationReason: string | null;
  readonly wasAlreadySaved: boolean;
  readonly wasReactivated: boolean;
  readonly wasAddedToDictionary: boolean;
  readonly savedAt: string;
  readonly learningStatus: string | null;
  readonly learningConfidenceScore: number;
  readonly isActive: boolean;
}
