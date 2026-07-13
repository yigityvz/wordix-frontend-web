/** Bu dosya, dictionary listesinin local arama, filtre ve sıralama kontrollerini erişilebilir biçimde sunar. */
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Input } from '@shared/components/input/input';

import { DictionaryItem } from '../../models/dictionary.models';

/** Backend item alanlarından güvenle türetilebilen local filtre seçenekleridir. */
export type DictionaryFilter = 'all' | 'word' | 'phrase' | 'sentence' | 'difficult' | 'favorite';

/** Liste endpointinin mevcut payloadı üzerinde uygulanabilen sıralama seçenekleridir. */
export type DictionarySort = 'recent' | 'confidence' | 'alphabetical';

/** Filter chip metni, değeri ve gerçek koleksiyondan türetilen sayısını bir arada taşır. */
interface DictionaryFilterOption {
  readonly value: DictionaryFilter;
  readonly label: string;
  readonly count: number;
}

/** Filtre state'ini sahiplenmeden controlled input/output sözleşmesi sunan presentational componenttir. */
@Component({
  selector: 'wx-dictionary-filters',
  imports: [Input],
  templateUrl: './dictionary-filters.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DictionaryFilters {
  /** Sayaçların türetileceği gerçek dictionary item listesini alır. */
  readonly items = input.required<readonly DictionaryItem[]>();

  /** Parent sayfanın güncel arama metnini controlled değer olarak alır. */
  readonly query = input('');

  /** Parent sayfanın seçili filtre değerini alır. */
  readonly filter = input<DictionaryFilter>('all');

  /** Parent sayfanın seçili sıralama değerini alır. */
  readonly sort = input<DictionarySort>('recent');

  /** Kullanıcı arama metnini değiştirdiğinde parent state'e yeni değeri iletir. */
  readonly queryChange = output<string>();

  /** Kullanıcı chip seçtiğinde parent state'e yeni filtreyi iletir. */
  readonly filterChange = output<DictionaryFilter>();

  /** Kullanıcı select değerini değiştirdiğinde parent state'e yeni sıralamayı iletir. */
  readonly sortChange = output<DictionarySort>();

  /** Her chip sayısını mevcut backend koleksiyonundan türetir. */
  protected readonly filterOptions = computed<readonly DictionaryFilterOption[]>(() => {
    const items = this.items();

    return [
      { value: 'all', label: 'All', count: items.length },
      { value: 'word', label: 'Words', count: countByType(items, 'word') },
      { value: 'phrase', label: 'Phrases', count: countByType(items, 'phrase') },
      { value: 'sentence', label: 'Sentences', count: countByType(items, 'sentence') },
      {
        value: 'difficult',
        label: 'Difficult',
        count: items.filter((item) => item.isDifficult).length,
      },
      {
        value: 'favorite',
        label: 'Favorites',
        count: items.filter((item) => item.isFavorite).length,
      },
    ];
  });

  /** Shared inputtan gelen arama metnini parent sayfaya aktarır. */
  protected updateQuery(value: string): void {
    this.queryChange.emit(value);
  }

  /** Tıklanan chip'in canonical filtre değerini parent sayfaya aktarır. */
  protected selectFilter(value: DictionaryFilter): void {
    this.filterChange.emit(value);
  }

  /** Native select eventini typesafe sıralama outputuna dönüştürür. */
  protected updateSort(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.sortChange.emit(target.value as DictionarySort);
  }
}

/** Item type değerini backend casing farklarından bağımsız sayar. */
function countByType(items: readonly DictionaryItem[], type: string): number {
  return items.filter((item) => item.itemType?.toLocaleLowerCase('en-US') === type).length;
}
