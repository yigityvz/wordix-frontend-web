/** Bu dosya, backend confidence bucket dağılımını bağımlılıksız erişilebilir bar chart olarak gösterir. */
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Card } from '@shared/components/card/card';
import { ConfidenceScoreDistribution } from '../../models/statistics.models';
/** Confidence bucketlarını semantic tokenlarla oransal barlara dönüştürür. */
@Component({
  selector: 'wx-confidence-distribution-chart',
  imports: [Card],
  templateUrl: './confidence-distribution-chart.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfidenceDistributionChart {
  /** Gerçek confidence distribution response modelidir. */
  readonly distribution = input.required<ConfidenceScoreDistribution>();

  /** Backend yüzdesini güvenli CSS genişliğine sınırlar. */
  protected width(value: number): number {
    return Math.max(0, Math.min(100, value));
  }
}
