/** Bu dosya, aktif quizdeki gerçek soru konumunu ve cevaplanan soru sayısını erişilebilir biçimde gösterir. */
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Quiz ilerlemesini business aksiyonu üretmeden görselleştiren sunum componentidir. */
@Component({
  selector: 'wx-question-progress',
  templateUrl: './question-progress.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionProgress {
  /** Ekranda gösterilen sorunun bir tabanlı sırasıdır. */
  readonly current = input.required<number>();
  /** Backend sessionındaki toplam soru sayısıdır. */
  readonly total = input.required<number>();
  /** Backend tarafından gerçekten cevaplanmış unique soru sayısıdır. */
  readonly answered = input.required<number>();
  /** Progress bar genişliğini güvenli 0–100 aralığında türetir. */
  protected readonly percentage = computed(() =>
    this.total() <= 0 ? 0 : Math.min(100, Math.max(0, (this.answered() / this.total()) * 100)),
  );
}
