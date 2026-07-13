/** Bu dosya, backend tarafından üretilen quiz optionlarını tek seçim ve submit intentiyle sunar. */
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { Button } from '@shared/components/button/button';
import { QuizOption } from '../../models/quiz.models';

/** Doğruluk hesabı yapmadan seçilen canonical option UUID'sini parent sayfaya iletir. */
@Component({ selector: 'wx-multiple-choice-question', imports: [Button], templateUrl: './multiple-choice-question.html', changeDetection: ChangeDetectionStrategy.OnPush })
export class MultipleChoiceQuestion {
  /** Backend sorusuna ait sıralı option listesidir. */
  readonly options = input.required<readonly QuizOption[]>();
  /** Request sürerken veya feedback gösterilirken seçimleri kapatır. */
  readonly disabled = input(false);
  /** Answer endpointi sürerken loading state'ini açar. */
  readonly loading = input(false);
  /** Seçilen gerçek option UUID'sini submit intenti olarak yayınlar. */
  readonly answerRequested = output<string>();
  /** Henüz gönderilmemiş local option seçimini tutar. */
  protected readonly selectedOptionId = signal<string | null>(null);
  /** Etkileşim açıksa option UUID'sini local state'e yazar. */
  protected selectOption(id: string): void { if (!this.disabled()) this.selectedOptionId.set(id); }
  /** Geçerli seçimi parent sayfanın gerçek mutationına iletir. */
  protected submitAnswer(): void { const id = this.selectedOptionId(); if (!this.disabled() && id) this.answerRequested.emit(id); }
}
