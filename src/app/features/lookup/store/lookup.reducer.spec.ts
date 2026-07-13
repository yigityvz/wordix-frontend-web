/** Bu dosya, lookup API lifecycle actionlarının feature state'i doğru güncellediğini doğrular. */
import { describe, expect, it } from 'vitest';

import { LookupResult } from '../models/lookup-response.model';
import { LookupActions } from './lookup.actions';
import { lookupReducer } from './lookup.reducer';
import { initialLookupState } from './lookup.state';

/** Lookup loading, success, failure ve clear state geçişlerini sınar. */
describe('lookupReducer', () => {
  /** Search actionının önceki sonucu temizleyip requesti loading state'e yazdığını doğrular. */
  it('starts a new lookup request', () => {
    const request = {
      text: 'ocean',
      sourceLanguageCode: 'en',
      targetLanguageCode: 'tr',
    } as const;

    expect(lookupReducer(initialLookupState, LookupActions.search({ request }))).toEqual({
      status: 'loading',
      request,
      result: null,
      error: null,
    });
  });

  /** Başarılı API sonucunun normalize görünüm modelini state'e yazdığını doğrular. */
  it('stores a successful lookup result', () => {
    const loadingState = lookupReducer(
      initialLookupState,
      LookupActions.search({
        request: { text: 'ocean', sourceLanguageCode: 'en', targetLanguageCode: 'tr' },
      }),
    );
    const result = createLookupResult();

    expect(lookupReducer(loadingState, LookupActions.searchSuccess({ result }))).toEqual({
      status: 'loaded',
      request: loadingState.request,
      result,
      error: null,
    });
  });

  /** API hatasının requesti koruyup result yerine güvenli hata mesajını sakladığını doğrular. */
  it('stores a lookup failure without a stale result', () => {
    const loadingState = {
      status: 'loading' as const,
      request: { text: 'ocean', sourceLanguageCode: 'en', targetLanguageCode: 'tr' },
      result: null,
      error: null,
    };

    expect(
      lookupReducer(loadingState, LookupActions.searchFailure({ message: 'Lookup failed.' })),
    ).toEqual({
      ...loadingState,
      status: 'error',
      result: null,
      error: 'Lookup failed.',
    });
  });

  /** Clear actionının tüm lookup state'ini başlangıç değerine döndürdüğünü doğrular. */
  it('clears lookup state', () => {
    const loadedState = {
      status: 'loaded' as const,
      request: { text: 'ocean', sourceLanguageCode: 'en', targetLanguageCode: 'tr' },
      result: createLookupResult(),
      error: null,
    };

    expect(lookupReducer(loadedState, LookupActions.clear())).toEqual(initialLookupState);
  });
});

/** Reducer testlerinde kullanılan eksiksiz ve normalize lookup görünüm fixture'ını üretir. */
function createLookupResult(): LookupResult {
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
  };
}
