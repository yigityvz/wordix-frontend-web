/** Bu dosya, deck API service'in canlı Swagger route, method, body ve unwrap davranışını doğrular. */
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AppConfigService } from '@core/config/app-config.service';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { DeckApiService } from './deck-api.service';

/** Beş canonical deck operasyonunu Angular HTTP test backend'iyle sınar. */
describe('DeckApiService', () => {
  /** Her testte bekleyen HTTP requestlerini yöneten controllerı tutar. */
  let httpTestingController: HttpTestingController;

  /** Deck service ve kontrollü API base URL providerlarını test containerına kaydeder. */
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        DeckApiService,
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:5000/api/' } },
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  /** Test sonunda karşılanmamış veya beklenmeyen HTTP requesti kalmadığını doğrular. */
  afterEach(() => {
    httpTestingController.verify();
  });

  /** Current user deck listesini ownership query alanı olmadan yükler ve response zarfını açar. */
  it('loads and unwraps the current user deck collection', async () => {
    const result = firstValueFrom(TestBed.inject(DeckApiService).getMyDecks());
    const request = httpTestingController.expectOne('http://localhost:5000/api/decks');

    expect(request.request.method).toBe('GET');
    expect(request.request.params.keys()).toEqual([]);
    request.flush(createApiResponse({ totalCount: 0, decks: null }));

    await expect(result).resolves.toEqual({ totalCount: 0, decks: null });
  });

  /** Deck detail endpointinin canonical UUID route segmentini kullandığını doğrular. */
  it('loads a deck detail by id', async () => {
    const deckId = '11111111-1111-1111-1111-111111111111';
    const result = firstValueFrom(TestBed.inject(DeckApiService).getById(deckId));
    const request = httpTestingController.expectOne(`http://localhost:5000/api/decks/${deckId}`);

    expect(request.request.method).toBe('GET');
    request.flush(createApiResponse(createDeckDetailDto(deckId)));

    await expect(result).resolves.toMatchObject({ deckId, name: 'Core Words' });
  });

  /** Create requestinin yalnızca name ve description alanlarını gerçek endpointine gönderdiğini doğrular. */
  it('creates a deck without ownership fields', async () => {
    const createRequest = { name: 'Core Words', description: 'Daily practice' } as const;
    const result = firstValueFrom(TestBed.inject(DeckApiService).createDeck(createRequest));
    const request = httpTestingController.expectOne('http://localhost:5000/api/decks');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(createRequest);
    expect(request.request.body).not.toHaveProperty('userId');
    expect(request.request.body).not.toHaveProperty('keycloakUserId');
    request.flush(
      createApiResponse({
        deckId: '11111111-1111-1111-1111-111111111111',
        name: createRequest.name,
        normalizedName: 'core words',
        description: createRequest.description,
        createdAt: '2026-07-13T10:00:00Z',
        isActive: true,
      }),
    );

    await expect(result).resolves.toMatchObject({ name: 'Core Words' });
  });

  /** Item add requestinin dictionary item UUID değerini canonical nested route'a gönderdiğini doğrular. */
  it('adds a dictionary item to a deck', async () => {
    const deckId = '11111111-1111-1111-1111-111111111111';
    const userLearningItemId = '22222222-2222-2222-2222-222222222222';
    const result = firstValueFrom(
      TestBed.inject(DeckApiService).addItem(deckId, { userLearningItemId }),
    );
    const request = httpTestingController.expectOne(
      `http://localhost:5000/api/decks/${deckId}/items`,
    );

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ userLearningItemId });
    request.flush(
      createApiResponse({
        deckItemId: '33333333-3333-3333-3333-333333333333',
        deckId,
        userLearningItemId,
        addedAt: '2026-07-13T10:00:00Z',
      }),
    );

    await expect(result).resolves.toMatchObject({ deckId, userLearningItemId });
  });

  /** Item remove requestinin iki UUID değerini route'ta kullanıp body göndermediğini doğrular. */
  it('removes a dictionary item from a deck', async () => {
    const deckId = '11111111-1111-1111-1111-111111111111';
    const userLearningItemId = '22222222-2222-2222-2222-222222222222';
    const result = firstValueFrom(
      TestBed.inject(DeckApiService).removeItem(deckId, userLearningItemId),
    );
    const request = httpTestingController.expectOne(
      `http://localhost:5000/api/decks/${deckId}/items/${userLearningItemId}`,
    );

    expect(request.request.method).toBe('DELETE');
    expect(request.request.body).toBeNull();
    request.flush(
      createApiResponse({
        deckId,
        userLearningItemId,
        removedDeckItemId: '33333333-3333-3333-3333-333333333333',
        removed: true,
      }),
    );

    await expect(result).resolves.toMatchObject({ removed: true });
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

/** Detail API testi için nullable item listeli eksiksiz deck DTO fixture'ı üretir. */
function createDeckDetailDto(deckId: string) {
  return {
    deckId,
    name: 'Core Words',
    normalizedName: 'core words',
    description: 'Daily practice',
    itemCount: 0,
    items: null,
    createdAt: '2026-07-13T10:00:00Z',
    updatedAt: null,
    isActive: true,
  };
}
