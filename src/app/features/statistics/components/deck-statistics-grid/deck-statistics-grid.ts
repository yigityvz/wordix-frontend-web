/** Bu dosya, backend deck statistics collectionını gerçek deck detail route bağlantılarıyla gösterir. */
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Badge } from '@shared/components/badge/badge';
import { EmptyState } from '@shared/components/empty-state/empty-state';
import { DeckStatistics } from '../../models/statistics.models';
/** Deck performance değerlerini frontend hesabı eklemeden responsive gridde sunar. */
@Component({
  selector: 'wx-deck-statistics-grid',
  imports: [Badge, EmptyState, RouterLink],
  templateUrl: './deck-statistics-grid.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeckStatisticsGrid {
  /** Gerçek deck statistics response modelidir. */
  readonly statistics = input.required<DeckStatistics>();

  /** Backend accuracy oranını güvenli yüzde metnine dönüştürür. */
  protected rate(value: number): string {
    return `${Math.max(0, Math.min(100, value)).toFixed(0)}%`;
  }
}
