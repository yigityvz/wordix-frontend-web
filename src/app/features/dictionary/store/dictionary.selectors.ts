/** Bu dosya, dictionary feature state'ini page ve mutation akışları için türetilmiş selectorlara dönüştürür. */
import { createSelector } from '@ngrx/store';

import { DictionaryFlag, DictionaryItem, DictionaryNote } from '../models/dictionary.models';
import { dictionaryFeature } from './dictionary.reducer';

/** Boş collection state'inde her selector çağrısında yeni dizi üretilmesini engelleyen sabit listedir. */
const EMPTY_DICTIONARY_ITEMS: readonly DictionaryItem[] = [];

/** Boş notes state'inde her selector çağrısında yeni dizi üretilmesini engelleyen sabit listedir. */
const EMPTY_DICTIONARY_NOTES: readonly DictionaryNote[] = [];

/** Boş flags state'inde selectorların kararlı referans kullanmasını sağlayan sabit listedir. */
const EMPTY_DICTIONARY_FLAGS: readonly DictionaryFlag[] = [];

/** NgRx feature tarafından üretilen temel dictionary selectorlarıdır. */
export const {
  selectDictionaryState,
  selectCollectionStatus,
  selectCollection,
  selectCollectionError,
  selectDetailStatus,
  selectSelectedItem,
  selectDetailError,
  selectSaveStatus,
  selectSavedLearningItem,
  selectSavedSentenceItem,
  selectSaveError,
  selectNotesStatus,
  selectNotesCollection,
  selectNotesError,
  selectNoteMutationStatus,
  selectNoteMutationError,
  selectFlagsStatus,
  selectFlagsCollection,
  selectFlagsError,
  selectFlagMutationStatus,
  selectFlagMutationError,
  selectMutatingFlagType,
} = dictionaryFeature;

/** Dictionary collection requestinin sürüp sürmediğini seçer. */
export const selectIsCollectionLoading = createSelector(
  selectCollectionStatus,
  (status) => status === 'loading',
);

/** Nullable collection içinden UI'ın doğrudan kullanabileceği kararlı item listesini seçer. */
export const selectItems = createSelector(
  selectCollection,
  (collection) => collection?.items ?? EMPTY_DICTIONARY_ITEMS,
);

/** Collection payloadının backend total count değerini seçer. */
export const selectTotalCount = createSelector(
  selectCollection,
  (collection) => collection?.totalCount ?? 0,
);

/** Dictionary detail requestinin sürüp sürmediğini seçer. */
export const selectIsDetailLoading = createSelector(
  selectDetailStatus,
  (status) => status === 'loading',
);

/** Word/phrase veya sentence save mutationının sürüp sürmediğini seçer. */
export const selectIsSaving = createSelector(selectSaveStatus, (status) => status === 'loading');

/** Notes collection requestinin sürüp sürmediğini seçer. */
export const selectAreNotesLoading = createSelector(
  selectNotesStatus,
  (status) => status === 'loading',
);

/** Nullable notes collection içinden kararlı not listesini seçer. */
export const selectNotes = createSelector(
  selectNotesCollection,
  (collection) => collection?.items ?? EMPTY_DICTIONARY_NOTES,
);

/** Note create, update veya delete requestinin sürüp sürmediğini seçer. */
export const selectIsNoteMutating = createSelector(
  selectNoteMutationStatus,
  (status) => status === 'loading',
);

/** Flags collection requestinin sürüp sürmediğini seçer. */
export const selectAreFlagsLoading = createSelector(
  selectFlagsStatus,
  (status) => status === 'loading',
);

/** Nullable flags collection içinden kararlı flag listesini seçer. */
export const selectFlags = createSelector(
  selectFlagsCollection,
  (collection) => collection?.items ?? EMPTY_DICTIONARY_FLAGS,
);

/** Gerçek flags collection içinde Favorite kaydı olup olmadığını seçer. */
export const selectHasFavoriteFlag = createSelector(selectFlags, (flags) =>
  flags.some((flag) => flag.flagType.toLowerCase() === 'favorite'),
);

/** Gerçek flags collection içinde Difficult kaydı olup olmadığını seçer. */
export const selectHasDifficultFlag = createSelector(selectFlags, (flags) =>
  flags.some((flag) => flag.flagType.toLowerCase() === 'difficult'),
);

/** Flag set veya remove requestinin sürüp sürmediğini seçer. */
export const selectIsFlagMutating = createSelector(
  selectFlagMutationStatus,
  (status) => status === 'loading',
);

/** İki save response tipinden sonraki deck akışında kullanılacak canonical dictionary item id'sini seçer. */
export const selectLastSavedUserLearningItemId = createSelector(
  selectSavedLearningItem,
  selectSavedSentenceItem,
  (learningItem, sentenceItem) =>
    learningItem?.userLearningItemId ?? sentenceItem?.userLearningItemId ?? null,
);
