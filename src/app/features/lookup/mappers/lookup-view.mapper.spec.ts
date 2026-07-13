/** Bu dosya, lookup mapper'ın nullable listeleri normalize edip provider alanlarını koruduğunu doğrular. */
import { describe, expect, it } from 'vitest';

import { LookupResponseDto } from '../models/lookup-api.models';
import { mapLookupResult } from './lookup-view.mapper';

/** Swagger lookup DTO'sundan kararlı UI görünümünün üretilmesini sınar. */
describe('mapLookupResult', () => {
  /** Null backend listelerinin UI'da güvenli boş dizilere dönüştürüldüğünü doğrular. */
  it('normalizes nullable result collections', () => {
    const result = mapLookupResult(
      createLookupResponse({ meanings: null, sentenceTranslations: null }),
    );

    expect(result.meanings).toEqual([]);
    expect(result.sentenceTranslations).toEqual([]);
    expect(result.lookupHistoryId).toBe('33333333-3333-3333-3333-333333333333');
  });

  /** Meaning ve sentence translation provider/lisans alanlarının kaybolmadığını doğrular. */
  it('preserves meaning and sentence source metadata', () => {
    const result = mapLookupResult(
      createLookupResponse({
        meanings: [
          {
            meaningId: '44444444-4444-4444-4444-444444444444',
            translation: 'okyanus',
            definition: 'A large body of salt water.',
            exampleSentence: 'The ocean is calm.',
            partOfSpeech: 'noun',
            contentSource: 'Imported',
            qualityStatus: 'Verified',
            sourceProvider: 'Kaikki',
          },
        ],
        sentenceTranslations: [
          {
            sentenceTranslationId: null,
            translatedText: 'Okyanus sakin.',
            sourceProvider: 'Azure',
            license: 'ProviderTerms',
          },
        ],
      }),
    );

    expect(result.meanings[0]).toMatchObject({ sourceProvider: 'Kaikki', translation: 'okyanus' });
    expect(result.sentenceTranslations[0]).toEqual({
      sentenceTranslationId: null,
      translatedText: 'Okyanus sakin.',
      sourceProvider: 'Azure',
      license: 'ProviderTerms',
    });
  });
});

/** Testlerin yalnızca değiştirdiği nested listeler dışında eksiksiz bir Swagger DTO fixture'ı üretir. */
function createLookupResponse(overrides: Partial<LookupResponseDto> = {}): LookupResponseDto {
  return {
    learningItemId: '11111111-1111-1111-1111-111111111111',
    wordId: '22222222-2222-2222-2222-222222222222',
    phraseId: null,
    sentenceId: null,
    lookupHistoryId: '33333333-3333-3333-3333-333333333333',
    text: 'ocean',
    normalizedText: 'ocean',
    itemType: 'Word',
    sourceLanguageCode: 'en',
    targetLanguageCode: 'tr',
    lookupSource: 'Database',
    contentSource: 'Imported',
    qualityStatus: 'Verified',
    sourceType: 'Dictionary',
    isAlreadyInUserDictionary: false,
    meanings: [],
    sentenceTranslations: [],
    ...overrides,
  };
}
