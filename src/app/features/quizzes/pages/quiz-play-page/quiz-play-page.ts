/** Bu dosya, oluşturulmuş quiz sessionındaki soruları ve recommendation save akışını gerçek endpointlere bağlar. */
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Card } from '@shared/components/card/card';
import { ErrorState } from '@shared/components/error-state/error-state';
import { AnswerFeedback } from '../../components/answer-feedback/answer-feedback';
import { MultipleChoiceQuestion } from '../../components/multiple-choice-question/multiple-choice-question';
import { QuestionProgress } from '../../components/question-progress/question-progress';
import { QuestionShell } from '../../components/question-shell/question-shell';
import { WritingQuestion } from '../../components/writing-question/writing-question';
import { QuizFacade } from '../../facades/quiz.facade';

/** Normal exit sunmadan answer, feedback ve uygun recommendation save akışını yönetir. */
@Component({ selector: 'wx-quiz-play-page', imports: [AnswerFeedback, Card, ErrorState, MultipleChoiceQuestion, QuestionProgress, QuestionShell, RouterLink, WritingQuestion], templateUrl: './quiz-play-page.html', changeDetection: ChangeDetectionStrategy.OnPush })
export class QuizPlayPage {
  /** Route'taki session UUID'sini okur. */
  private readonly route = inject(ActivatedRoute);
  /** Quiz answer ve recommendation state'ini facade üzerinden yönetir. */
  private readonly quizFacade = inject(QuizFacade);
  /** Son gerçek cevaptan summary route'una geçişi yönetir. */
  private readonly router = inject(Router);
  /** Direct navigation ile stale session karışmasını engeller. */
  protected readonly routeSessionId = this.route.snapshot.paramMap.get('quizSessionId') ?? '';
  /** Gösterilen sorunun sıfır tabanlı local sırasıdır. */
  protected readonly currentIndex = signal(0);
  /** Soru cevaplama süresinin başlangıcıdır. */
  private questionStartedAt = Date.now();
  /** Route UUID'siyle birebir eşleşen sessionı seçer. */
  protected readonly session = computed(() => { const value = this.quizFacade.session(); return value?.quizSessionId === this.routeSessionId ? value : null; });
  /** Local indexteki backend sorusunu seçer. */
  protected readonly currentQuestion = computed(() => this.session()?.questions[this.currentIndex()] ?? null);
  /** Mevcut soruya ait backend feedbackini seçer. */
  protected readonly feedback = computed(() => { const question = this.currentQuestion(); const result = this.quizFacade.latestAnswer(); return question && result?.quizQuestionId === question.quizQuestionId ? result : null; });
  /** Mevcut feedback recommendationına ait başarılı save sonucunu seçer. */
  protected readonly savedRecommendation = computed(() => { const feedback = this.feedback(); const saved = this.quizFacade.savedRecommendation(); return feedback?.quizRecommendationItemId && saved?.quizRecommendationItemId === feedback.quizRecommendationItemId ? saved : null; });
  /** Option varlığını multiple-choice contractı sayar. */
  protected readonly isMultipleChoice = computed(() => (this.currentQuestion()?.options.length ?? 0) > 0);
  /** Mevcut sorunun son soru olup olmadığını belirler. */
  protected readonly isLastQuestion = computed(() => !!this.session() && this.currentIndex() === this.session()!.questions.length - 1);
  /** Answer loading durumunu tekrar submit kontrolüne sunar. */
  protected readonly isSubmitting = this.quizFacade.isSubmittingAnswer;
  /** Normalize answer hatasını gösterir. */
  protected readonly answerError = this.quizFacade.answerError;
  /** Gerçek cevaplanan soru sayısını sunar. */
  protected readonly answeredQuestionCount = this.quizFacade.answeredQuestionCount;
  /** Recommendation mutation loading durumunu UI'a sunar. */
  protected readonly isSavingRecommendation = this.quizFacade.isSavingRecommendation;
  /** Normalize recommendation mutation hatasını UI'a sunar. */
  protected readonly recommendationSaveError = this.quizFacade.recommendationSaveError;

  /** Seçilen option UUID'sini canonical test requestiyle gönderir. */
  protected submitMultipleChoice(selectedQuizOptionId: string): void {
    const question = this.currentQuestion();
    if (!question || this.feedback() || this.isSubmitting()) return;
    this.quizFacade.submitAnswer(this.routeSessionId, { quizQuestionId: question.quizQuestionId, selectedQuizOptionId, userAnswer: null, questionResponseTimeInMilliseconds: this.getResponseTime() });
  }
  /** Yazılı cevabı canonical writing requestiyle gönderir. */
  protected submitWriting(userAnswer: string): void {
    const question = this.currentQuestion();
    if (!question || this.feedback() || this.isSubmitting()) return;
    this.quizFacade.submitAnswer(this.routeSessionId, { quizQuestionId: question.quizQuestionId, selectedQuizOptionId: null, userAnswer, questionResponseTimeInMilliseconds: this.getResponseTime() });
  }
  /** Backend izin verdiğinde gerçek recommendation UUID'sini save effectine gönderir. */
  protected saveRecommendation(): void {
    const feedback = this.feedback();
    if (!feedback?.canAddRecommendedItemToDictionary || !feedback.quizRecommendationItemId || this.quizFacade.isSavingRecommendation() || this.savedRecommendation()) return;
    this.quizFacade.clearRecommendationSaveState();
    this.quizFacade.saveRecommendation(feedback.quizRecommendationItemId);
  }
  /** Feedback sonrası sıradaki soruya veya son soruda gerçek summary route'una ilerler. */
  protected continueToNextQuestion(): void {
    if (!this.session() || !this.feedback() || this.quizFacade.isSavingRecommendation()) return;
    this.quizFacade.clearRecommendationSaveState();
    if (this.isLastQuestion()) { void this.router.navigate(['/quizzes', this.routeSessionId, 'summary']); return; }
    this.quizFacade.clearAnswerState();
    this.currentIndex.update((index) => index + 1);
    this.questionStartedAt = Date.now();
  }
  /** Validator sınırlarında 1–600000 ms response time üretir. */
  private getResponseTime(): number { return Math.min(600000, Math.max(1, Date.now() - this.questionStartedAt)); }
}
