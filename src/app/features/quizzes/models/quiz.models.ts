/** Bu dosya, quiz state ve UI katmanının kullanacağı normalize salt-okunur modelleri tanımlar. */

/** Multiple-choice soru içinde gösterilecek normalize option modelidir. */
export interface QuizOption {
  readonly quizOptionId: string;
  readonly displayOrder: number;
  readonly optionText: string;
}

/** Aktif quiz session içinde gösterilecek normalize question modelidir. */
export interface QuizQuestion {
  readonly quizQuestionId: string;
  readonly questionOrder: number;
  readonly questionText: string;
  readonly learningItemId: string;
  readonly wordId: string | null;
  readonly phraseId: string | null;
  readonly sentenceId: string | null;
  readonly itemType: string | null;
  readonly questionType: string | null;
  readonly isSystemRecommended: boolean;
  readonly recommendationReason: string | null;
  readonly quizRecommendationItemId: string | null;
  readonly options: readonly QuizOption[];
}

/** Yeni oluşturulan session ve normalize question listesini taşıyan modeldir. */
export interface QuizSession {
  readonly quizSessionId: string;
  readonly quizType: string | null;
  readonly quizSourceType: string | null;
  readonly quizContentMode: string | null;
  readonly includeSystemRecommendations: boolean;
  readonly questionCount: number;
  readonly startedAt: string;
  readonly status: string | null;
  readonly questions: readonly QuizQuestion[];
}

/** Backend tarafından değerlendirilen tek answer ve progress sonucudur. */
export interface QuizAnswerResult {
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

/** Summary ekranındaki tek question değerlendirme modelidir. */
export interface QuizSummaryQuestion {
  readonly quizQuestionId: string;
  readonly questionOrder: number;
  readonly questionText: string;
  readonly learningItemId: string;
  readonly isAnswered: boolean;
  readonly isCorrect: boolean | null;
  readonly selectedQuizOptionId: string | null;
  readonly selectedAnswerText: string | null;
  readonly correctAnswerText: string | null;
  readonly questionResponseTimeInMilliseconds: number | null;
  readonly answeredAt: string | null;
}

/** Session aggregate değerlerini ve normalize question breakdown listesini taşıyan modeldir. */
export interface QuizSummary {
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
  readonly questions: readonly QuizSummaryQuestion[];
}

/** Recommendation save işleminin gerçek dictionary ve progress sonucudur. */
export interface SavedQuizRecommendation {
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
