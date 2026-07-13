/** Bu dosya, dictionary liste sayfasının gerçek facade niyetini ve local görünüm dönüşümlerini doğrular. */
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DictionaryFacade } from '../../facades/dictionary.facade';
import { DictionaryItem } from '../../models/dictionary.models';
import { DictionaryListPage, filterAndSortDictionaryItems } from './dictionary-list-page';

/** Page componentin HTTP yerine facade ile çalıştığını ve mock ürün davranışı üretmediğini sınar. */
describe('DictionaryListPage', () => {
  /** Her testte standalone dictionary sayfasını tutar. */
  let fixture: ComponentFixture<DictionaryListPage>;
  const loadCollection = vi.fn();
  const items = signal<readonly DictionaryItem[]>([createDictionaryItem()]);
  const totalCount = signal(1);
  const isCollectionLoading = signal(false);
  const collectionError = signal<string | null>(null);

  /** Her test için kontrollü facade signals ve boş router ile sayfayı oluşturur. */
  beforeEach(() => {
    loadCollection.mockClear();
    items.set([createDictionaryItem()]);
    totalCount.set(1);
    isCollectionLoading.set(false);
    collectionError.set(null);

    TestBed.configureTestingModule({
      imports: [DictionaryListPage],
      providers: [
        provideRouter([]),
        {
          provide: DictionaryFacade,
          useValue: {
            items,
            totalCount,
            isCollectionLoading,
            collectionError,
            loadCollection,
          },
        },
      ],
    });

    fixture = TestBed.createComponent(DictionaryListPage);
    fixture.detectChanges();
  });

  /** Route açılışında gerçek collection intentinin facade'a gönderildiğini doğrular. */
  it('loads the authenticated user dictionary on initialization', () => {
    expect(loadCollection).toHaveBeenCalledOnce();
  });

  /** Backend collection item alanlarının kartta görüntülendiğini doğrular. */
  it('renders normalized backend dictionary items', () => {
    const element = fixture.nativeElement as HTMLElement;
    const text = element.textContent ?? '';

    expect(text).toContain('ocean');
    expect(text).toContain('okyanus');
    expect(text).toContain('35%');
    expect(element.querySelector('a[href="/dictionary/ocean-user-item"]')).not.toBeNull();
  });

  /** Sonraki backend fazlarına ait ölü mutation aksiyonlarının render edilmediğini doğrular. */
  it('does not render unsupported mutation actions', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).not.toContain('Add to Deck');
    expect(text).not.toContain('Start Quiz');
    expect(text).not.toContain('Toggle favorite');
  });
});

/** Local liste dönüşümünün arama, filtre ve sıralamayı orijinal diziyi bozmadan uyguladığını sınar. */
describe('filterAndSortDictionaryItems', () => {
  /** Seçili meaning translation alanında arama yapılabildiğini doğrular. */
  it('searches selected meaning content', () => {
    const result = filterAndSortDictionaryItems(
      [createDictionaryItem(), createDictionaryItem({ displayText: 'calm', translation: 'sakin' })],
      'sakin',
      'all',
      'recent',
    );

    expect(result.map((item) => item.displayText)).toEqual(['calm']);
  });

  /** Favorite filtresinin gerçek flag alanını kullandığını doğrular. */
  it('filters by the backend favorite flag', () => {
    const result = filterAndSortDictionaryItems(
      [createDictionaryItem(), createDictionaryItem({ displayText: 'calm', isFavorite: false })],
      '',
      'favorite',
      'recent',
    );

    expect(result.map((item) => item.displayText)).toEqual(['ocean']);
  });

  /** Confidence sıralamasının düşük skoru önce getirdiğini doğrular. */
  it('sorts lowest confidence first without mutating the source', () => {
    const source = [
      createDictionaryItem({ displayText: 'ocean', confidence: 35 }),
      createDictionaryItem({ displayText: 'calm', confidence: 10 }),
    ];
    const result = filterAndSortDictionaryItems(source, '', 'all', 'confidence');

    expect(result.map((item) => item.displayText)).toEqual(['calm', 'ocean']);
    expect(source.map((item) => item.displayText)).toEqual(['ocean', 'calm']);
  });
});

/** Dictionary liste testleri için eksiksiz normalize item fixture'ı üretir. */
function createDictionaryItem(
  overrides: {
    readonly displayText?: string;
    readonly translation?: string;
    readonly confidence?: number;
    readonly isFavorite?: boolean;
  } = {},
): DictionaryItem {
  return {
    userLearningItemId: `${overrides.displayText ?? 'ocean'}-user-item`,
    learningItemId: `${overrides.displayText ?? 'ocean'}-learning-item`,
    wordId: 'word-id',
    phraseId: null,
    sentenceId: null,
    itemType: 'Word',
    displayText: overrides.displayText ?? 'ocean',
    normalizedText: overrides.displayText ?? 'ocean',
    sourceLanguageCode: 'en',
    selectedMeaningId: 'meaning-id',
    sentenceTranslation: null,
    selectedMeaning: {
      meaningId: 'meaning-id',
      translation: overrides.translation ?? 'okyanus',
      definition: 'A large body of salt water.',
      partOfSpeech: 'noun',
      isPrimary: true,
      displayOrder: 1,
    },
    savedAt: '2026-07-12T10:00:00Z',
    sourceLookupHistoryId: 'lookup-id',
    learningStatus: 'Learning',
    learningConfidenceScore: overrides.confidence ?? 35,
    isFavorite: overrides.isFavorite ?? true,
    isDifficult: false,
    wantsMorePractice: false,
    isIgnored: false,
    noteCount: 0,
    isActive: true,
  };
}
