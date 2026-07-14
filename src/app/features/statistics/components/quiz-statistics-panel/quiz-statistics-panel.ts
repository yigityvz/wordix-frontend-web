/** Bu dosya, backend quiz statistics aggregate değerlerini performans panelinde gösterir. */
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Card } from '@shared/components/card/card';
import { QuizStatistics } from '../../models/statistics.models';
/** Quiz aggregate değerlerini frontend trend verisi uydurmadan sunar. */
@Component({
  selector: 'wx-quiz-statistics-panel',
  imports: [Card],
  templateUrl: './quiz-statistics-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizStatisticsPanel {
  /** Gerçek quiz statistics response modelidir. */
  readonly statistics = input.required<QuizStatistics>();

  /** Backend oranını güvenli yüzde metnine dönüştürür. */
  protected rate(value: number): string {
    return `${Math.max(0, Math.min(100, value)).toFixed(0)}%`;
  }
  /** Ortalama milisaniyeyi okunabilir süreye dönüştürür. */
  protected duration(value: number): string {
    return value < 1000 ? `${value.toFixed(0)} ms` : `${(value / 1000).toFixed(1)} s`;
  }
  /** Nullable ISO tarihi kısa gün metnine dönüştürür. */
  protected date(value: string | null): string {
    return value ? value.slice(0, 10) : 'Default range';
  }
}
