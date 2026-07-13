/** Bu dosya, deck collection, detail, create ve item mutation state geçişlerini doğrular. */
import { describe, expect, it } from 'vitest';

import { DeckDetail } from '../models/deck.models';
import { DeckActions } from './deck.actions';
import { deckReducer } from './deck.reducer';
import { initialDeckState } from './deck.state';

/** Deck reducerın bağımsız lifecycle alanlarını immutable güncellediğini sınar. */
describe('deckReducer', () => {
  /** Collection loading actionının eski hatayı temizlediğini doğrular. */
  it('starts loading the deck collection', () => {
    const result = deckReducer(
      { ...initialDeckState, collectionError: 'Old error' },
      DeckActions.loadCollection(),
    );

    expect(result.collectionStatus).toBe('loading');
    expect(result.collectionError).toBeNull();
  });

  /** Create success sonucunun gerçek deck kaydını mevcut collection'a sıfır itemla eklediğini doğrular. */
  it('adds a created deck to the loaded collection', () => {
    const deck = {
      deckId: '11111111-1111-1111-1111-111111111111',
      name: 'Core Words',
      normalizedName: 'core words',
      description: null,
      createdAt: '2026-07-13T10:00:00Z',
      isActive: true,
    };
    const stateWithCollection = {
      ...initialDeckState,
      collection: { totalCount: 0, decks: [] },
    };
    const result = deckReducer(stateWithCollection, DeckActions.createDeckSuccess({ deck }));

    expect(result.createStatus).toBe('loaded');
    expect(result.collection).toEqual({
      totalCount: 1,
      decks: [{ ...deck, itemCount: 0, updatedAt: null }],
    });
  });

  /** Item add success sonucunun summary sayacını artırıp eksik response ile detail item uydurmadığını doğrular. */
  it('increments the matching deck count after an item add', () => {
    const detail = createDeckDetail();
    const stateWithDeck = {
      ...initialDeckState,
      collection: { totalCount: 1, decks: [toSummary(detail)] },
      selectedDeck: detail,
    };
    const result = deckReducer(
      stateWithDeck,
      DeckActions.addItemSuccess({
        result: {
          deckItemId: '77777777-7777-7777-7777-777777777777',
          deckId: detail.deckId,
          userLearningItemId: '88888888-8888-8888-8888-888888888888',
          addedAt: '2026-07-13T11:00:00Z',
        },
      }),
    );

    expect(result.collection?.decks[0]?.itemCount).toBe(2);
    expect(result.selectedDeck).toBe(detail);
  });

  /** Gerçek remove success sonucunun detail itemını ve iki itemCount değerini azalttığını doğrular. */
  it('removes an item from the selected deck after backend success', () => {
    const detail = createDeckDetail();
    const stateWithDeck = {
      ...initialDeckState,
      collection: { totalCount: 1, decks: [toSummary(detail)] },
      selectedDeck: detail,
    };
    const result = deckReducer(
      stateWithDeck,
      DeckActions.removeItemSuccess({
        result: {
          deckId: detail.deckId,
          userLearningItemId: detail.items[0]!.userLearningItemId,
          removedDeckItemId: detail.items[0]!.deckItemId,
          removed: true,
        },
      }),
    );

    expect(result.collection?.decks[0]?.itemCount).toBe(0);
    expect(result.selectedDeck?.itemCount).toBe(0);
    expect(result.selectedDeck?.items).toEqual([]);
  });

  /** Clear actionının feature stateinin tamamını başlangıca döndürdüğünü doğrular. */
  it('clears the complete deck state', () => {
    const populatedState = {
      ...initialDeckState,
      collectionStatus: 'loaded' as const,
      collection: { totalCount: 1, decks: [toSummary(createDeckDetail())] },
    };

    expect(deckReducer(populatedState, DeckActions.clear())).toEqual(initialDeckState);
  });
});

/** Reducer item mutation testleri için tek itemlı normalize deck detail fixture'ı üretir. */
function createDeckDetail(): DeckDetail {
  return {
    deckId: '11111111-1111-1111-1111-111111111111',
    name: 'Core Words',
    normalizedName: 'core words',
    description: null,
    itemCount: 1,
    items: [
      {
        deckItemId: '22222222-2222-2222-2222-222222222222',
        userLearningItemId: '33333333-3333-3333-3333-333333333333',
        learningItemId: '44444444-4444-4444-4444-444444444444',
        wordId: '55555555-5555-5555-5555-555555555555',
        phraseId: null,
        sentenceId: null,
        itemType: 'Word',
        displayText: 'ocean',
        normalizedText: 'ocean',
        sourceLanguageCode: 'en',
        selectedMeaning: null,
        sentenceTranslation: null,
        addedAt: '2026-07-13T10:00:00Z',
      },
    ],
    createdAt: '2026-07-13T09:00:00Z',
    updatedAt: null,
    isActive: true,
  };
}

/** Deck detail fixture'ı items alanı olmadan collection summary modeline dönüştürür. */
function toSummary(detail: DeckDetail) {
  const { items: _items, ...summary } = detail;
  return summary;
}
