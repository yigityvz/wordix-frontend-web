/** Bu dosya, backend learning summary aggregate değerlerini reusable kart gridinde gösterir. */
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Card } from '@shared/components/card/card';
import { UserLearningSummary } from '../../models/statistics.models';
/** Learning summary değerlerini frontendde yeniden hesaplamadan sunar. */
@Component({
  selector: 'wx-learning-summary-cards',
  imports: [Card],
  templateUrl: './learning-summary-cards.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearningSummaryCards {
  /** Gerçek learning-summary response modelidir. */
  readonly summary = input.required<UserLearningSummary>();

  /** Backend oranını yüzde metnine dönüştürür. */
  protected rate(value: number): string {
    return `${Math.max(0, Math.min(100, value)).toFixed(0)}%`;
  }
}
