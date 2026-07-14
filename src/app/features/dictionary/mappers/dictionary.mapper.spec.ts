/**
 * Bu dosya, dictionary mapperların nullable listeleri ve nested selected content
 * alanlarını doğru dönüştürdüğünü doğrular.
 */
import { describe, expect, it } from 'vitest';

import { UserDictionaryItemResponseDto } from '../models/dictionary-api.models';
import {
  mapDictionaryCollection,
  mapDictionaryItem,
  mapSavedLearningItem,
  mapSavedSentenceItem,
} from './dictionary.mapper';

/** Dictionary transport DTO'larından kararlı UI/state modelleri üretilmesini sınar. */
describe('dictionary mappers', () => {
  /** Null backend item listesinin boş diziye çevrilip total count değerinin korunduğunu doğrular. */
  it('normalizes a nullable dictionary item list', () => {
    expect(mapDictionaryCollection({ totalCount: 0, items: null })).toEqual({
      totalCount: 0,
      items: [],
    });
  });

  /** Selected meaning, flags, progress ve note count alanlarının detail modelinde kaybolmadığını doğrular. */
  it('maps a dictionary item with selected meaning metadata', () => {
    const item = mapDictionaryItem(createDictionaryItemDto());

    expect(item).toMatchObject({
      userLearningItemId: '11111111-1111-1111-1111-111111111111',
      displayText: 'ocean',
      selectedMeaning: { translation: 'okyanus', partOfSpeech: 'noun' },
      learningStatus: 'New',
      isFavorite: true,
      noteCount: 2,
    });
  });

  /** Word/phrase save sonucundaki canonical userLearningItemId değerinin korunduğunu doğrular. */
  it('maps a saved learning item result', () => {
    const result = mapSavedLearningItem({
      userLearningItemId: '11111111-1111-1111-1111-111111111111',
      learningItemId: '22222222-2222-2222-2222-222222222222',
      selectedMeaningId: '33333333-3333-3333-3333-333333333333',
      userLearningProgressId: '55555555-5555-5555-5555-555555555555',
      sourceLookupHistoryId: '44444444-4444-4444-4444-444444444444',
      savedAt: '2026-07-13T10:00:00Z',
      learningStatus: 'New',
      learningConfidenceScore: 0,
      isActive: true,
    });

    expect(result.userLearningItemId).toBe('11111111-1111-1111-1111-111111111111');
    expect(result.selectedMeaningId).toBe('33333333-3333-3333-3333-333333333333');
  });

  /** Sentence save sonucundaki item, sentence ve translation UUID zincirinin korunduğunu doğrular. */
  it('maps a saved sentence result', () => {
    const result = mapSavedSentenceItem({
      userLearningItemId: '11111111-1111-1111-1111-111111111111',
      learningItemId: '22222222-2222-2222-2222-222222222222',
      sentenceId: '33333333-3333-3333-3333-333333333333',
      sentenceTranslationId: '55555555-5555-5555-5555-555555555555',
      sourceText: 'The ocean is calm.',
      normalizedSourceText: 'the ocean is calm.',
      translatedText: 'Okyanus sakin.',
      normalizedTranslatedText: 'okyanus sakin.',
      userLearningProgressId: '66666666-6666-6666-6666-666666666666',
      sourceLookupHistoryId: '44444444-4444-4444-4444-444444444444',
      savedAt: '2026-07-13T10:00:00Z',
      learningStatus: 'New',
      learningConfidenceScore: 0,
      isActive: true,
    });

    expect(result).toMatchObject({
      sentenceId: '33333333-3333-3333-3333-333333333333',
      sentenceTranslationId: '55555555-5555-5555-5555-555555555555',
      translatedText: 'Okyanus sakin.',
    });
  });
});

/** Dictionary item mapper testi için nested meaning ve progress alanlarını içeren DTO fixture'ı üretir. */
function createDictionaryItemDto(): UserDictionaryItemResponseDto {
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
    selectedMeaningId: '33333333-3333-3333-3333-333333333333',
    sentenceTranslation: null,
    selectedMeaning: {
      meaningId: '33333333-3333-3333-3333-333333333333',
      translation: 'okyanus',
      definition: 'A large body of salt water.',
      partOfSpeech: 'noun',
      isPrimary: true,
      displayOrder: 1,
    },
    savedAt: '2026-07-13T10:00:00Z',
    sourceLookupHistoryId: '44444444-4444-4444-4444-444444444444',
    learningStatus: 'New',
    learningConfidenceScore: 0,
    isFavorite: true,
    isDifficult: false,
    wantsMorePractice: false,
    isIgnored: false,
    noteCount: 2,
    isActive: true,
  };
}
