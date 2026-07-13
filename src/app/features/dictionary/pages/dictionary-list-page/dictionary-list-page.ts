/** Bu dosya, dictionary koleksiyon state'ini local liste kontrolleri ve responsive UI bileşenleriyle birleştirir. */
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card } from '@shared/components/card/card';
import { EmptyState } from '@shared/components/empty-state/empty-state';
import { ErrorState } from '@shared/components/error-state/error-state';
import { Spinner } from '@shared/components/spinner/spinner';

import { DictionaryCard } from '../../components/dictionary-card/dictionary-card';
import {
  DictionaryFilter,
  DictionaryFilters,
  DictionarySort,
} from '../../components/dictionary-filters/dictionary-filters';
import { DictionaryFacade } from '../../facades/dictionary.facade';
import { DictionaryItem } from '../../models/dictionary.models';

/** Route açıldığında gerçek koleksiyonu yükleyen ve local görünüm state'ini yöneten dictionary liste sayfasıdır. */
@Component({
  selector: 'wx-dictionary-list-page',
  imports: [Card, DictionaryCard, DictionaryFilters, EmptyState, ErrorState, RouterLink, Spinner],
  templateUrl: './dictionary-list-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DictionaryListPage implements OnInit {
  /** Dictionary NgRx state ve intent erişimini tek facade üzerinden sağlar. */
  private readonly dictionaryFacade = inject(DictionaryFacade);

  /** Gerçek backend collection itemlarını template'e sunar. */
  protected readonly items = this.dictionaryFacade.items;

  /** Backend total count değerini sayfa özetine sunar. */
  protected readonly totalCount = this.dictionaryFacade.totalCount;

  /** Collection lifecycle loading durumunu sayfa iskeletine bağlar. */
  protected readonly isLoading = this.dictionaryFacade.isCollectionLoading;

  /** Normalize API hata mesajını recoverable error state'e bağlar. */
  protected readonly error = this.dictionaryFacade.collectionError;

  /** Kullanıcı aramasını yalnızca yüklenmiş liste üzerinde tutan local state'tir. */
  protected readonly query = signal('');

  /** Kullanıcının seçtiği local item filtresidir. */
  protected readonly filter = signal<DictionaryFilter>('all');

  /** Kullanıcının seçtiği local sıralama biçimidir. */
  protected readonly sort = signal<DictionarySort>('recent');

  /** Backend itemlarını güncel local kontrollere göre saf biçimde türetir. */
  protected readonly visibleItems = computed(() =>
    filterAndSortDictionaryItems(this.items(), this.query(), this.filter(), this.sort()),
  );

  /** Route ilk açıldığında authenticated kullanıcının gerçek dictionary koleksiyonunu ister. */
  ngOnInit(): void {
    this.dictionaryFacade.loadCollection();
  }

  /** Hata yüzeyindeki retry aksiyonunu aynı gerçek GET isteğine bağlar. */
  protected retryCollection(): void {
    this.dictionaryFacade.loadCollection();
  }

  /** Search inputundan gelen controlled değeri local query state'e yazar. */
  protected updateQuery(value: string): void {
    this.query.set(value);
  }

  /** Filter chip seçiminden gelen değeri local filter state'e yazar. */
  protected updateFilter(value: DictionaryFilter): void {
    this.filter.set(value);
  }

  /** Sort select seçiminden gelen değeri local sort state'e yazar. */
  protected updateSort(value: DictionarySort): void {
    this.sort.set(value);
  }

  /** Sonuçsuz local görünümü tüm filtreleri temizleyerek yeniden açar. */
  protected resetControls(): void {
    this.query.set('');
    this.filter.set('all');
    this.sort.set('recent');
  }
}

/** Dictionary itemlarını arama, filtre ve sıralama değerlerine göre mutation yapmadan dönüştürür. */
export function filterAndSortDictionaryItems(
  items: readonly DictionaryItem[],
  query: string,
  filter: DictionaryFilter,
  sort: DictionarySort,
): readonly DictionaryItem[] {
  const normalizedQuery = query.trim().toLocaleLowerCase('en-US');
  const filtered = items.filter(
    (item) =>
      matchesDictionaryQuery(item, normalizedQuery) && matchesDictionaryFilter(item, filter),
  );

  return [...filtered].sort((left, right) => compareDictionaryItems(left, right, sort));
}

/** Itemın başlık, seçili anlam veya sentence translation alanında arama metnini arar. */
function matchesDictionaryQuery(item: DictionaryItem, query: string): boolean {
  if (!query) {
    return true;
  }

  const searchableValues = [
    item.displayText,
    item.normalizedText,
    item.selectedMeaning?.translation,
    item.selectedMeaning?.definition,
    item.sentenceTranslation?.translatedText,
  ];

  return searchableValues.some((value) => value?.toLocaleLowerCase('en-US').includes(query));
}

/** Itemın seçili local filtreyle eşleşip eşleşmediğini gerçek backend alanlarından belirler. */
function matchesDictionaryFilter(item: DictionaryItem, filter: DictionaryFilter): boolean {
  if (filter === 'all') {
    return true;
  }

  if (filter === 'difficult') {
    return item.isDifficult;
  }

  if (filter === 'favorite') {
    return item.isFavorite;
  }

  return item.itemType?.toLocaleLowerCase('en-US') === filter;
}

/** Seçili sıralama biçimi için iki dictionary itemının kararlı sırasını hesaplar. */
function compareDictionaryItems(
  left: DictionaryItem,
  right: DictionaryItem,
  sort: DictionarySort,
): number {
  if (sort === 'confidence') {
    return left.learningConfidenceScore - right.learningConfidenceScore;
  }

  if (sort === 'alphabetical') {
    return (left.displayText ?? left.normalizedText ?? '').localeCompare(
      right.displayText ?? right.normalizedText ?? '',
      'en',
    );
  }

  return Date.parse(right.savedAt) - Date.parse(left.savedAt);
}
