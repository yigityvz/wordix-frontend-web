/** Bu dosya, dictionary page ve birleşik save akışlarına NgRx ayrıntısı göstermeden state ve intent sunar. */
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import {
  SaveLearningItemRequest,
  SaveDictionaryNoteRequest,
  EditableDictionaryFlagType,
  SaveSentenceToDictionaryRequest,
} from '../models/dictionary-request.models';
import { DictionaryActions } from '../store/dictionary.actions';
import {
  selectCollectionError,
  selectAreNotesLoading,
  selectCollectionStatus,
  selectDetailError,
  selectDetailStatus,
  selectIsCollectionLoading,
  selectIsDetailLoading,
  selectIsSaving,
  selectIsNoteMutating,
  selectItems,
  selectLastSavedUserLearningItemId,
  selectSaveError,
  selectSaveStatus,
  selectSavedLearningItem,
  selectSavedSentenceItem,
  selectSelectedItem,
  selectTotalCount,
  selectNotes,
  selectNotesError,
  selectNotesStatus,
  selectNoteMutationError,
  selectNoteMutationStatus,
  selectAreFlagsLoading,
  selectFlagsError,
  selectFlagsStatus,
  selectFlagMutationError,
  selectFlagMutationStatus,
  selectHasDifficultFlag,
  selectHasFavoriteFlag,
  selectIsFlagMutating,
  selectMutatingFlagType,
} from '../store/dictionary.selectors';

/** Dictionary feature componentlerinin kullanacağı tek state ve action köprüsüdür. */
@Injectable()
export class DictionaryFacade {
  /** Dictionary feature state action ve selector erişimini sağlar. */
  private readonly store = inject(Store);

  /** Collection lifecycle durumunu signal olarak sunar. */
  readonly collectionStatus = this.store.selectSignal(selectCollectionStatus);

  /** Normalize dictionary item listesini signal olarak sunar. */
  readonly items = this.store.selectSignal(selectItems);

  /** Backend collection total count değerini signal olarak sunar. */
  readonly totalCount = this.store.selectSignal(selectTotalCount);

  /** Collection loading durumunu sayfa iskeletine sunar. */
  readonly isCollectionLoading = this.store.selectSignal(selectIsCollectionLoading);

  /** Collection API hata mesajını recoverable UI state'e sunar. */
  readonly collectionError = this.store.selectSignal(selectCollectionError);

  /** Detail lifecycle durumunu signal olarak sunar. */
  readonly detailStatus = this.store.selectSignal(selectDetailStatus);

  /** Seçili dictionary item detayını signal olarak sunar. */
  readonly selectedItem = this.store.selectSignal(selectSelectedItem);

  /** Detail loading durumunu sayfa iskeletine sunar. */
  readonly isDetailLoading = this.store.selectSignal(selectIsDetailLoading);

  /** Detail API hata mesajını recoverable UI state'e sunar. */
  readonly detailError = this.store.selectSignal(selectDetailError);

  /** Save mutation lifecycle durumunu birleşik lookup/dictionary akışlarına sunar. */
  readonly saveStatus = this.store.selectSignal(selectSaveStatus);

  /** Save tekrar submit kontrolü için loading durumunu sunar. */
  readonly isSaving = this.store.selectSignal(selectIsSaving);

  /** Son word/phrase save sonucunu signal olarak sunar. */
  readonly savedLearningItem = this.store.selectSignal(selectSavedLearningItem);

  /** Son sentence save sonucunu signal olarak sunar. */
  readonly savedSentenceItem = this.store.selectSignal(selectSavedSentenceItem);

  /** İki save tipinden oluşan canonical userLearningItemId değerini sunar. */
  readonly lastSavedUserLearningItemId = this.store.selectSignal(selectLastSavedUserLearningItemId);

  /** Normalize save hata mesajını mutation UI akışına sunar. */
  readonly saveError = this.store.selectSignal(selectSaveError);

  /** Notes collection lifecycle durumunu signal olarak sunar. */
  readonly notesStatus = this.store.selectSignal(selectNotesStatus);

  /** Normalize note listesini dictionary detail sayfasına sunar. */
  readonly notes = this.store.selectSignal(selectNotes);

  /** Notes collection loading durumunu sunar. */
  readonly areNotesLoading = this.store.selectSignal(selectAreNotesLoading);

  /** Notes collection API hata mesajını sunar. */
  readonly notesError = this.store.selectSignal(selectNotesError);

  /** Note mutation lifecycle durumunu editor ve delete dialoglarına sunar. */
  readonly noteMutationStatus = this.store.selectSignal(selectNoteMutationStatus);

  /** Note mutation tekrar submit kontrolü için loading durumunu sunar. */
  readonly isNoteMutating = this.store.selectSignal(selectIsNoteMutating);

  /** Normalize note mutation hata mesajını dialoglara sunar. */
  readonly noteMutationError = this.store.selectSignal(selectNoteMutationError);

  /** Flags collection lifecycle durumunu signal olarak sunar. */
  readonly flagsStatus = this.store.selectSignal(selectFlagsStatus);

