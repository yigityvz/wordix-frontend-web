/** Bu dosya, backend cevabının değerlendirmesini ve uygun sistem önerisi save aksiyonunu gösterir. */
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from '@shared/components/button/button';
import { QuizAnswerResult, SavedQuizRecommendation } from '../../models/quiz.models';

/** Doğruluk hesabı yapmadan answer ve recommendation mutation durumunu görselleştirir. */
@Component({
  selector: 'wx-answer-feedback',
  imports: [Button, RouterLink],
  templateUrl: './answer-feedback.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnswerFeedback {
  /** Backend answer endpointinden map edilen sonuçtur. */
  readonly result = input.required<QuizAnswerResult>();
  /** Mevcut sorunun son soru olup olmadığını belirtir. */
  readonly isLastQuestion = input(false);
  /** Recommendation save mutationı sürerken tekrar aksiyonları kapatır. */
  readonly isSavingRecommendation = input(false);
  /** Gerçek save endpointinin başarılı dictionary sonucudur. */
  readonly savedRecommendation = input<SavedQuizRecommendation | null>(null);
  /** Normalize recommendation save hatasını gösterir. */
  readonly recommendationSaveError = input<string | null>(null);
  /** Sonraki soru veya summary geçiş intentini parent sayfaya yayınlar. */
  readonly continueRequested = output<void>();
  /** Uygun recommendation UUID'si için save intentini parent sayfaya yayınlar. */
  readonly saveRecommendationRequested = output<void>();
  /** Kullanıcının ilerleme niyetini parent sayfaya iletir. */
  protected continueQuiz(): void {
    this.continueRequested.emit();
  }
  /** Kullanıcının gerçek dictionary save niyetini parent sayfaya iletir. */
  protected saveRecommendation(): void {
    this.saveRecommendationRequested.emit();
  }
}
