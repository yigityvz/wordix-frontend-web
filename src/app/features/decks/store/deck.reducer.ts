/** Bu dosya, deck lifecycle actionlarını immutable feature state değişimlerine uygular. */
import { createFeature, createReducer, on } from '@ngrx/store';

import { DeckSummary } from '../models/deck.models';
import { DeckActions } from './deck.actions';
import { initialDeckState } from './deck.state';

/** Collection, detail, create ve item mutation actionlarının tek saf state güncelleme noktasıdır. */
export const deckReducer = createReducer(
  initialDeckState,
  on(DeckActions.loadCollection, (state) => ({
    ...state,
    collectionStatus: 'loading' as const,
    collectionError: null,
  })),
  on(DeckActions.loadCollectionSuccess, (state, { collection }) => ({
    ...state,
    collectionStatus: 'loaded' as const,
    collection,
    collectionError: null,
  })),
  on(DeckActions.loadCollectionFailure, (state, { message }) => ({
    ...state,
    collectionStatus: 'error' as const,
    collectionError: message,
  })),
  on(DeckActions.loadDetail, (state) => ({
    ...state,
    detailStatus: 'loading' as const,
    selectedDeck: null,
    detailError: null,
  })),
  on(DeckActions.loadDetailSuccess, (state, { detail }) => ({
    ...state,
    detailStatus: 'loaded' as const,
    selectedDeck: detail,
    detailError: null,
  })),
  on(DeckActions.loadDetailFailure, (state, { message }) => ({
    ...state,
    detailStatus: 'error' as const,
    selectedDeck: null,
    detailError: message,
  })),
  on(DeckActions.createDeck, (state) => ({
    ...state,
    createStatus: 'loading' as const,
    createdDeck: null,
    createError: null,
  })),
  on(DeckActions.createDeckSuccess, (state, { deck }) => {
    // Create responseunda itemCount olmadğı için yeni collection summary sıfır itemla oluşturulur.
    const summary: DeckSummary = { ...deck, itemCount: 0, updatedAt: null };
    return {
      ...state,
      createStatus: 'loaded' as const,
      createdDeck: deck,
      createError: null,
      collection: state.collection
        ? {
            totalCount: state.collection.totalCount + 1,
            decks: [...state.collection.decks, summary],
          }
        : null,
    };
  }),
  on(DeckActions.createDeckFailure, (state, { message }) => ({
    ...state,
    createStatus: 'error' as const,
    createdDeck: null,
    createError: message,
  })),
  on(DeckActions.addItem, DeckActions.removeItem, (state) => ({
    ...state,
    itemMutationStatus: 'loading' as const,
    addedItem: null,
    removedItem: null,
    itemMutationError: null,
  })),
  on(DeckActions.addItemSuccess, (state, { result }) => ({
    ...state,
    itemMutationStatus: 'loaded' as const,
    addedItem: result,
    removedItem: null,
    itemMutationError: null,
    collection: updateCollectionItemCount(state.collection, result.deckId, 1),
    // Add response item görünüm alanlarını içermediği için detail collection sahte itemla değiştirilmez.
    selectedDeck: state.selectedDeck,
  })),
  on(DeckActions.removeItemSuccess, (state, { result }) => {
    // Backend removed=false dönerse collection veya detail sayacı değiştirilmez.
    const decrement = result.removed ? -1 : 0;
    return {
      ...state,
      itemMutationStatus: 'loaded' as const,
      addedItem: null,
      removedItem: result,
      itemMutationError: null,
      collection: updateCollectionItemCount(state.collection, result.deckId, decrement),
      selectedDeck:
        state.selectedDeck?.deckId === result.deckId
          ? {
              ...state.selectedDeck,
              itemCount: Math.max(0, state.selectedDeck.itemCount + decrement),
              items: result.removed
                ? state.selectedDeck.items.filter(
                    (item) => item.userLearningItemId !== result.userLearningItemId,
                  )
                : state.selectedDeck.items,
            }
          : state.selectedDeck,
    };
  }),
  on(DeckActions.itemMutationFailure, (state, { message }) => ({
    ...state,
    itemMutationStatus: 'error' as const,
    addedItem: null,
    removedItem: null,
    itemMutationError: message,
  })),
  on(DeckActions.clearDetail, (state) => ({
    ...state,
    detailStatus: 'idle' as const,
    selectedDeck: null,
    detailError: null,
  })),
  on(DeckActions.clearCreateState, (state) => ({
    ...state,
    createStatus: 'idle' as const,
    createdDeck: null,
    createError: null,
  })),
  on(DeckActions.clearItemMutationState, (state) => ({
    ...state,
    itemMutationStatus: 'idle' as const,
    addedItem: null,
    removedItem: null,
    itemMutationError: null,
  })),
  on(DeckActions.clear, () => initialDeckState),
);

/** Lazy provider üzerinden `decks` adıyla kaydedilecek NgRx feature tanımıdır. */
export const deckFeature = createFeature({
  name: 'decks',
  reducer: deckReducer,
});

/** Eşleşen deck summary itemCount değerini sıfırın altına düşürmeden günceller. */
function updateCollectionItemCount(
  collection: typeof initialDeckState.collection,
  deckId: string,
  delta: number,
): typeof initialDeckState.collection {
  if (!collection || delta === 0) {
    return collection;
  }

  return {
    ...collection,
    decks: collection.decks.map((deck) =>
      deck.deckId === deckId ? { ...deck, itemCount: Math.max(0, deck.itemCount + delta) } : deck,
    ),
  };
}
