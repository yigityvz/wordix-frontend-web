/** Bu dosya, lookup API service'in canlı Swagger route, method, body ve response zarfına uyduğunu doğrular. */
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AppConfigService } from '@core/config/app-config.service';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { LookupApiService } from './lookup-api.service';

/** Gerçek route ve ApiResponse unwrap davranışını Angular HTTP test backend'iyle sınar. */
describe('LookupApiService', () => {
  /** Her testte bekleyen HTTP requestlerini yöneten controllerı tutar. */
  let httpTestingController: HttpTestingController;

  /** Lookup service ve kontrollü API base URL providerlarını bağımsız test containerına kaydeder. */
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        LookupApiService,
        {
          provide: AppConfigService,
          useValue: { apiBaseUrl: 'http://localhost:5000/api/' },
        },
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
  });

  /** Test sonunda karşılanmamış veya beklenmeyen HTTP requesti kalmadığını doğrular. */
  afterEach(() => {
    httpTestingController.verify();
  });

  /** `/api/lookups` POST isteğinin yalnızca Swagger request alanlarını gönderip payloadı unwrap ettiğini doğrular. */
  it('posts the lookup request and unwraps the API response', async () => {
    const lookupRequest = {
      text: 'ocean',
      sourceLanguageCode: 'en',
      targetLanguageCode: 'tr',
    } as const;
    const result = firstValueFrom(TestBed.inject(LookupApiService).lookup(lookupRequest));
    const request = httpTestingController.expectOne('http://localhost:5000/api/lookups');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(lookupRequest);
    expect(request.request.body).not.toHaveProperty('userId');
    expect(request.request.body).not.toHaveProperty('keycloakUserId');

    request.flush({
      success: true,
      message: null,
      data: {
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
        sentenceTranslations: null,
      },
      timestamp: '2026-07-13T09:00:00Z',
    });

    await expect(result).resolves.toMatchObject({
      text: 'ocean',
      lookupHistoryId: '33333333-3333-3333-3333-333333333333',
      isAlreadyInUserDictionary: false,
    });
  });
});
