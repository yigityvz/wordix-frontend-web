/** Bu dosya, dictionary collection, detail ve save lifecycle actionlarının state geçişlerini doğrular. */
import { describe, expect, it } from 'vitest';

import {
  DictionaryCollection,
  DictionaryItem,
  DictionaryNote,
  DictionaryFlag,
  SavedLearningItem,
  SavedSentenceItem,
} from '../models/dictionary.models';
import { DictionaryActions } from './dictionary.actions';
import { dictionaryReducer } from './dictionary.reducer';
import { initialDictionaryState } from './dictionary.state';

/** Dictionary reducerın üç bağımsız lifecycle alanını yarışmadan güncellediğini sınar. */
describe('dictionaryReducer', () => {
  /** Collection loading actionının mevcut veriyi koruyup eski hatayı temizlediğini doğrular. */
  it('starts loading the dictionary collection', () => {
    const stateWithError = { ...initialDictionaryState, collectionError: 'Old error' };
    const result = dictionaryReducer(stateWithError, DictionaryActions.loadCollection());

    expect(result.collectionStatus).toBe('loading');
    expect(result.collectionError).toBeNull();
  });

  /** Başarılı collection payloadının item listesiyle state'e yazıldığını doğrular. */
  it('stores the loaded dictionary collection', () => {
    const collection: DictionaryCollection = { totalCount: 1, items: [createDictionaryItem()] };
    const result = dictionaryReducer(
      initialDictionaryState,
      DictionaryActions.loadCollectionSuccess({ collection }),
    );

    expect(result.collectionStatus).toBe('loaded');
    expect(result.collection).toBe(collection);
  });

  /** Yeni detail requestinde önceki seçili itemın temizlendiğini doğrular. */
  it('starts a clean dictionary detail request', () => {
    const stateWithDetail = {
      ...initialDictionaryState,
      detailStatus: 'loaded' as const,
      selectedItem: createDictionaryItem(),
    };
    const result = dictionaryReducer(
      stateWithDetail,
      DictionaryActions.loadDetail({
        userLearningItemId: '11111111-1111-1111-1111-111111111111',
      }),
    );

    expect(result.detailStatus).toBe('loading');
    expect(result.selectedItem).toBeNull();
  });

  /** Word/phrase save sonucunun sentence sonucuyla karışmadan state'e yazıldığını doğrular. */
  it('stores a saved learning item result', () => {
    const savedLearningItem = createSavedLearningItem();
    const result = dictionaryReducer(
      initialDictionaryState,
      DictionaryActions.saveLearningItemSuccess({ result: savedLearningItem }),
    );

    expect(result.saveStatus).toBe('loaded');
    expect(result.savedLearningItem).toBe(savedLearningItem);
    expect(result.savedSentenceItem).toBeNull();
  });

  /** Sentence save sonucunun word/phrase sonucuyla karışmadan state'e yazıldığını doğrular. */
  it('stores a saved sentence result', () => {
    const savedSentenceItem = createSavedSentenceItem();
    const result = dictionaryReducer(
      initialDictionaryState,
      DictionaryActions.saveSentenceSuccess({ result: savedSentenceItem }),
    );

    expect(result.saveStatus).toBe('loaded');
    expect(result.savedLearningItem).toBeNull();
    expect(result.savedSentenceItem).toBe(savedSentenceItem);
  });

  /** Create success sonucunun gerçek notu collection'a ekleyip detail noteCount değerini artırdığını doğrular. */
  it('adds a created note and updates the detail count', () => {
    const stateWithDetail = {
      ...initialDictionaryState,
      selectedItem: createDictionaryItem(),
      notesCollection: { totalCount: 0, items: [] },
    };
    const note = createDictionaryNote();
    const result = dictionaryReducer(
      stateWithDetail,
      DictionaryActions.createNoteSuccess({ note }),
    );

    expect(result.noteMutationStatus).toBe('loaded');
    expect(result.notesCollection).toEqual({ totalCount: 1, items: [note] });
    expect(result.selectedItem?.noteCount).toBe(1);
  });

  /** Update success sonucunun sadece canonical note UUID ile eşleşen kaydı değiştirdiğini doğrular. */
  it('replaces an updated note immutably', () => {
    const original = createDictionaryNote();
    const updated = { ...original, noteText: 'Updated note', updatedAt: '2026-07-13T11:00:00Z' };
    const stateWithNotes = {
      ...initialDictionaryState,
      notesCollection: { totalCount: 1, items: [original] },
    };
    const result = dictionaryReducer(
      stateWithNotes,
      DictionaryActions.updateNoteSuccess({ note: updated }),
    );

    expect(result.notesCollection?.items).toEqual([updated]);
    expect(result.notesCollection?.items).not.toBe(stateWithNotes.notesCollection.items);
  });

  /** Delete success sonucunun backendin döndürdüğü notu ve detail count değerini kaldırdığını doğrular. */
  it('removes a deleted note and updates the detail count', () => {
    const note = createDictionaryNote();
    const stateWithNotes = {
      ...initialDictionaryState,
      selectedItem: { ...createDictionaryItem(), noteCount: 1 },
      notesCollection: { totalCount: 1, items: [note] },
    };
    const result = dictionaryReducer(stateWithNotes, DictionaryActions.deleteNoteSuccess({ note }));

    expect(result.notesCollection).toEqual({ totalCount: 0, items: [] });
    expect(result.selectedItem?.noteCount).toBe(0);
  });

  /** Set success sonucunun flag collection ve detail Favorite durumunu birlikte güncellediğini doğrular. */
  it('adds a favorite flag and updates the detail item', () => {
    const flag = createDictionaryFlag('Favorite');
    const stateWithDetail = {
      ...initialDictionaryState,
      selectedItem: createDictionaryItem(),
      flagsCollection: { totalCount: 0, items: [] },
    };
    const result = dictionaryReducer(stateWithDetail, DictionaryActions.setFlagSuccess({ flag }));

    expect(result.flagMutationStatus).toBe('loaded');
    expect(result.flagsCollection).toEqual({ totalCount: 1, items: [flag] });
    expect(result.selectedItem?.isFavorite).toBe(true);
  });

  /** Idempotent set success sonucunun mevcut flag kaydını çoğaltmadığını doğrular. */
  it('keeps an idempotent flag set unique', () => {
    const existingFlag = createDictionaryFlag('Favorite');
    const replacement = { ...existingFlag, createdAt: '2026-07-13T11:00:00Z' };
    const stateWithFlag = {
      ...initialDictionaryState,
      flagsCollection: { totalCount: 1, items: [existingFlag] },
    };
    const result = dictionaryReducer(
      stateWithFlag,
      DictionaryActions.setFlagSuccess({ flag: replacement }),
    );

    expect(result.flagsCollection).toEqual({ totalCount: 1, items: [replacement] });
  });

  /** Remove success sonucunun Difficult kaydını ve detail boolean durumunu kaldırdığını doğrular. */
  it('removes a difficult flag and updates the detail item', () => {
    const flag = createDictionaryFlag('Difficult');
    const stateWithFlag = {
      ...initialDictionaryState,
      selectedItem: { ...createDictionaryItem(), isDifficult: true },
      flagsCollection: { totalCount: 1, items: [flag] },
    };
    const result = dictionaryReducer(stateWithFlag, DictionaryActions.removeFlagSuccess({ flag }));

    expect(result.flagsCollection).toEqual({ totalCount: 0, items: [] });
    expect(result.selectedItem?.isDifficult).toBe(false);
  });

  /** Clear actionının collection, detail ve save state'lerinin tamamını sıfırladığını doğrular. */
  it('clears the complete dictionary state', () => {
    const populatedState = {
      ...initialDictionaryState,
      collectionStatus: 'loaded' as const,
      collection: { totalCount: 1, items: [createDictionaryItem()] },
      saveStatus: 'loaded' as const,
      savedLearningItem: createSavedLearningItem(),
    };

    expect(dictionaryReducer(populatedState, DictionaryActions.clear())).toEqual(
      initialDictionaryState,
    );
  });
});

