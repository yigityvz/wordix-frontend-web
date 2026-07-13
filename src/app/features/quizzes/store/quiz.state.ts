/** Bu dosya, quiz session, answer, summary ve recommendation save feature state sözleşmesini tanımlar. */
import {
  QuizAnswerResult,
  QuizSession,
  QuizSummary,
  SavedQuizRecommendation,
} from '../models/quiz.models';

/** Her quiz API operasyonunun ortak lifecycle durumlarını sınırlar. */
export type QuizOperationStatus = 'idle' | 'loading' | 'loaded' | 'error';

/** Quiz session ve birbirinden bağımsız mutation/read lifecyclelarını taşıyan feature state'idir. */
export interface QuizState {
  readonly sessionStatus: QuizOperationStatus;
  readonly session: QuizSession | null;
  readonly sessionError: string | null;
  readonly answerStatus: QuizOperationStatus;
  readonly answersByQuestionId: Readonly<Record<string, QuizAnswerResult>>;
  readonly latestAnswer: QuizAnswerResult | null;
  readonly answerError: string | null;
  readonly summaryStatus: QuizOperationStatus;
  readonly summary: QuizSummary | null;
  readonly summaryError: string | null;
  readonly recommendationSaveStatus: QuizOperationStatus;
  readonly savedRecommendation: SavedQuizRecommendation | null;
  readonly recommendationSaveError: string | null;
}

/** Quiz feature route'u açılmadan önce kullanılan boş ve güvenli başlangıç state'idir. */
export const initialQuizState: QuizState = {
  sessionStatus: 'idle',
  session: null,
  sessionError: null,
  answerStatus: 'idle',
  answersByQuestionId: {},
  latestAnswer: null,
  answerError: null,
  summaryStatus: 'idle',
  summary: null,
  summaryError: null,
  recommendationSaveStatus: 'idle',
  savedRecommendation: null,
  recommendationSaveError: null,
};
