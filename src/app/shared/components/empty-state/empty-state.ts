/**
 * Veri bulunmayan liste ve sayfalarda tutarlı açıklama ve opsiyonel gerçek aksiyon sunar.
 * Coming Soon veya fake davranış üretmez; aksiyonu yalnızca parent verdiğinde yayınlar.
 */
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button } from '../button/button';

@Component({
  selector: 'wx-empty-state',
  imports: [Button],
  templateUrl: './empty-state.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyState {
  /** Empty durumun nedenini kısa ve anlaşılır biçimde ifade eder. */
  readonly title = input.required<string>();

  /** Kullanıcıya durumu ve geçerli sonraki adımı açıklayan detay metnidir. */
  readonly description = input<string>();

  /** Parent gerçek bir aksiyon sağladığında butonda gösterilecek etikettir. */
  readonly actionLabel = input<string>();

  /** Empty durumdan çıkmak için parent tarafından yönetilecek kullanıcı niyetidir. */
  readonly action = output<void>();

  /** Buton tıklamasını business davranışı bilmeden parent componente iletir. */
  protected requestAction(): void {
    // Navigation veya mutation kararı owning feature tarafından verilir.
    this.action.emit();
  }
}
