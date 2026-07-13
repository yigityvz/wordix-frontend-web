/** Bu dosya, quiz page ve componentlerine NgRx ayrıntısı göstermeden state ve intent sunar. */
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { StartQuizRequest, SubmitQuizAnswerRequest } from '../models/quiz-request.models';
import { QuizActions } from '../store/quiz.actions';
import {
  selectAnswerError,
  selectAnswers,
  selectAnsweredQuestionCount,
  selectAnswerStatus,
  selectCurrentQuestion,
  selectIsSavingRecommendation,
  selectIsStarting,
  selectIsSubmittingAnswer,
  selectIsSummaryLoading,
  selectLatestAnswer,
  selectQuestions,
  selectRecommendationSaveError,
  selectRecommendationSaveStatus,
  selectSavedRecommendation,
  selectSession,
  selectSessionError,
  selectSessionStatus,
  selectSummary,
  selectSummaryError,
  selectSummaryStatus,
} from '../store/quiz.selectors';

/** Quiz feature componentlerinin kullanacağı tek state ve action köprüsüdür. */
@Injectable()
export class QuizFacade {
  /** Quiz feature state action ve selector erişimini sağlar. */
  private readonly store = inject(Store);

  /** Session start lifecycle durumunu signal olarak sunar. */
  readonly sessionStatus = this.store.selectSignal(selectSessionStatus);

  /** Backend tarafından oluşturulan normalize sessionı sunar. */
  readonly session = this.store.selectSignal(selectSession);

  /** Session start loading durumunu tekrar submit kontrolüne sunar. */
  readonly isStarting = this.store.selectSignal(selectIsStarting);

  /** Normalize session start hata mesajını sunar. */
  readonly sessionError = this.store.selectSignal(selectSessionError);

  /** Session içindeki normalize question listesini sunar. */
  readonly questions = this.store.selectSignal(selectQuestions);

  /** Backend cevabı bulunmayan ilk soruyu active quiz ekranına sunar. */
  readonly currentQuestion = this.store.selectSignal(selectCurrentQuestion);

  /** Canonical question UUID ile indekslenen backend answer sonuçlarını sunar. */
  readonly answers = this.store.selectSignal(selectAnswers);

  /** Backend tarafından cevaplanan unique question sayısını sunar. */
  readonly answeredQuestionCount = this.store.selectSignal(selectAnsweredQuestionCount);

  /** Answer mutation lifecycle durumunu signal olarak sunar. */
  readonly answerStatus = this.store.selectSignal(selectAnswerStatus);

  /** Answer tekrar submit kontrolü için loading durumunu sunar. */
  readonly isSubmittingAnswer = this.store.selectSignal(selectIsSubmittingAnswer);

  /** Son backend answer değerlendirmesini feedback UI'a sunar. */
  readonly latestAnswer = this.store.selectSignal(selectLatestAnswer);

  /** Normalize answer mutation hatasını sunar. */
  readonly answerError = this.store.selectSignal(selectAnswerError);

  /** Summary lifecycle durumunu signal olarak sunar. */
  readonly summaryStatus = this.store.selectSignal(selectSummaryStatus);

  /** Backend tarafından hesaplanan normalize quiz özetini sunar. */
  readonly summary = this.store.selectSignal(selectSummary);

  /** Summary loading durumunu sayfa iskeletine sunar. */
  readonly isSummaryLoading = this.store.selectSignal(selectIsSummaryLoading);

  /** Normalize summary request hatasını sunar. */
  readonly summaryError = this.store.selectSignal(selectSummaryError);

  /** Recommendation save lifecycle durumunu signal olarak sunar. */
  readonly recommendationSaveStatus = this.store.selectSignal(selectRecommendationSaveStatus);

  /** Recommendation save loading durumunu tekrar submit kontrolüne sunar. */
  readonly isSavingRecommendation = this.store.selectSignal(selectIsSavingRecommendation);

  /** Son gerçek recommendation dictionary sonucunu sunar. */
  readonly savedRecommendation = this.store.selectSignal(selectSavedRecommendation);

  /** Normalize recommendation save hatasını sunar. */
  readonly recommendationSaveError = this.store.selectSignal(selectRecommendationSaveError);

  /** Start form requestini gerçek quiz start effectine gönderir. */
  startQuiz(request: StartQuizRequest): void {
    this.store.dispatch(QuizActions.startQuiz({ request }));
  }

  /** Session kimliği ve kullanıcı cevabını backend answer effectine gönderir. */
  submitAnswer(quizSessionId: string, request: SubmitQuizAnswerRequest): void {
    this.store.dispatch(QuizActions.submitAnswer({ quizSessionId, request }));
  }

  /** Canonical session UUID ile gerçek summary yüklemesini başlatır. */
  loadSummary(quizSessionId: string): void {
    this.store.dispatch(QuizActions.loadSummary({ quizSessionId }));
  }

  /** Canonical recommendation UUID ile gerçek dictionary save mutationını başlatır. */
  saveRecommendation(quizRecommendationItemId: string): void {
    this.store.dispatch(QuizActions.saveRecommendation({ quizRecommendationItemId }));
  }

  /** Yeni question feedbacki öncesinde son answer lifecycle sonucunu temizler. */
  clearAnswerState(): void {
    this.store.dispatch(QuizActions.clearAnswerState());
  }

  /** Summary route kapanırken eski summary state'ini temizler. */
  clearSummary(): void {
    this.store.dispatch(QuizActions.clearSummary());
  }

  /** Yeni recommendation save öncesinde eski mutation sonucunu temizler. */
  clearRecommendationSaveState(): void {
    this.store.dispatch(QuizActions.clearRecommendationSaveState());
  }

  /** Logout veya feature teardown için tüm quiz state'ini temizler. */
  clear(): void {
    this.store.dispatch(QuizActions.clear());
  }
}
