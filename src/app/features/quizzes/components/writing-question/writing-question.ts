/** Bu dosya, writing quiz cevabını backend sınırlarına uygun textarea ve submit intentiyle toplar. */
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { Button } from '@shared/components/button/button';

/** Yazılı cevabı değerlendirmeden gerçek endpoint akışına iletir. */
@Component({
  selector: 'wx-writing-question',
  imports: [Button],
  templateUrl: './writing-question.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WritingQuestion {
  /** Request sürerken veya feedback gösterilirken etkileşimi kapatır. */
  readonly disabled = input(false);
  /** Answer endpointi sürerken loading state'ini açar. */
  readonly loading = input(false);
  /** Boş olmayan kullanıcı metnini parent sayfaya iletir. */
  readonly answerRequested = output<string>();
  /** Backendin 1000 karakter sınırındaki local cevaptır. */
  protected readonly answer = signal('');
  /** Textarea değerini en fazla 1000 karakter saklar. */
  protected updateAnswer(value: string): void {
    this.answer.set(value.slice(0, 1000));
  }
  /** Trim sonrası boş olmayan cevabı yayınlar. */
  protected submitAnswer(): void {
    const value = this.answer().trim();
    if (!this.disabled() && value) this.answerRequested.emit(value);
  }
}
