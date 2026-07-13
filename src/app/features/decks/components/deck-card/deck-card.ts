/** Bu dosya, tek deck summary kaydını reusable ve salt-okunur kart olarak sunar. */
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Card } from '@shared/components/card/card';

import { DeckSummary } from '../../models/deck.models';

/** Business aksiyonu üretmeden backend deck summary alanlarını render eden presentational componenttir. */
@Component({
  selector: 'wx-deck-card',
  imports: [Card, DatePipe],
  templateUrl: './deck-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeckCard {
  /** Parent listeden gelen normalize deck summary kaydıdır. */
  readonly deck = input.required<DeckSummary>();
}
