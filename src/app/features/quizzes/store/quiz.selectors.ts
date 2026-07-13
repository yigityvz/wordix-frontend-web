/** Bu dosya, quiz feature state'ini active play ve summary ekranları için türetilmiş selectorlara dönüştürür. */
import { createSelector } from '@ngrx/store';

import { QuizAnswerResult, QuizQuestion } from '../models/quiz.models';
import { quizFeature } from './quiz.reducer';

/** Boş state'te selectorların kararlı referans döndürmesini sağlayan sabit question listesidir. */
const EMPTY_QUESTIONS: readonly QuizQuestion[] = [];

/** Boş state'te selectorların kararlı referans döndürmesini sağlayan sabit answer sözlüğüdür. */
const EMPTY_ANSWERS: Readonly<Record<string, QuizAnswerResult>> = {};

/** NgRx feature tarafından üretilen temel quiz selectorlarıdır. */
export const {
  selectQuizzesState,
  selectSessionStatus,
  selectSession,
  selectSessionError,
  selectAnswerStatus,
  selectAnswersByQuestionId,
  selectLatestAnswer,
  selectAnswerError,
  selectSummaryStatus,
  selectSummary,
  selectSummaryError,
  selectRecommendationSaveStatus,
  selectSavedRecommendation,
  selectRecommendationSaveError,
} = quizFeature;

/** Session içindeki normalize question listesini seçer. */
export const selectQuestions = createSelector(
  selectSession,
  (session) => session?.questions ?? EMPTY_QUESTIONS,
);

/** Nullable olmayan answer sözlüğünü active quiz akışına sunar. */
export const selectAnswers = createSelector(
  selectAnswersByQuestionId,
  (answers) => answers ?? EMPTY_ANSWERS,
);

/** Backend cevabı henüz bulunmayan ilk soruyu mevcut active question olarak seçer. */
export const selectCurrentQuestion = createSelector(
  selectQuestions,
  selectAnswers,
  (questions, answers) => questions.find((question) => !answers[question.quizQuestionId]) ?? null,
);

/** Backend tarafından cevaplanmış unique question sayısını seçer. */
export const selectAnsweredQuestionCount = createSelector(
  selectAnswers,
  (answers) => Object.keys(answers).length,
);

/** Session start requestinin sürüp sürmediğini seçer. */
export const selectIsStarting = createSelector(
  selectSessionStatus,
  (status) => status === 'loading',
);

/** Answer mutationının sürüp sürmediğini seçer. */
export const selectIsSubmittingAnswer = createSelector(
  selectAnswerStatus,
  (status) => status === 'loading',
);

/** Summary requestinin sürüp sürmediğini seçer. */
export const selectIsSummaryLoading = createSelector(
  selectSummaryStatus,
  (status) => status === 'loading',
);

/** Recommendation save mutationının sürüp sürmediğini seçer. */
export const selectIsSavingRecommendation = createSelector(
  selectRecommendationSaveStatus,
  (status) => status === 'loading',
);