  /** Flags collection loading durumunu detail paneline sunar. */
  readonly areFlagsLoading = this.store.selectSignal(selectAreFlagsLoading);

  /** Flags collection API hata mesajını detail paneline sunar. */
  readonly flagsError = this.store.selectSignal(selectFlagsError);

  /** Gerçek flags collection içindeki Favorite durumunu sunar. */
  readonly hasFavoriteFlag = this.store.selectSignal(selectHasFavoriteFlag);

  /** Gerçek flags collection içindeki Difficult durumunu sunar. */
  readonly hasDifficultFlag = this.store.selectSignal(selectHasDifficultFlag);

  /** Flag mutation lifecycle durumunu toggle UI'a sunar. */
  readonly flagMutationStatus = this.store.selectSignal(selectFlagMutationStatus);

  /** Flag mutation loading durumunu tekrar tıklama kontrolüne sunar. */
  readonly isFlagMutating = this.store.selectSignal(selectIsFlagMutating);

  /** Flag mutation API hata mesajını panelde gösterir. */
  readonly flagMutationError = this.store.selectSignal(selectFlagMutationError);

  /** Loading göstergesinin yalnızca mutation hedefinde görünmesini sağlar. */
  readonly mutatingFlagType = this.store.selectSignal(selectMutatingFlagType);

  /** Authenticated kullanıcının dictionary collection yüklemesini başlatır. */
  loadCollection(): void {
    this.store.dispatch(DictionaryActions.loadCollection());
  }

  /** Canonical userLearningItemId ile dictionary detail yüklemesini başlatır. */
  loadDetail(userLearningItemId: string): void {
    this.store.dispatch(DictionaryActions.loadDetail({ userLearningItemId }));
  }

  /** Word/phrase save requestini gerçek dictionary mutation effectine gönderir. */
  saveLearningItem(request: SaveLearningItemRequest): void {
    this.store.dispatch(DictionaryActions.saveLearningItem({ request }));
  }

  /** Sentence save requestini kendine ait gerçek mutation effectine gönderir. */
  saveSentence(request: SaveSentenceToDictionaryRequest): void {
    this.store.dispatch(DictionaryActions.saveSentence({ request }));
  }

  /** Dictionary itemın gerçek notes collection yüklemesini başlatır. */
  loadNotes(userLearningItemId: string): void {
    this.store.dispatch(DictionaryActions.loadNotes({ userLearningItemId }));
  }

  /** Boş olmayan not metnini gerçek create effectine gönderir. */
  createNote(userLearningItemId: string, request: SaveDictionaryNoteRequest): void {
    this.store.dispatch(DictionaryActions.createNote({ userLearningItemId, request }));
  }

  /** Mevcut notun yeni metnini gerçek update effectine gönderir. */
  updateNote(noteId: string, request: SaveDictionaryNoteRequest): void {
    this.store.dispatch(DictionaryActions.updateNote({ noteId, request }));
  }

  /** Seçilen notu gerçek delete effectine gönderir. */
  deleteNote(noteId: string): void {
    this.store.dispatch(DictionaryActions.deleteNote({ noteId }));
  }

  /** Dictionary itemın gerçek flags collection yüklemesini başlatır. */
  loadFlags(userLearningItemId: string): void {
    this.store.dispatch(DictionaryActions.loadFlags({ userLearningItemId }));
  }

  /** Canonical Favorite veya Difficult flag değerini gerçek set effectine gönderir. */
  setFlag(userLearningItemId: string, flagType: EditableDictionaryFlagType): void {
    this.store.dispatch(DictionaryActions.setFlag({ userLearningItemId, flagType }));
  }

  /** Canonical Favorite veya Difficult flag değerini gerçek remove effectine gönderir. */
  removeFlag(userLearningItemId: string, flagType: EditableDictionaryFlagType): void {
    this.store.dispatch(DictionaryActions.removeFlag({ userLearningItemId, flagType }));
  }

  /** Route değişiminde yalnızca detail state'ini başlangıç durumuna döndürür. */
  clearDetail(): void {
    this.store.dispatch(DictionaryActions.clearDetail());
  }

  /** Detail route kapanırken notes collection ve mutation state'ini temizler. */
  clearNotes(): void {
    this.store.dispatch(DictionaryActions.clearNotes());
  }

  /** Yeni dialog niyetinde eski note mutation result ve hatasını temizler. */
  clearNoteMutationState(): void {
    this.store.dispatch(DictionaryActions.clearNoteMutationState());
  }

  /** Detail route kapanırken flags collection ve mutation state'ini temizler. */
  clearFlags(): void {
    this.store.dispatch(DictionaryActions.clearFlags());
  }

  /** Yeni flag niyetinden önce eski mutation hatasını temizler. */
  clearFlagMutationState(): void {
    this.store.dispatch(DictionaryActions.clearFlagMutationState());
  }

  /** Yeni mutation öncesinde yalnızca save result ve error state'ini temizler. */
  clearSaveState(): void {
    this.store.dispatch(DictionaryActions.clearSaveState());
  }

  /** Logout veya feature teardown için tüm dictionary state'ini temizler. */
  clear(): void {
    this.store.dispatch(DictionaryActions.clear());
  }
}
