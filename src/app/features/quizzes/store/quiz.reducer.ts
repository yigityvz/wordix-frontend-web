/** Bu dosya, quiz lifecycle actionlarını immutable feature state değişimlerine uygular. */
import { createFeature, createReducer, on } from '@ngrx/store';

import { QuizActions } from './quiz.actions';
import { initialQuizState } from './quiz.state';

/** Session, answer, summary ve recommendation actionlarının tek saf state güncelleme noktasıdır. */
export const quizReducer = createReducer(
  initialQuizState,
  on(QuizActions.startQuiz, (state) => ({
    ...state,
    sessionStatus: 'loading' as const,
    session: null,
    sessionError: null,
    answerStatus: 'idle' as const,
    answersByQuestionId: {},
    latestAnswer: null,
    answerError: null,
    summaryStatus: 'idle' as const,
    summary: null,
    summaryError: null,
    recommendationSaveStatus: 'idle' as const,
    savedRecommendation: null,
    recommendationSaveError: null,
  })),
  on(QuizActions.startQuizSuccess, (state, { session }) => ({
    ...state,
    sessionStatus: 'loaded' as const,
    session,
    sessionError: null,
  })),
  on(QuizActions.startQuizFailure, (state, { message }) => ({
    ...state,
    sessionStatus: 'error' as const,
    session: null,
    sessionError: message,
  })),
  on(QuizActions.submitAnswer, (state) => ({
    ...state,
    answerStatus: 'loading' as const,
    latestAnswer: null,
    answerError: null,
  })),
  on(QuizActions.submitAnswerSuccess, (state, { result }) => ({
    ...state,
    answerStatus: 'loaded' as const,
    answersByQuestionId: {
      ...state.answersByQuestionId,
      [result.quizQuestionId]: result,
    },
    latestAnswer: result,
    answerError: null,
  })),
  on(QuizActions.submitAnswerFailure, (state, { message }) => ({
    ...state,
    answerStatus: 'error' as const,
    latestAnswer: null,
    answerError: message,
  })),
  on(QuizActions.loadSummary, (state) => ({
    ...state,
    summaryStatus: 'loading' as const,
    summary: null,
    summaryError: null,
  })),
  on(QuizActions.loadSummarySuccess, (state, { summary }) => ({
    ...state,
    summaryStatus: 'loaded' as const,
    summary,
    summaryError: null,
  })),
  on(QuizActions.loadSummaryFailure, (state, { message }) => ({
    ...state,
    summaryStatus: 'error' as const,
    summary: null,
    summaryError: message,
  })),
  on(QuizActions.saveRecommendation, (state) => ({
    ...state,
    recommendationSaveStatus: 'loading' as const,
    savedRecommendation: null,
    recommendationSaveError: null,
  })),
  on(QuizActions.saveRecommendationSuccess, (state, { result }) => ({
    ...state,
    recommendationSaveStatus: 'loaded' as const,
    savedRecommendation: result,
    recommendationSaveError: null,
  })),
  on(QuizActions.saveRecommendationFailure, (state, { message }) => ({
    ...state,
    recommendationSaveStatus: 'error' as const,
    savedRecommendation: null,
    recommendationSaveError: message,
  })),
  on(QuizActions.clearAnswerState, (state) => ({
    ...state,
    answerStatus: 'idle' as const,
    latestAnswer: null,
    answerError: null,
  })),
  on(QuizActions.clearSummary, (state) => ({
    ...state,
    summaryStatus: 'idle' as const,
    summary: null,
    summaryError: null,
  })),
  on(QuizActions.clearRecommendationSaveState, (state) => ({
    ...state,
    recommendationSaveStatus: 'idle' as const,
    savedRecommendation: null,
    recommendationSaveError: null,
  })),
  on(QuizActions.clear, () => initialQuizState),
);

/** Lazy provider üzerinden `quizzes` adıyla kaydedilecek NgRx feature tanımıdır. */
export const quizFeature = createFeature({
  name: 'quizzes',
  reducer: quizReducer,
});
