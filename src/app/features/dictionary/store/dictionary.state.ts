/** Bu dosya, dictionary collection, detail, save ve notes operasyonlarının feature state sözleşmesini tanımlar. */
import {
  DictionaryCollection,
  DictionaryItem,
  DictionaryNotesCollection,
  DictionaryFlagsCollection,
  SavedLearningItem,
  SavedSentenceItem,
} from '../models/dictionary.models';
import { EditableDictionaryFlagType } from '../models/dictionary-request.models';

/** Her dictionary API operasyonunun ortak lifecycle durumlarını sınırlar. */
export type DictionaryOperationStatus = 'idle' | 'loading' | 'loaded' | 'error';

/** Liste, detay ve mutation durumlarını birbirinden bağımsız taşıyan dictionary feature state'idir. */
export interface DictionaryState {
  readonly collectionStatus: DictionaryOperationStatus;
  readonly collection: DictionaryCollection | null;
  readonly collectionError: string | null;
  readonly detailStatus: DictionaryOperationStatus;
  readonly selectedItem: DictionaryItem | null;
  readonly detailError: string | null;
  readonly saveStatus: DictionaryOperationStatus;
  readonly savedLearningItem: SavedLearningItem | null;
  readonly savedSentenceItem: SavedSentenceItem | null;
  readonly saveError: string | null;
  readonly notesStatus: DictionaryOperationStatus;
  readonly notesCollection: DictionaryNotesCollection | null;
  readonly notesError: string | null;
  readonly noteMutationStatus: DictionaryOperationStatus;
  readonly noteMutationError: string | null;
  readonly flagsStatus: DictionaryOperationStatus;
  readonly flagsCollection: DictionaryFlagsCollection | null;
  readonly flagsError: string | null;
  readonly flagMutationStatus: DictionaryOperationStatus;
  readonly flagMutationError: string | null;
  readonly mutatingFlagType: EditableDictionaryFlagType | null;
}

/** Dictionary feature route'u açılmadan önce kullanılan boş ve güvenli başlangıç state'idir. */
export const initialDictionaryState: DictionaryState = {
  collectionStatus: 'idle',
  collection: null,
  collectionError: null,
  detailStatus: 'idle',
  selectedItem: null,
  detailError: null,
  saveStatus: 'idle',
  savedLearningItem: null,
  savedSentenceItem: null,
  saveError: null,
  notesStatus: 'idle',
  notesCollection: null,
  notesError: null,
  noteMutationStatus: 'idle',
  noteMutationError: null,
  flagsStatus: 'idle',
  flagsCollection: null,
  flagsError: null,
  flagMutationStatus: 'idle',
  flagMutationError: null,
  mutatingFlagType: null,
};