/** Reducer testlerinde kullanılan eksiksiz dictionary item görünüm fixture'ını üretir. */
function createDictionaryItem(): DictionaryItem {
  return {
    userLearningItemId: '11111111-1111-1111-1111-111111111111',
    learningItemId: '22222222-2222-2222-2222-222222222222',
    wordId: '77777777-7777-7777-7777-777777777777',
    phraseId: null,
    sentenceId: null,
    itemType: 'Word',
    displayText: 'ocean',
    normalizedText: 'ocean',
    sourceLanguageCode: 'en',
    selectedMeaningId: null,
    sentenceTranslation: null,
    selectedMeaning: null,
    savedAt: '2026-07-13T10:00:00Z',
    sourceLookupHistoryId: null,
    learningStatus: 'New',
    learningConfidenceScore: 0,
    isFavorite: false,
    isDifficult: false,
    wantsMorePractice: false,
    isIgnored: false,
    noteCount: 0,
    isActive: true,
  };
}

/** Reducer word/phrase mutation testi için canonical save result fixture'ını üretir. */
function createSavedLearningItem(): SavedLearningItem {
  return {
    userLearningItemId: '11111111-1111-1111-1111-111111111111',
    learningItemId: '22222222-2222-2222-2222-222222222222',
    selectedMeaningId: null,
    userLearningProgressId: '55555555-5555-5555-5555-555555555555',
    sourceLookupHistoryId: null,
    savedAt: '2026-07-13T10:00:00Z',
    learningStatus: 'New',
    learningConfidenceScore: 0,
    isActive: true,
  };
}

/** Reducer sentence mutation testi için canonical save result fixture'ını üretir. */
function createSavedSentenceItem(): SavedSentenceItem {
  return {
    userLearningItemId: '11111111-1111-1111-1111-111111111111',
    learningItemId: '22222222-2222-2222-2222-222222222222',
    sentenceId: '33333333-3333-3333-3333-333333333333',
    sentenceTranslationId: '44444444-4444-4444-4444-444444444444',
    sourceText: 'The ocean is calm.',
    normalizedSourceText: 'the ocean is calm.',
    translatedText: 'Okyanus sakin.',
    normalizedTranslatedText: 'okyanus sakin.',
    userLearningProgressId: '55555555-5555-5555-5555-555555555555',
    sourceLookupHistoryId: null,
    savedAt: '2026-07-13T10:00:00Z',
    learningStatus: 'New',
    learningConfidenceScore: 0,
    isActive: true,
  };
}

/** Reducer notes mutation testleri için normalize not fixture'ı üretir. */
function createDictionaryNote(): DictionaryNote {
  return {
    userLearningNoteId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    userLearningItemId: '11111111-1111-1111-1111-111111111111',
    noteText: 'Remember this context.',
    createdAt: '2026-07-13T10:00:00Z',
    updatedAt: null,
  };
}

/** Reducer flags mutation testleri için normalize flag fixture'ı üretir. */
function createDictionaryFlag(flagType: 'Favorite' | 'Difficult'): DictionaryFlag {
  return {
    userLearningFlagId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    userLearningItemId: '11111111-1111-1111-1111-111111111111',
    flagType,
    createdAt: '2026-07-13T10:00:00Z',
  };
}
