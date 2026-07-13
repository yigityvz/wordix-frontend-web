/** Bu dosya, quiz transport DTO'larını state ve UI için normalize modellere dönüştürür. */
import {
  QuizOptionResponseDto,
  QuizQuestionResponseDto,
  QuizSummaryQuestionResponseDto,
  QuizSummaryResponseDto,
  SaveRecommendedItemToDictionaryResponseDto,
  StartQuizResponseDto,
  SubmitQuizAnswerResponseDto,
} from '../models/quiz-api.models';
import {
  QuizAnswerResult,
  QuizOption,
  QuizQuestion,
  QuizSession,
  QuizSummary,
  QuizSummaryQuestion,
  SavedQuizRecommendation,
} from '../models/quiz.models';

/** Nullable question listesini boş diziye normalize ederek yeni session modelini üretir. */
export function mapQuizSession(dto: StartQuizResponseDto): QuizSession {
  return {
    quizSessionId: dto.quizSessionId,
    quizType: dto.quizType,
    quizSourceType: dto.quizSourceType,
    quizContentMode: dto.quizContentMode,
    includeSystemRecommendations: dto.includeSystemRecommendations,
    questionCount: dto.questionCount,
    startedAt: dto.startedAt,
    status: dto.status,
    questions: (dto.questions ?? []).map(mapQuizQuestion),
  };
}

/** Ham question DTO'sunu nullable metin ve option listesini normalize ederek dönüştürür. */
export function mapQuizQuestion(dto: QuizQuestionResponseDto): QuizQuestion {
  return {
    quizQuestionId: dto.quizQuestionId,
    questionOrder: dto.questionOrder,
    questionText: dto.questionText ?? '',
    learningItemId: dto.learningItemId,
    wordId: dto.wordId,
    phraseId: dto.phraseId,
    sentenceId: dto.sentenceId,
    itemType: dto.itemType,
    questionType: dto.questionType,
    isSystemRecommended: dto.isSystemRecommended,
    recommendationReason: dto.recommendationReason,
    quizRecommendationItemId: dto.quizRecommendationItemId,
    options: (dto.options ?? []).map(mapQuizOption),
  };
}

/** Ham option DTO'sunu UI için null olmayan metinle dönüştürür. */
export function mapQuizOption(dto: QuizOptionResponseDto): QuizOption {
  return {
    quizOptionId: dto.quizOptionId,
    displayOrder: dto.displayOrder,
    optionText: dto.optionText ?? '',
  };
}

/** Backend answer değerlendirmesini hiçbir doğruluk hesabı yapmadan state modeline taşır. */
export function mapQuizAnswerResult(dto: SubmitQuizAnswerResponseDto): QuizAnswerResult {
  return { ...dto };
}

/** Nullable question breakdown listesini boş diziye normalize ederek summary modelini üretir. */
export function mapQuizSummary(dto: QuizSummaryResponseDto): QuizSummary {
  return {
    quizSessionId: dto.quizSessionId,
    quizType: dto.quizType,
    quizSourceType: dto.quizSourceType,
    quizContentMode: dto.quizContentMode,
    status: dto.status,
    startedAt: dto.startedAt,
    totalQuestionCount: dto.totalQuestionCount,
    answeredQuestionCount: dto.answeredQuestionCount,
    unansweredQuestionCount: dto.unansweredQuestionCount,
    correctAnswerCount: dto.correctAnswerCount,
    wrongAnswerCount: dto.wrongAnswerCount,
    accuracyRate: dto.accuracyRate,
    completionRate: dto.completionRate,
    averageQuestionResponseTimeInMilliseconds: dto.averageQuestionResponseTimeInMilliseconds,
    fastestQuestionResponseTimeInMilliseconds: dto.fastestQuestionResponseTimeInMilliseconds,
    slowestQuestionResponseTimeInMilliseconds: dto.slowestQuestionResponseTimeInMilliseconds,
    questions: (dto.questions ?? []).map(mapQuizSummaryQuestion),
  };
}

/** Ham summary question DTO'sunu null olmayan question metniyle dönüştürür. */
export function mapQuizSummaryQuestion(dto: QuizSummaryQuestionResponseDto): QuizSummaryQuestion {
  return {
    ...dto,
    questionText: dto.questionText ?? '',
  };
}

/** Recommendation save sonucunu canonical dictionary kimliklerini koruyarak dönüştürür. */
export function mapSavedQuizRecommendation(
  dto: SaveRecommendedItemToDictionaryResponseDto,
): SavedQuizRecommendation {
  return { ...dto };
}
