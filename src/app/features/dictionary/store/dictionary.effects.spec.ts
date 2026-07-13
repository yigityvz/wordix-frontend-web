/** Bu dosya, dictionary effects'in API sonuçlarını collection, save ve notes lifecycle actionlarına çevirdiğini doğrular. */
import { TestBed } from '@angular/core/testing';
import { ApiError } from '@core/errors/api-error.model';
import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { firstValueFrom, of, Subject, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DictionaryApiService } from '../api/dictionary-api.service';
import { DictionaryActions } from './dictionary.actions';
import { DictionaryEffects } from './dictionary.effects';

/** Dictionary collection ve mutation effectlerini isolated action/API akışıyla sınar. */
describe('DictionaryEffects', () => {
  /** Her testte effecte action gönderen hot observable kaynağını tutar. */
  let actionsSubject: Subject<Action>;

  /** Gerçek HTTP yerine kontrollü observable döndüren API mock metodlarıdır. */
  const getMyDictionary = vi.fn();
  const getById = vi.fn();
  const saveLearningItem = vi.fn();
  const saveSentence = vi.fn();
  const getNotes = vi.fn();
  const createNote = vi.fn();
  const updateNote = vi.fn();
  const deleteNote = vi.fn();
  const getFlags = vi.fn();
  const setFlag = vi.fn();
  const removeFlag = vi.fn();

  /** Her test için action stream, API mockları ve effect injection containerını yeniden kurar. */
  beforeEach(() => {
    actionsSubject = new Subject<Action>();
    getMyDictionary.mockReset();
    getById.mockReset();
    saveLearningItem.mockReset();
    saveSentence.mockReset();
    getNotes.mockReset();
    createNote.mockReset();
    updateNote.mockReset();
    deleteNote.mockReset();
    getFlags.mockReset();
    setFlag.mockReset();
    removeFlag.mockReset();

    TestBed.configureTestingModule({
      providers: [
        DictionaryEffects,
        { provide: Actions, useFactory: () => new Actions(actionsSubject) },
        {
          provide: DictionaryApiService,
          useValue: {
            getMyDictionary,
            getById,
            saveLearningItem,
            saveSentence,
            getNotes,
            createNote,
            updateNote,
            deleteNote,
            getFlags,
            setFlag,
            removeFlag,
          },
        },
      ],
    });
  });

  /** Nullable collection listesinin mapper ile boş diziye dönüştürülüp success actionına taşındığını doğrular. */
  it('maps a loaded dictionary collection', async () => {
    getMyDictionary.mockReturnValue(of({ totalCount: 0, items: null }));
    const effectResult = firstValueFrom(TestBed.inject(DictionaryEffects).loadCollection$);

    actionsSubject.next(DictionaryActions.loadCollection());

    await expect(effectResult).resolves.toEqual(
      DictionaryActions.loadCollectionSuccess({ collection: { totalCount: 0, items: [] } }),
    );
  });

  /** Word/phrase save DTO'sunun canonical userLearningItemId ile success actionına dönüştüğünü doğrular. */
  it('maps a successful learning item save', async () => {
    const request = {
      learningItemId: '22222222-2222-2222-2222-222222222222',
      selectedMeaningId: null,
      sourceLookupHistoryId: null,
    };
    saveLearningItem.mockReturnValue(
      of({
        userLearningItemId: '11111111-1111-1111-1111-111111111111',
        learningItemId: request.learningItemId,
        selectedMeaningId: null,
        userLearningProgressId: '55555555-5555-5555-5555-555555555555',
        sourceLookupHistoryId: null,
        savedAt: '2026-07-13T10:00:00Z',
        learningStatus: 'New',
        learningConfidenceScore: 0,
        isActive: true,
      }),
    );
    const effectResult = firstValueFrom(TestBed.inject(DictionaryEffects).save$);

    actionsSubject.next(DictionaryActions.saveLearningItem({ request }));

    await expect(effectResult).resolves.toEqual(
      DictionaryActions.saveLearningItemSuccess({
        result: {
          userLearningItemId: '11111111-1111-1111-1111-111111111111',
          learningItemId: request.learningItemId,
          selectedMeaningId: null,
          userLearningProgressId: '55555555-5555-5555-5555-555555555555',
          sourceLookupHistoryId: null,
          savedAt: '2026-07-13T10:00:00Z',
          learningStatus: 'New',
          learningConfidenceScore: 0,
          isActive: true,
        },
      }),
    );
    expect(saveSentence).not.toHaveBeenCalled();
  });

  /** Bilinmeyen sentence API hatasının teknik detay sızdırmadan ortak save failure actionına dönüştüğünü doğrular. */
  it('maps an unknown sentence save error to a safe failure', async () => {
    saveSentence.mockReturnValue(throwError(() => new Error('private detail')));
    const effectResult = firstValueFrom(TestBed.inject(DictionaryEffects).save$);
    const request = {
      sourceText: 'The ocean is calm.',
      translatedText: 'Okyanus sakin.',
      sourceLanguageCode: 'en',
      targetLanguageCode: 'tr',
      sourceLookupHistoryId: null,
    };

    actionsSubject.next(DictionaryActions.saveSentence({ request }));

    await expect(effectResult).resolves.toEqual(
      DictionaryActions.saveFailure({ message: 'Cümle sözlüğe kaydedilemedi.' }),
    );
    expect(saveLearningItem).not.toHaveBeenCalled();
  });

  /** Duplicate business hatasının backenddeki güvenli mesajını UI state'ine kayıpsız taşıdığını doğrular. */
  it('preserves a normalized duplicate save message', async () => {
    const duplicateError = new ApiError({
      kind: 'business',
      statusCode: 409,
      message: 'This item is already in your dictionary.',
      errorCode: 'Dictionary.Duplicate',
      detail: null,
      traceId: null,
      validationErrors: [],
      timestamp: '2026-07-13T10:00:00Z',
    });
    saveLearningItem.mockReturnValue(throwError(() => duplicateError));
    const effectResult = firstValueFrom(TestBed.inject(DictionaryEffects).save$);
    const request = {
      learningItemId: '22222222-2222-2222-2222-222222222222',
      selectedMeaningId: '33333333-3333-3333-3333-333333333333',
      sourceLookupHistoryId: '44444444-4444-4444-4444-444444444444',
    };

    actionsSubject.next(DictionaryActions.saveLearningItem({ request }));

    await expect(effectResult).resolves.toEqual(
      DictionaryActions.saveFailure({ message: 'This item is already in your dictionary.' }),
    );
  });

  /** Nullable notes listesinin normalize collection success actionına dönüştüğünü doğrular. */
  it('maps a loaded notes collection', async () => {
    getNotes.mockReturnValue(of({ totalCount: 0, items: null }));
    const effectResult = firstValueFrom(TestBed.inject(DictionaryEffects).loadNotes$);
    const userLearningItemId = '11111111-1111-1111-1111-111111111111';

    actionsSubject.next(DictionaryActions.loadNotes({ userLearningItemId }));

    await expect(effectResult).resolves.toEqual(
      DictionaryActions.loadNotesSuccess({ collection: { totalCount: 0, items: [] } }),
    );
  });

  /** Create note DTO'sunun null olmayan normalize metinle success actionına dönüştüğünü doğrular. */
  it('maps a successful note creation', async () => {
    const userLearningItemId = '11111111-1111-1111-1111-111111111111';
    const request = { noteText: 'Remember this context.' };
    createNote.mockReturnValue(
      of({
        userLearningNoteId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        userLearningItemId,
        noteText: request.noteText,
        createdAt: '2026-07-13T10:00:00Z',
        updatedAt: null,
      }),
    );
    const effectResult = firstValueFrom(TestBed.inject(DictionaryEffects).createNote$);

    actionsSubject.next(DictionaryActions.createNote({ userLearningItemId, request }));

    await expect(effectResult).resolves.toEqual(
      DictionaryActions.createNoteSuccess({
        note: {
          userLearningNoteId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
          userLearningItemId,
          noteText: request.noteText,
          createdAt: '2026-07-13T10:00:00Z',
          updatedAt: null,
        },
      }),
    );
  });

  /** Nullable flags listesinin normalize collection success actionına dönüştüğünü doğrular. */
  it('maps a loaded flags collection', async () => {
    getFlags.mockReturnValue(of({ totalCount: 0, items: null }));
    const effectResult = firstValueFrom(TestBed.inject(DictionaryEffects).loadFlags$);
    const userLearningItemId = '11111111-1111-1111-1111-111111111111';

    actionsSubject.next(DictionaryActions.loadFlags({ userLearningItemId }));

    await expect(effectResult).resolves.toEqual(
      DictionaryActions.loadFlagsSuccess({ collection: { totalCount: 0, items: [] } }),
    );
  });

  /** Canonical Favorite set sonucunun normalize flag success actionına dönüştüğünü doğrular. */
  it('maps a successful flag set mutation', async () => {
    const userLearningItemId = '11111111-1111-1111-1111-111111111111';
    setFlag.mockReturnValue(
      of({
        userLearningFlagId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        userLearningItemId,
        flagType: 'Favorite',
        createdAt: '2026-07-13T10:00:00Z',
      }),
    );
    const effectResult = firstValueFrom(TestBed.inject(DictionaryEffects).setFlag$);

    actionsSubject.next(DictionaryActions.setFlag({ userLearningItemId, flagType: 'Favorite' }));

    await expect(effectResult).resolves.toEqual(
      DictionaryActions.setFlagSuccess({
        flag: {
          userLearningFlagId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
          userLearningItemId,
          flagType: 'Favorite',
          createdAt: '2026-07-13T10:00:00Z',
        },
      }),
    );
    expect(setFlag).toHaveBeenCalledWith(userLearningItemId, { flagType: 'Favorite' });
  });

  /** Normalize backend hatasının flag remove failure actionına güvenli mesajla taşındığını doğrular. */
  it('maps a flag remove error to a safe failure', async () => {
    const userLearningItemId = '11111111-1111-1111-1111-111111111111';
    removeFlag.mockReturnValue(throwError(() => new Error('private detail')));
    const effectResult = firstValueFrom(TestBed.inject(DictionaryEffects).removeFlag$);

    actionsSubject.next(
      DictionaryActions.removeFlag({ userLearningItemId, flagType: 'Difficult' }),
    );

    await expect(effectResult).resolves.toEqual(
      DictionaryActions.flagMutationFailure({ message: 'İşaret kaldırılamadı.' }),
    );
  });
});
