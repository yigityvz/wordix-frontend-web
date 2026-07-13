/** Bu dosya, deck feature state'ini page ve mutation akışları için türetilmiş selectorlara dönüştürür. */
import { createSelector } from '@ngrx/store';

import { DeckSummary } from '../models/deck.models';
import { deckFeature } from './deck.reducer';

/** Boş collection state'inde her selector çağrısında yeni dizi üretilmesini engelleyen sabit listedir. */
const EMPTY_DECKS: readonly DeckSummary[] = [];

/** NgRx feature tarafından üretilen temel deck selectorlarıdır. */
export const {
  selectDecksState,
  selectCollectionStatus,
  selectCollection,
  selectCollectionError,
  selectDetailStatus,
  selectSelectedDeck,
  selectDetailError,
  selectCreateStatus,
  selectCreatedDeck,
  selectCreateError,
  selectItemMutationStatus,
  selectAddedItem,
  selectRemovedItem,
  selectItemMutationError,
} = deckFeature;

/** Nullable collection içinden UI'ın doğrudan kullanabileceği kararlı deck listesini seçer. */
export const selectDecks = createSelector(
  selectCollection,
  (collection) => collection?.decks ?? EMPTY_DECKS,
);

/** Backend collection total count değerini seçer. */
export const selectTotalCount = createSelector(
  selectCollection,
  (collection) => collection?.totalCount ?? 0,
);

/** Deck collection requestinin sürüp sürmediğini seçer. */
export const selectIsCollectionLoading = createSelector(
  selectCollectionStatus,
  (status) => status === 'loading',
);

/** Deck detail requestinin sürüp sürmediğini seçer. */
export const selectIsDetailLoading = createSelector(
  selectDetailStatus,
  (status) => status === 'loading',
);

/** Deck create mutationının sürüp sürmediğini seçer. */
export const selectIsCreating = createSelector(
  selectCreateStatus,
  (status) => status === 'loading',
);

/** Deck item add veya remove mutationının sürüp sürmediğini seçer. */
export const selectIsItemMutating = createSelector(
  selectItemMutationStatus,
  (status) => status === 'loading',
);

/** Son item add sonucundan birleşik lookup/dictionary akışının kullanacağı deck UUID değerini seçer. */
export const selectLastMutatedDeckId = createSelector(
  selectAddedItem,
  selectRemovedItem,
  (addedItem, removedItem) => addedItem?.deckId ?? removedItem?.deckId ?? null,
);
