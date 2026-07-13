/** Bu dosya, dictionary actions akışını gerçek API çağrıları ve DTO mapperlarla birleştirir. */
import { inject, Injectable } from '@angular/core';
import { ApiError } from '@core/errors/api-error.model';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs';

import { DictionaryApiService } from '../api/dictionary-api.service';
import {
  mapDictionaryCollection,
  mapDictionaryItem,
  mapDictionaryNote,
  mapDictionaryNotesCollection,
  mapDictionaryFlag,
  mapDictionaryFlagsCollection,
  mapSavedLearningItem,
  mapSavedSentenceItem,
} from '../mappers/dictionary.mapper';
import { DictionaryActions } from './dictionary.actions';

/** Dictionary HTTP yan etkilerini reducer, facade ve componentlerden izole eder. */
@Injectable()
export class DictionaryEffects {
  /** NgRx dictionary action akışını effectlere sağlar. */
  private readonly actions$ = inject(Actions);

  /** Gerçek user dictionary endpointlerini feature API servisi üzerinden çağırır. */
  private readonly dictionaryApiService = inject(DictionaryApiService);

  /** Yeni collection isteğinde önceki isteği iptal edip en güncel dictionary listesini state'e taşır. */
  readonly loadCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DictionaryActions.loadCollection),
      switchMap(() =>
        this.dictionaryApiService.getMyDictionary().pipe(
          map((dto) =>
            DictionaryActions.loadCollectionSuccess({
              collection: mapDictionaryCollection(dto),
            }),
          ),
          catchError((error: unknown) =>
            of(
              DictionaryActions.loadCollectionFailure({
                message: getDictionaryErrorMessage(error, 'Sözlük yüklenemedi.'),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  /** Route değişiminde önceki detail isteğini iptal edip son istenen dictionary item'ı yükler. */
  readonly loadDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DictionaryActions.loadDetail),
      switchMap(({ userLearningItemId }) =>
        this.dictionaryApiService.getById(userLearningItemId).pipe(
          map((dto) => DictionaryActions.loadDetailSuccess({ item: mapDictionaryItem(dto) })),
          catchError((error: unknown) =>
            of(
              DictionaryActions.loadDetailFailure({
                message: getDictionaryErrorMessage(error, 'Sözlük detayı yüklenemedi.'),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  /** Word/phrase ve sentence save niyetlerini tek sırada çalıştırarak duplicate submit yarışını engeller. */
  readonly save$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DictionaryActions.saveLearningItem, DictionaryActions.saveSentence),
      exhaustMap((action) => {
        // Action type seçimi iki farklı backend save sözleşmesinin karışmasını engeller.
        if (action.type === DictionaryActions.saveLearningItem.type) {
          return this.dictionaryApiService.saveLearningItem(action.request).pipe(
            map((dto) =>
              DictionaryActions.saveLearningItemSuccess({ result: mapSavedLearningItem(dto) }),
            ),
            catchError((error: unknown) =>
              of(
                DictionaryActions.saveFailure({
                  message: getDictionaryErrorMessage(error, 'Kelime sözlüğe kaydedilemedi.'),
                }),
              ),
            ),
          );
        }

        return this.dictionaryApiService.saveSentence(action.request).pipe(
          map((dto) =>
            DictionaryActions.saveSentenceSuccess({ result: mapSavedSentenceItem(dto) }),
          ),
          catchError((error: unknown) =>
            of(
              DictionaryActions.saveFailure({
                message: getDictionaryErrorMessage(error, 'Cümle sözlüğe kaydedilemedi.'),
              }),
            ),
          ),
        );
      }),
    ),
  );

  /** Route veya retry niyetinde en güncel notes collection requestini state'e taşır. */
  readonly loadNotes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DictionaryActions.loadNotes),
      switchMap(({ userLearningItemId }) =>
        this.dictionaryApiService.getNotes(userLearningItemId).pipe(
          map((dto) =>
            DictionaryActions.loadNotesSuccess({
              collection: mapDictionaryNotesCollection(dto),
            }),
          ),
          catchError((error: unknown) =>
            of(
              DictionaryActions.loadNotesFailure({
                message: getDictionaryErrorMessage(error, 'Notlar yüklenemedi.'),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  /** Tekrarlanan create submitlerini engelleyip backend sonucunu notes collection'a ekler. */
  readonly createNote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DictionaryActions.createNote),
      exhaustMap(({ userLearningItemId, request }) =>
        this.dictionaryApiService.createNote(userLearningItemId, request).pipe(
          map((dto) => DictionaryActions.createNoteSuccess({ note: mapDictionaryNote(dto) })),
          catchError((error: unknown) =>
            of(
              DictionaryActions.noteMutationFailure({
                message: getDictionaryErrorMessage(error, 'Not eklenemedi.'),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  /** Tekrarlanan update submitlerini engelleyip güncel backend notunu state'e taşır. */
  readonly updateNote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DictionaryActions.updateNote),
      exhaustMap(({ noteId, request }) =>
        this.dictionaryApiService.updateNote(noteId, request).pipe(
          map((dto) => DictionaryActions.updateNoteSuccess({ note: mapDictionaryNote(dto) })),
          catchError((error: unknown) =>
            of(
              DictionaryActions.noteMutationFailure({
                message: getDictionaryErrorMessage(error, 'Not güncellenemedi.'),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  /** Tekrarlanan delete submitlerini engelleyip backendin sildiği notu state'ten kaldırır. */
  readonly deleteNote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DictionaryActions.deleteNote),
      exhaustMap(({ noteId }) =>
        this.dictionaryApiService.deleteNote(noteId).pipe(
          map((dto) => DictionaryActions.deleteNoteSuccess({ note: mapDictionaryNote(dto) })),
          catchError((error: unknown) =>
            of(
              DictionaryActions.noteMutationFailure({
                message: getDictionaryErrorMessage(error, 'Not silinemedi.'),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  /** Route veya retry niyetinde en güncel flags collection requestini state'e taşır. */
  readonly loadFlags$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DictionaryActions.loadFlags),
      switchMap(({ userLearningItemId }) =>
        this.dictionaryApiService.getFlags(userLearningItemId).pipe(
          map((dto) =>
            DictionaryActions.loadFlagsSuccess({
              collection: mapDictionaryFlagsCollection(dto),
            }),
          ),
          catchError((error: unknown) =>
            of(
              DictionaryActions.loadFlagsFailure({
                message: getDictionaryErrorMessage(error, 'İşaretler yüklenemedi.'),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  /** Aynı set intentinin tekrar submit edilmesini engelleyip backend flag sonucunu state'e taşır. */
  readonly setFlag$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DictionaryActions.setFlag),
      exhaustMap(({ userLearningItemId, flagType }) =>
        this.dictionaryApiService.setFlag(userLearningItemId, { flagType }).pipe(
          map((dto) => DictionaryActions.setFlagSuccess({ flag: mapDictionaryFlag(dto) })),
          catchError((error: unknown) =>
            of(
              DictionaryActions.flagMutationFailure({
                message: getDictionaryErrorMessage(error, 'İşaret eklenemedi.'),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  /** Aynı remove intentinin tekrar submit edilmesini engelleyip backend sonucunu state'e taşır. */
  readonly removeFlag$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DictionaryActions.removeFlag),
      exhaustMap(({ userLearningItemId, flagType }) =>
        this.dictionaryApiService.removeFlag(userLearningItemId, flagType).pipe(
          map((dto) => DictionaryActions.removeFlagSuccess({ flag: mapDictionaryFlag(dto) })),
          catchError((error: unknown) =>
            of(
              DictionaryActions.flagMutationFailure({
                message: getDictionaryErrorMessage(error, 'İşaret kaldırılamadı.'),
              }),
            ),
          ),
        ),
      ),
    ),
  );
}

/** Normalize ApiError mesajını korur; bilinmeyen hatalarda operasyona özel güvenli fallback döndürür. */
function getDictionaryErrorMessage(error: unknown, fallbackMessage: string): string {
  return error instanceof ApiError ? error.message : fallbackMessage;
}
