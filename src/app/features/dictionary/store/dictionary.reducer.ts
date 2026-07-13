/** Bu dosya, dictionary ve notes lifecycle actionlarını immutable feature state değişimlerine uygular. */
import { createFeature, createReducer, on } from '@ngrx/store';

import { DictionaryActions } from './dictionary.actions';
import { initialDictionaryState } from './dictionary.state';

/** Liste, detay ve save actionlarının tek saf state güncelleme noktasıdır. */
export const dictionaryReducer = createReducer(
  initialDictionaryState,
  on(DictionaryActions.loadCollection, (state) => ({
    ...state,
    collectionStatus: 'loading' as const,
    collectionError: null,
  })),
  on(DictionaryActions.loadCollectionSuccess, (state, { collection }) => ({
    ...state,
    collectionStatus: 'loaded' as const,
    collection,
    collectionError: null,
  })),
  on(DictionaryActions.loadCollectionFailure, (state, { message }) => ({
    ...state,
    collectionStatus: 'error' as const,
    collectionError: message,
  })),
  on(DictionaryActions.loadDetail, (state) => ({
    ...state,
    detailStatus: 'loading' as const,
    selectedItem: null,
    detailError: null,
  })),
  on(DictionaryActions.loadDetailSuccess, (state, { item }) => ({
    ...state,
    detailStatus: 'loaded' as const,
    selectedItem: item,
    detailError: null,
  })),
  on(DictionaryActions.loadDetailFailure, (state, { message }) => ({
    ...state,
    detailStatus: 'error' as const,
    selectedItem: null,
    detailError: message,
  })),
  on(DictionaryActions.saveLearningItem, DictionaryActions.saveSentence, (state) => ({
    ...state,
    saveStatus: 'loading' as const,
    savedLearningItem: null,
    savedSentenceItem: null,
    saveError: null,
  })),
  on(DictionaryActions.saveLearningItemSuccess, (state, { result }) => ({
    ...state,
    saveStatus: 'loaded' as const,
    savedLearningItem: result,
    savedSentenceItem: null,
    saveError: null,
  })),
  on(DictionaryActions.saveSentenceSuccess, (state, { result }) => ({
    ...state,
    saveStatus: 'loaded' as const,
    savedLearningItem: null,
    savedSentenceItem: result,
    saveError: null,
  })),
  on(DictionaryActions.saveFailure, (state, { message }) => ({
    ...state,
    saveStatus: 'error' as const,
    savedLearningItem: null,
    savedSentenceItem: null,
    saveError: message,
  })),
  on(DictionaryActions.loadNotes, (state) => ({
    ...state,
    notesStatus: 'loading' as const,
    notesError: null,
  })),
  on(DictionaryActions.loadNotesSuccess, (state, { collection }) => ({
    ...state,
    notesStatus: 'loaded' as const,
    notesCollection: collection,
    notesError: null,
  })),
  on(DictionaryActions.loadNotesFailure, (state, { message }) => ({
    ...state,
    notesStatus: 'error' as const,
    notesError: message,
  })),
  on(
    DictionaryActions.createNote,
    DictionaryActions.updateNote,
    DictionaryActions.deleteNote,
    (state) => ({
      ...state,
      noteMutationStatus: 'loading' as const,
      noteMutationError: null,
    }),
  ),
  on(DictionaryActions.createNoteSuccess, (state, { note }) => ({
    ...state,
    noteMutationStatus: 'loaded' as const,
    noteMutationError: null,
    notesCollection: {
      totalCount: (state.notesCollection?.totalCount ?? 0) + 1,
      items: [...(state.notesCollection?.items ?? []), note],
    },
    selectedItem: state.selectedItem
      ? { ...state.selectedItem, noteCount: state.selectedItem.noteCount + 1 }
      : null,
  })),
  on(DictionaryActions.updateNoteSuccess, (state, { note }) => ({
    ...state,
    noteMutationStatus: 'loaded' as const,
    noteMutationError: null,
    notesCollection: state.notesCollection
      ? {
          ...state.notesCollection,
          items: state.notesCollection.items.map((item) =>
            item.userLearningNoteId === note.userLearningNoteId ? note : item,
          ),
        }
      : null,
  })),
  on(DictionaryActions.deleteNoteSuccess, (state, { note }) => ({
    ...state,
    noteMutationStatus: 'loaded' as const,
    noteMutationError: null,
    notesCollection: state.notesCollection
      ? {
          totalCount: Math.max(0, state.notesCollection.totalCount - 1),
          items: state.notesCollection.items.filter(
            (item) => item.userLearningNoteId !== note.userLearningNoteId,
          ),
        }
      : null,
    selectedItem: state.selectedItem
      ? { ...state.selectedItem, noteCount: Math.max(0, state.selectedItem.noteCount - 1) }
      : null,
  })),
  on(DictionaryActions.noteMutationFailure, (state, { message }) => ({
    ...state,
    noteMutationStatus: 'error' as const,
    noteMutationError: message,
  })),
  on(DictionaryActions.loadFlags, (state) => ({
    ...state,
    flagsStatus: 'loading' as const,
    flagsError: null,
  })),
  on(DictionaryActions.loadFlagsSuccess, (state, { collection }) => ({
    ...state,
    flagsStatus: 'loaded' as const,
    flagsCollection: collection,
    flagsError: null,
  })),
  on(DictionaryActions.loadFlagsFailure, (state, { message }) => ({
    ...state,
    flagsStatus: 'error' as const,
    flagsError: message,
  })),
  on(DictionaryActions.setFlag, (state, { flagType }) => ({
    ...state,
    flagMutationStatus: 'loading' as const,
    flagMutationError: null,
    mutatingFlagType: flagType,
  })),
  on(DictionaryActions.removeFlag, (state, { flagType }) => ({
    ...state,
    flagMutationStatus: 'loading' as const,
    flagMutationError: null,
    mutatingFlagType: flagType,
  })),
  on(DictionaryActions.setFlagSuccess, (state, { flag }) => {
    // Idempotent backend set sonucu mevcut flag kaydını tekrar çoğaltmadan collection'a uygulanır.
    const currentItems = state.flagsCollection?.items ?? [];
    const alreadyExists = currentItems.some((item) =>
      hasSameFlagType(item.flagType, flag.flagType),
    );
    const nextItems = alreadyExists
      ? currentItems.map((item) => (hasSameFlagType(item.flagType, flag.flagType) ? flag : item))
      : [...currentItems, flag];

    return {
      ...state,
      flagMutationStatus: 'loaded' as const,
      flagMutationError: null,
      mutatingFlagType: null,
      flagsCollection: {
        totalCount: alreadyExists
          ? (state.flagsCollection?.totalCount ?? nextItems.length)
          : (state.flagsCollection?.totalCount ?? 0) + 1,
        items: nextItems,
      },
      selectedItem: updateSelectedItemFlag(state.selectedItem, flag.flagType, true),
    };
  }),
  on(DictionaryActions.removeFlagSuccess, (state, { flag }) => {
    // Backendin döndürdüğü canonical flag tipi collection ve detail görünümünden kaldırılır.
    const currentItems = state.flagsCollection?.items ?? [];
    const removed = currentItems.some((item) => hasSameFlagType(item.flagType, flag.flagType));
    const nextItems = currentItems.filter((item) => !hasSameFlagType(item.flagType, flag.flagType));

    return {
      ...state,
      flagMutationStatus: 'loaded' as const,
      flagMutationError: null,
      mutatingFlagType: null,
      flagsCollection: state.flagsCollection
        ? {
            totalCount: removed
              ? Math.max(0, state.flagsCollection.totalCount - 1)
              : state.flagsCollection.totalCount,
            items: nextItems,
          }
        : null,
      selectedItem: updateSelectedItemFlag(state.selectedItem, flag.flagType, false),
    };
  }),
  on(DictionaryActions.flagMutationFailure, (state, { message }) => ({
    ...state,
    flagMutationStatus: 'error' as const,
    flagMutationError: message,
    mutatingFlagType: null,
  })),
  on(DictionaryActions.clearDetail, (state) => ({
    ...state,
    detailStatus: 'idle' as const,
    selectedItem: null,
    detailError: null,
  })),
  on(DictionaryActions.clearNotes, (state) => ({
    ...state,
    notesStatus: 'idle' as const,
    notesCollection: null,
    notesError: null,
    noteMutationStatus: 'idle' as const,
    noteMutationError: null,
  })),
  on(DictionaryActions.clearNoteMutationState, (state) => ({
    ...state,
    noteMutationStatus: 'idle' as const,
    noteMutationError: null,
  })),
  on(DictionaryActions.clearFlags, (state) => ({
    ...state,
    flagsStatus: 'idle' as const,
    flagsCollection: null,
    flagsError: null,
    flagMutationStatus: 'idle' as const,
    flagMutationError: null,
    mutatingFlagType: null,
  })),
  on(DictionaryActions.clearFlagMutationState, (state) => ({
    ...state,
    flagMutationStatus: 'idle' as const,
    flagMutationError: null,
    mutatingFlagType: null,
  })),
  on(DictionaryActions.clearSaveState, (state) => ({
    ...state,
    saveStatus: 'idle' as const,
    savedLearningItem: null,
    savedSentenceItem: null,
    saveError: null,
  })),
  on(DictionaryActions.clear, () => initialDictionaryState),
);

/** Lazy route provider üzerinden `dictionary` adıyla kaydedilecek NgRx feature tanımıdır. */
export const dictionaryFeature = createFeature({
  name: 'dictionary',
  reducer: dictionaryReducer,
});

/** Backend flag tipi değerlerini canonical enum adından bağımsız case-insensitive karşılaştırır. */
function hasSameFlagType(left: string, right: string): boolean {
  return left.localeCompare(right, undefined, { sensitivity: 'accent' }) === 0;
}

/** Favorite veya Difficult mutation sonucunu mevcut detail item booleans alanlarına uygular. */
function updateSelectedItemFlag(
  item: typeof initialDictionaryState.selectedItem,
  flagType: string,
  active: boolean,
): typeof initialDictionaryState.selectedItem {
  if (!item) {
    return null;
  }

  if (hasSameFlagType(flagType, 'Favorite')) {
    return { ...item, isFavorite: active };
  }

  if (hasSameFlagType(flagType, 'Difficult')) {
    return { ...item, isDifficult: active };
  }

  return item;
}
