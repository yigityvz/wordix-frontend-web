/**
 * API ve lazy-loading bekleme durumları için erişilebilir loading göstergesi sunar.
 * Featureların farklı spinner markup ve animasyonları üretmesini engeller.
 */
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'wx-spinner',
  templateUrl: './spinner.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Spinner {
  /** Screen reader kullanıcısına hangi işlemin beklendiğini açıklar. */
  readonly label = input('Loading');
}
