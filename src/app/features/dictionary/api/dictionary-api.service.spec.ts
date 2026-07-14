/** Bu dosya, dictionary API service'in canlı Swagger route, method, body ve unwrap davranışını doğrular. */
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideApiClient } from 'angular-api-client-core';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { DictionaryApiService } from './dictionary-api.service';

/** Dictionary ve notes operasyonlarını Angular HTTP test backend'iyle sınar. */
describe('DictionaryApiService', () => {
  /** Her testte bekleyen HTTP requestlerini yöneten controllerı tutar. */
  let httpTestingController: HttpTestingController;

  /** Dictionary service ve kontrollü API base URL providerlarını test containerına kaydeder. */
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideApiClient({ baseUrl: 'http://localhost:5000/api/' }),
        DictionaryApiService,
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
  });

  /** Test sonunda karşılanmamış veya beklenmeyen HTTP requesti kalmadığını doğrular. */
  afterEach(() => {
    httpTestingController.verify();
  });

  /** Authenticated kullanıcının dictionary listesini query veya ownership alanı olmadan yükler. */
  it('loads and unwraps the current user dictionary', async () => {
    const result = firstValueFrom(TestBed.inject(DictionaryApiService).getMyDictionary());
    const request = httpTestingController.expectOne('http://localhost:5000/api/user-dictionary');

    expect(request.request.method).toBe('GET');
    expect(request.request.params.keys()).toEqual([]);
    request.flush(createApiResponse({ totalCount: 0, items: null }));

    await expect(result).resolves.toEqual({ totalCount: 0, items: null });
  });

  /** Detay endpointinin Swagger'daki canonical `{id}` path segmentini kullandığını doğrular. */
  it('loads a dictionary item by its canonical route id', async () => {
    const itemId = '11111111-1111-1111-1111-111111111111';
    const result = firstValueFrom(TestBed.inject(DictionaryApiService).getById(itemId));
    const request = httpTestingController.expectOne(
      `http://localhost:5000/api/user-dictionary/${itemId}`,
    );

    expect(request.request.method).toBe('GET');
    request.flush(createApiResponse(createDictionaryItemDto()));

    await expect(result).resolves.toMatchObject({
      userLearningItemId: itemId,
      displayText: 'ocean',
    });
  });

  /** Word/phrase save requestinin yalnızca backend sözleşmesindeki üç alanı gönderdiğini doğrular. */
  it('saves a learning item without ownership fields', async () => {
    const saveRequest = {
      learningItemId: '22222222-2222-2222-2222-222222222222',
      selectedMeaningId: '33333333-3333-3333-3333-333333333333',
      sourceLookupHistoryId: '44444444-4444-4444-4444-444444444444',
    } as const;
    const result = firstValueFrom(
      TestBed.inject(DictionaryApiService).saveLearningItem(saveRequest),
    );
    const request = httpTestingController.expectOne('http://localhost:5000/api/user-dictionary');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(saveRequest);
    expect(request.request.body).not.toHaveProperty('userId');
    expect(request.request.body).not.toHaveProperty('keycloakUserId');
    request.flush(
      createApiResponse({
        userLearningItemId: '11111111-1111-1111-1111-111111111111',
        learningItemId: saveRequest.learningItemId,
        selectedMeaningId: saveRequest.selectedMeaningId,
        userLearningProgressId: '55555555-5555-5555-5555-555555555555',
        sourceLookupHistoryId: saveRequest.sourceLookupHistoryId,
        savedAt: '2026-07-13T10:00:00Z',
        learningStatus: 'New',
        learningConfidenceScore: 0,
        isActive: true,
      }),
    );

    await expect(result).resolves.toMatchObject({
      userLearningItemId: '11111111-1111-1111-1111-111111111111',
    });
  });

  /** Sentence save requestinin ayrı `/sentences` endpointine eksiksiz gönderildiğini doğrular. */
  it('saves a sentence through the dedicated endpoint', async () => {
    const saveRequest = {
      sourceText: 'The ocean is calm.',
      translatedText: 'Okyanus sakin.',
      sourceLanguageCode: 'en',
      targetLanguageCode: 'tr',
      sourceLookupHistoryId: '44444444-4444-4444-4444-444444444444',
    } as const;
    const result = firstValueFrom(TestBed.inject(DictionaryApiService).saveSentence(saveRequest));
    const request = httpTestingController.expectOne(
      'http://localhost:5000/api/user-dictionary/sentences',
    );

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(saveRequest);
    request.flush(
      createApiResponse({
        userLearningItemId: '11111111-1111-1111-1111-111111111111',
        learningItemId: '22222222-2222-2222-2222-222222222222',
        sentenceId: '33333333-3333-3333-3333-333333333333',
        sentenceTranslationId: '55555555-5555-5555-5555-555555555555',
        sourceText: saveRequest.sourceText,
        normalizedSourceText: 'the ocean is calm.',
        translatedText: saveRequest.translatedText,
        normalizedTranslatedText: 'okyanus sakin.',
        userLearningProgressId: '66666666-6666-6666-6666-666666666666',
        sourceLookupHistoryId: saveRequest.sourceLookupHistoryId,
        savedAt: '2026-07-13T10:00:00Z',
        learningStatus: 'New',
        learningConfidenceScore: 0,
        isActive: true,
      }),
    );

    await expect(result).resolves.toMatchObject({ translatedText: 'Okyanus sakin.' });
  });

  /** Notes endpointlerinin Swagger'daki route, HTTP method ve yalın request body sözleşmelerini koruduğunu doğrular. */
  it('uses the canonical notes CRUD endpoints', async () => {
    const service = TestBed.inject(DictionaryApiService);
    const itemId = '11111111-1111-1111-1111-111111111111';
    const noteId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    const noteDto = createNoteDto(itemId, noteId);

    const listResult = firstValueFrom(service.getNotes(itemId));
    const listRequest = httpTestingController.expectOne(
      `http://localhost:5000/api/user-dictionary/${itemId}/notes`,
    );
    expect(listRequest.request.method).toBe('GET');
    listRequest.flush(createApiResponse({ totalCount: 1, items: [noteDto] }));
    await expect(listResult).resolves.toMatchObject({ totalCount: 1 });

    const createResult = firstValueFrom(service.createNote(itemId, { noteText: 'New note' }));
    const createRequest = httpTestingController.expectOne(
      `http://localhost:5000/api/user-dictionary/${itemId}/notes`,
    );
    expect(createRequest.request.method).toBe('POST');
    expect(createRequest.request.body).toEqual({ noteText: 'New note' });
    createRequest.flush(createApiResponse(noteDto));
    await expect(createResult).resolves.toMatchObject({ userLearningNoteId: noteId });

    const updateResult = firstValueFrom(service.updateNote(noteId, { noteText: 'Updated note' }));
    const updateRequest = httpTestingController.expectOne(
      `http://localhost:5000/api/user-dictionary/notes/${noteId}`,
    );
    expect(updateRequest.request.method).toBe('PUT');
    expect(updateRequest.request.body).toEqual({ noteText: 'Updated note' });
    updateRequest.flush(createApiResponse({ ...noteDto, noteText: 'Updated note' }));
    await expect(updateResult).resolves.toMatchObject({ noteText: 'Updated note' });

    const deleteResult = firstValueFrom(service.deleteNote(noteId));
    const deleteRequest = httpTestingController.expectOne(
      `http://localhost:5000/api/user-dictionary/notes/${noteId}`,
    );
    expect(deleteRequest.request.method).toBe('DELETE');
    expect(deleteRequest.request.body).toBeNull();
    deleteRequest.flush(createApiResponse(noteDto));
    await expect(deleteResult).resolves.toMatchObject({ userLearningNoteId: noteId });
  });

  /** Flags endpointlerinin canonical enum adı, route ve HTTP method sözleşmelerini koruduğunu doğrular. */
  it('uses the canonical flags endpoints', async () => {
    const service = TestBed.inject(DictionaryApiService);
    const itemId = '11111111-1111-1111-1111-111111111111';
    const flagDto = createFlagDto(itemId, 'Favorite');

    const listResult = firstValueFrom(service.getFlags(itemId));
    const listRequest = httpTestingController.expectOne(
      `http://localhost:5000/api/user-dictionary/${itemId}/flags`,
    );
    expect(listRequest.request.method).toBe('GET');
    listRequest.flush(createApiResponse({ totalCount: 1, items: [flagDto] }));
    await expect(listResult).resolves.toMatchObject({ totalCount: 1 });

    const setResult = firstValueFrom(service.setFlag(itemId, { flagType: 'Difficult' }));
    const setRequest = httpTestingController.expectOne(
      `http://localhost:5000/api/user-dictionary/${itemId}/flags`,
    );
    expect(setRequest.request.method).toBe('POST');
    expect(setRequest.request.body).toEqual({ flagType: 'Difficult' });
    setRequest.flush(createApiResponse(createFlagDto(itemId, 'Difficult')));
    await expect(setResult).resolves.toMatchObject({ flagType: 'Difficult' });

    const removeResult = firstValueFrom(service.removeFlag(itemId, 'Favorite'));
    const removeRequest = httpTestingController.expectOne(
      `http://localhost:5000/api/user-dictionary/${itemId}/flags/Favorite`,
    );
    expect(removeRequest.request.method).toBe('DELETE');
    expect(removeRequest.request.body).toBeNull();
    removeRequest.flush(createApiResponse(flagDto));
    await expect(removeResult).resolves.toMatchObject({ flagType: 'Favorite' });
  });
});

