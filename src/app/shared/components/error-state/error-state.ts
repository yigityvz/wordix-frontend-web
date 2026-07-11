/**
 * Recoverable API veya sayfa hatalarını tutarlı ve erişilebilir biçimde gösterir.
 * Retry davranışını taklit etmez; parent gerçek retry akışı sağlarsa event yayınlar.
 */
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button } from '../button/button';

@Component({
  selector: 'wx-error-state',
  imports: [Button],
  templateUrl: './error-state.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorState {
  /** Hatanın kullanıcıya güvenli ve kısa başlığıdır. */
  readonly title = input('Something went wrong');

  /** Teknik detay sızdırmadan kullanıcının durumu anlamasını sağlar. */
  readonly description = input<string>();

  /** Parent gerçek retry sağladığında butonda görünecek etikettir. */
  readonly retryLabel = input<string>();

  /** Retry niyetini HTTP detayını bilmeden owning feature'a iletir. */
  readonly retry = output<void>();

  /** Kullanıcı retry istediğinde parent akışını tetikleyen event yayınlar. */
  protected requestRetry(): void {
    // API çağrısı shared componentte değil feature facade/effect katmanında yapılır.
    this.retry.emit();
  }
}
