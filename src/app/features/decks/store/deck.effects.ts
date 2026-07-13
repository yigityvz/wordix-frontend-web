/** Bu dosya, deck actions akışını gerçek API çağrıları ve DTO mapperlarla birleştirir. */
import { inject, Injectable } from '@angular/core';
import { ApiError } from '@core/errors/api-error.model';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs';

import { DeckApiService } from '../api/deck-api.service';
import {
  mapAddedDeckItem,
  mapCreatedDeck,
  mapDeckCollection,
  mapDeckDetail,
  mapRemovedDeckItem,
} from '../mappers/deck.mapper';
import { DeckActions } from './deck.actions';

/** Deck HTTP yan etkilerini reducer, facade ve componentlerden izole eder. */
@Injectable()
export class DeckEffects {
  /** NgRx deck action akışını effectlere sağlar. */
  private readonly actions$ = inject(Actions);

  /** Gerçek deck endpointlerini feature API servisi üzerinden çağırır. */
  private readonly deckApiService = inject(DeckApiService);

  /** Yeni collection isteğinde önceki isteği iptal edip en güncel deck listesini state'e taşır. */
  readonly loadCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DeckActions.loadCollection),
      switchMap(() =>
        this.deckApiService.getMyDecks().pipe(
          map((dto) => DeckActions.loadCollectionSuccess({ collection: mapDeckCollection(dto) })),
          catchError((error: unknown) =>
            of(
              DeckActions.loadCollectionFailure({
                message: getDeckErrorMessage(error, 'Desteler yüklenemedi.'),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  /** Route değişiminde önceki detail isteğini iptal edip son istenen deck'i yükler. */
  readonly loadDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DeckActions.loadDetail),
      switchMap(({ deckId }) =>
        this.deckApiService.getById(deckId).pipe(
          map((dto) => DeckActions.loadDetailSuccess({ detail: mapDeckDetail(dto) })),
          catchError((error: unknown) =>
            of(
              DeckActions.loadDetailFailure({
                message: getDeckErrorMessage(error, 'Deste detayı yüklenemedi.'),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  /** Tekrarlanan create submitlerini engelleyip backend deck sonucunu state'e taşır. */
  readonly createDeck$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DeckActions.createDeck),
      exhaustMap(({ request }) =>
        this.deckApiService.createDeck(request).pipe(
          map((dto) => DeckActions.createDeckSuccess({ deck: mapCreatedDeck(dto) })),
          catchError((error: unknown) =>
            of(
              DeckActions.createDeckFailure({
                message: getDeckErrorMessage(error, 'Deste oluşturulamadı.'),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  /** Add ve remove niyetlerini tek sırada çalıştırarak item mutation yarışını engeller. */
  readonly mutateItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DeckActions.addItem, DeckActions.removeItem),
      exhaustMap((action) => {
        // Action type seçimi add request body ile remove route sözleşmesinin karışmasını engeller.
        if (action.type === DeckActions.addItem.type) {
          return this.deckApiService.addItem(action.deckId, action.request).pipe(
            map((dto) => DeckActions.addItemSuccess({ result: mapAddedDeckItem(dto) })),
            catchError((error: unknown) =>
              of(
                DeckActions.itemMutationFailure({
                  message: getDeckErrorMessage(error, 'İçerik desteye eklenemedi.'),
                }),
              ),
            ),
          );
        }

        return this.deckApiService.removeItem(action.deckId, action.userLearningItemId).pipe(
          map((dto) => DeckActions.removeItemSuccess({ result: mapRemovedDeckItem(dto) })),
          catchError((error: unknown) =>
            of(
              DeckActions.itemMutationFailure({
                message: getDeckErrorMessage(error, 'İçerik desteden kaldırılamadı.'),
              }),
            ),
          ),
        );
      }),
    ),
  );
}

/** Normalize ApiError mesajını korur; bilinmeyen hatalarda operasyona özel güvenli fallback döndürür. */
function getDeckErrorMessage(error: unknown, fallbackMessage: string): string {
  return error instanceof ApiError ? error.message : fallbackMessage;
}
