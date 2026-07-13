/** Bu dosya, gerçek dictionary item verisini flags ve progress bilgileriyle salt-okunur kartta sunar. */
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Badge, BadgeVariant } from '@shared/components/badge/badge';
import { Card } from '@shared/components/card/card';

import { DictionaryItem } from '../../models/dictionary.models';
import { DictionaryProgressBadge } from '../progress-badge/progress-badge';

/** Mutation veya demo davranışı üretmeden dictionary collection itemını gösteren presentational karttır. */
@Component({
  selector: 'wx-dictionary-card',
  imports: [Badge, Card, DatePipe, DictionaryProgressBadge],
  templateUrl: './dictionary-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DictionaryCard {
  /** Mapper tarafından normalize edilmiş gerçek dictionary itemını alır. */
  readonly item = input.required<DictionaryItem>();

  /** Nullable backend display alanları için güvenli kart başlığını türetir. */
  protected readonly title = computed(
    () => this.item().displayText ?? this.item().normalizedText ?? 'Untitled item',
  );

  /** Word, phrase veya sentence türünü kullanıcı dostu metne dönüştürür. */
  protected readonly typeLabel = computed(() => formatLabel(this.item().itemType, 'Item'));

  /** Learning status değerini kullanıcı dostu metne dönüştürür. */
  protected readonly statusLabel = computed(() => formatLabel(this.item().learningStatus, 'Saved'));

  /** Learning status için yalnızca semantic badge varyantı üretir. */
  protected readonly statusVariant = computed<BadgeVariant>(() => {
    const status = this.item().learningStatus?.toLocaleLowerCase('en-US');

    if (status === 'mastered' || status === 'learned') {
      return 'success';
    }

    if (status === 'learning' || status === 'inprogress') {
      return 'info';
    }

    return 'neutral';
  });

  /** Seçili meaning veya sentence translation içinden kartın ana açıklamasını türetir. */
  protected readonly meaningText = computed(() => {
    const item = this.item();

    return (
      item.selectedMeaning?.translation ??
      item.selectedMeaning?.definition ??
      item.sentenceTranslation?.translatedText ??
      'No selected meaning'
    );
  });

  /** Seçili meaning varsa part of speech bilgisini kısa etiket olarak sunar. */
  protected readonly partOfSpeech = computed(() => this.item().selectedMeaning?.partOfSpeech);
}

/** Backend enum biçimini boşluklu ve baş harfi büyük bir UI etiketine dönüştürür. */
function formatLabel(value: string | null, fallback: string): string {
  if (!value?.trim()) {
    return fallback;
  }

  const spaced = value.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ');
  return spaced.charAt(0).toLocaleUpperCase('en-US') + spaced.slice(1).toLocaleLowerCase('en-US');
}
