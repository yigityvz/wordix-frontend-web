/** Bu dosya, aktif quiz sorularına ortak başlık, metadata ve içerik yüzeyi sağlar. */
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Card } from '@shared/components/card/card';

/** Farklı soru rendererlarını aynı erişilebilir görsel kabuk içinde barındırır. */
@Component({ selector: 'wx-question-shell', imports: [Card], templateUrl: './question-shell.html', changeDetection: ChangeDetectionStrategy.OnPush })
export class QuestionShell {
  /** Backend tarafından üretilen soru metnidir. */
  readonly questionText = input.required<string>();
  /** Backend question type değeridir. */
  readonly questionType = input<string | null>(null);
  /** Sistem önerisi metadata'sını gösterir. */
  readonly isSystemRecommended = input(false);
}
