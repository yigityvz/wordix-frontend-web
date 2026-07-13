/** Bu dosya, deck collection, detail, create ve item mutation feature state sözleşmesini tanımlar. */
import {
  AddedDeckItem,
  CreatedDeck,
  DeckCollection,
  DeckDetail,
  RemovedDeckItem,
} from '../models/deck.models';

/** Her deck API operasyonunun ortak lifecycle durumlarını sınırlar. */
export type DeckOperationStatus = 'idle' | 'loading' | 'loaded' | 'error';

/** Deck okuma ve mutation durumlarını birbirinden bağımsız taşıyan feature state'idir. */
export interface DeckState {
  readonly collectionStatus: DeckOperationStatus;
  readonly collection: DeckCollection | null;
  readonly collectionError: string | null;
  readonly detailStatus: DeckOperationStatus;
  readonly selectedDeck: DeckDetail | null;
  readonly detailError: string | null;
  readonly createStatus: DeckOperationStatus;
  readonly createdDeck: CreatedDeck | null;
  readonly createError: string | null;
  readonly itemMutationStatus: DeckOperationStatus;
  readonly addedItem: AddedDeckItem | null;
  readonly removedItem: RemovedDeckItem | null;
  readonly itemMutationError: string | null;
}

/** Deck feature route'u açılmadan önce kullanılan boş ve güvenli başlangıç state'idir. */
export const initialDeckState: DeckState = {
  collectionStatus: 'idle',
  collection: null,
  collectionError: null,
  detailStatus: 'idle',
  selectedDeck: null,
  detailError: null,
  createStatus: 'idle',
  createdDeck: null,
  createError: null,
  itemMutationStatus: 'idle',
  addedItem: null,
  removedItem: null,
  itemMutationError: null,
};
