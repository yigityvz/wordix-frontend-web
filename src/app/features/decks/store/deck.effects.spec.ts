/** Bu dosya, deck effects'in API sonuçlarını collection, create ve item mutation actionlarına çevirdiğini doğrular. */
import { TestBed } from '@angular/core/testing';
import { ApiError } from '@core/errors/api-error.model';
import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { firstValueFrom, of, Subject, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DeckApiService } from '../api/deck-api.service';
import { DeckActions } from './deck.actions';
import { DeckEffects } from './deck.effects';

/** Deck okuma ve mutation effectlerini isolated action/API akışıyla sınar. */
describe('DeckEffects', () => {
  /** Her testte effecte action gönderen hot observable kaynağını tutar. */
  let actionsSubject: Subject<Action>;

  /** Gerçek HTTP yerine kontrollü observable döndüren API mock metodlarıdır. */
  const getMyDecks = vi.fn();
  const getById = vi.fn();
  const createDeck = vi.fn();
  const addItem = vi.fn();
  const removeItem = vi.fn();

  /** Her test için action stream, API mockları ve effect injection containerını yeniden kurar. */
  beforeEach(() => {
    actionsSubject = new Subject<Action>();
    getMyDecks.mockReset();
    getById.mockReset();
    createDeck.mockReset();
    addItem.mockReset();
    removeItem.mockReset();

    TestBed.configureTestingModule({
      providers: [
        DeckEffects,
        { provide: Actions, useFactory: () => new Actions(actionsSubject) },
        {
          provide: DeckApiService,
          useValue: { getMyDecks, getById, createDeck, addItem, removeItem },
        },
      ],
    });
  });

  /** Nullable deck listesinin mapper ile boş diziye dönüştürülüp success actionına taşındığını doğrular. */
  it('maps a loaded deck collection', async () => {
    getMyDecks.mockReturnValue(of({ totalCount: 0, decks: null }));
    const effectResult = firstValueFrom(TestBed.inject(DeckEffects).loadCollection$);

    actionsSubject.next(DeckActions.loadCollection());

    await expect(effectResult).resolves.toEqual(
      DeckActions.loadCollectionSuccess({ collection: { totalCount: 0, decks: [] } }),
    );
  });

  /** Create DTO'sunun null olmayan normalize name alanlarıyla success actionına dönüştüğünü doğrular. */
  it('maps a successful deck creation', async () => {
    const request = { name: 'Core Words', description: null };
    createDeck.mockReturnValue(
      of({
        deckId: '11111111-1111-1111-1111-111111111111',
        name: request.name,
        normalizedName: 'core words',
        description: null,
        createdAt: '2026-07-13T10:00:00Z',
        isActive: true,
      }),
    );
    const effectResult = firstValueFrom(TestBed.inject(DeckEffects).createDeck$);

    actionsSubject.next(DeckActions.createDeck({ request }));

    await expect(effectResult).resolves.toEqual(
      DeckActions.createDeckSuccess({
        deck: {
          deckId: '11111111-1111-1111-1111-111111111111',
          name: request.name,
          normalizedName: 'core words',
          description: null,
          createdAt: '2026-07-13T10:00:00Z',
          isActive: true,
        },
      }),
    );
  });

  /** Item add actionının request body sözleşmesiyle doğru API metoduna yönlendirildiğini doğrular. */
  it('maps a successful deck item add', async () => {
    const deckId = '11111111-1111-1111-1111-111111111111';
    const request = { userLearningItemId: '22222222-2222-2222-2222-222222222222' };
    const dto = {
      deckItemId: '33333333-3333-3333-3333-333333333333',
      deckId,
      userLearningItemId: request.userLearningItemId,
      addedAt: '2026-07-13T10:00:00Z',
    };
    addItem.mockReturnValue(of(dto));
    const effectResult = firstValueFrom(TestBed.inject(DeckEffects).mutateItem$);

    actionsSubject.next(DeckActions.addItem({ deckId, request }));

    await expect(effectResult).resolves.toEqual(DeckActions.addItemSuccess({ result: dto }));
    expect(addItem).toHaveBeenCalledWith(deckId, request);
    expect(removeItem).not.toHaveBeenCalled();
  });

  /** Normalize backend remove hatasının güvenli mesajla ortak failure actionına taşındığını doğrular. */
  it('preserves a normalized deck item remove error', async () => {
    const apiError = new ApiError({
      kind: 'business',
      statusCode: 404,
      message: 'Deck item was not found.',
      errorCode: 'Deck.ItemNotFound',
      detail: null,
      traceId: null,
      validationErrors: [],
      timestamp: '2026-07-13T10:00:00Z',
    });
    removeItem.mockReturnValue(throwError(() => apiError));
    const effectResult = firstValueFrom(TestBed.inject(DeckEffects).mutateItem$);
    const deckId = '11111111-1111-1111-1111-111111111111';
    const userLearningItemId = '22222222-2222-2222-2222-222222222222';

    actionsSubject.next(DeckActions.removeItem({ deckId, userLearningItemId }));

    await expect(effectResult).resolves.toEqual(
      DeckActions.itemMutationFailure({ message: 'Deck item was not found.' }),
    );
    expect(addItem).not.toHaveBeenCalled();
  });
});
