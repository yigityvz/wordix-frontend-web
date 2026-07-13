/** Bu dosya, deck detail içindeki tek dictionary itemını salt-okunur reusable kart olarak sunar. */
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { DeckItem } from '../../models/deck.models';

/** Backend deck item alanlarından başlık ve secondary text türeten presentational componenttir. */
@Component({
  selector: 'wx-deck-item-card',
  templateUrl: './deck-item-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeckItemCard {
  /** Parent detail listesinden gelen normalize deck item kaydıdır. */
  readonly item = input.required<DeckItem>();

  /** Nullable backend metinlerinden kullanıcıya gösterilecek güvenli başlığı türetir. */
  protected readonly title = computed(
    () => this.item().displayText ?? this.item().normalizedText ?? 'Dictionary item',
  );

  /** Word/phrase meaning veya sentence translation alanından secondary metni türetir. */
  protected readonly secondaryText = computed(
    () =>
      this.item().selectedMeaning?.translation ??
      this.item().sentenceTranslation?.translatedText ??
      'Open the dictionary item for details.',
  );
}
