/** Bu dosya, lookup effect'in API sonucunu mapper üzerinden success/failure actionlarına çevirdiğini doğrular. */
import { TestBed } from '@angular/core/testing';
import { Action } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { firstValueFrom, of, Subject, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LookupApiService } from '../api/lookup-api.service';
import { LookupResponseDto } from '../models/lookup-api.models';
import { LookupActions } from './lookup.actions';
import { LookupEffects } from './lookup.effects';

/** Lookup API success ve hata lifecycle action üretimini isolated action akışıyla sınar. */
describe('LookupEffects', () => {
  /** Her testte effecte kontrollü action gönderen hot observable kaynağını tutar. */
  let actionsSubject: Subject<Action>;

  /** Gerçek HTTP yerine yalnızca return observable davranışı kontrol edilen API mockunu tutar. */
  const lookup = vi.fn();

  /** Her test için action stream, API mock ve effect injection containerını yeniden kurar. */
  beforeEach(() => {
    actionsSubject = new Subject<Action>();
    lookup.mockReset();

    TestBed.configureTestingModule({
      providers: [
        LookupEffects,
        { provide: Actions, useFactory: () => new Actions(actionsSubject) },
        { provide: LookupApiService, useValue: { lookup } },
      ],
    });
  });

  /** API DTO'sunun mapper ile normalize edilip Search Success actionına taşındığını doğrular. */
  it('maps a successful API response to search success', async () => {
    lookup.mockReturnValue(of(createLookupResponse()));
    const effectResult = firstValueFrom(TestBed.inject(LookupEffects).search$);
    const request = { text: 'ocean', sourceLanguageCode: 'en', targetLanguageCode: 'tr' };

    actionsSubject.next(LookupActions.search({ request }));

    await expect(effectResult).resolves.toEqual(
      LookupActions.searchSuccess({
        result: {
          ...createLookupResponse(),
          meanings: [],
          sentenceTranslations: [],
        },
      }),
    );
    expect(lookup).toHaveBeenCalledWith(request);
  });

  /** Bilinmeyen API hatasının teknik detay sızdırmadan Search Failure actionına dönüştüğünü doğrular. */
  it('maps an unknown API error to a safe failure action', async () => {
    lookup.mockReturnValue(throwError(() => new Error('private technical detail')));
    const effectResult = firstValueFrom(TestBed.inject(LookupEffects).search$);

    actionsSubject.next(
      LookupActions.search({
        request: { text: 'ocean', sourceLanguageCode: 'en', targetLanguageCode: 'tr' },
      }),
    );

    await expect(effectResult).resolves.toEqual(
      LookupActions.searchFailure({ message: 'Arama sonucu yüklenemedi.' }),
    );
  });
});

/** Effect başarı testinde kullanılan canlı Swagger ile uyumlu lookup DTO fixture'ını üretir. */
function createLookupResponse(): LookupResponseDto {
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
    meanings: null,
    sentenceTranslations: null,
  };
}