/** Test payloadını production `ApiResponse<T>` zarfına sarar. */
function createApiResponse<T>(data: T): {
  readonly success: true;
  readonly message: null;
  readonly data: T;
  readonly timestamp: string;
} {
  return { success: true, message: null, data, timestamp: '2026-07-13T10:00:00Z' };
}

/** Liste ve detay API testleri için eksiksiz dictionary item DTO fixture'ı üretir. */
function createDictionaryItemDto() {
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
    isFavorite: false,
    isDifficult: false,
    wantsMorePractice: false,
    isIgnored: false,
    noteCount: 0,
    isActive: true,
  };
}

/** Notes CRUD API testi için eksiksiz Swagger response fixture'ı üretir. */
function createNoteDto(userLearningItemId: string, userLearningNoteId: string) {
  return {
    userLearningNoteId,
    userLearningItemId,
    noteText: 'Original note',
    createdAt: '2026-07-13T10:00:00Z',
    updatedAt: null,
  };
}

/** Flags API testi için eksiksiz Swagger response fixture'ı üretir. */
function createFlagDto(userLearningItemId: string, flagType: 'Favorite' | 'Difficult') {
  return {
    userLearningFlagId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    userLearningItemId,
    flagType,
    createdAt: '2026-07-13T10:00:00Z',
  };
}
