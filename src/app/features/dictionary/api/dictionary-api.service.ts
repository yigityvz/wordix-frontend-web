/** Bu dosya, user dictionary ve notes endpointlerinin gerçek HTTP entegrasyonunu yönetir. */
import { Injectable } from '@angular/core';
import { WordixApiService } from '@core/http/wordix-api.service';
import { Observable } from 'rxjs';

import {
  GetMyDictionaryResponseDto,
  GetUserLearningNotesResponseDto,
  GetUserLearningFlagsResponseDto,
  SaveLearningItemResponseDto,
  SaveSentenceToDictionaryResponseDto,
  UserDictionaryItemResponseDto,
  UserLearningNoteResponseDto,
  UserLearningFlagResponseDto,
} from '../models/dictionary-api.models';
import {
  SaveDictionaryNoteRequest,
  EditableDictionaryFlagType,
  SetDictionaryFlagRequest,
  SaveLearningItemRequest,
  SaveSentenceToDictionaryRequest,
} from '../models/dictionary-request.models';

/** Dictionary endpointlerini component ve state katmanından izole eden feature API servisidir. */
@Injectable()
export class DictionaryApiService extends WordixApiService {
  /** Authenticated kullanıcının tüm dictionary collection payloadını gerçek endpointten getirir. */
  getMyDictionary(): Observable<GetMyDictionaryResponseDto> {
    // Ownership parametresi eklemeden collection payloadını merkezi GET adaptöründen alır.
    return this.getData<GetMyDictionaryResponseDto>('user-dictionary');
  }

  /** Canonical userLearningItem route kimliğiyle tek dictionary item detayını getirir. */
  getById(userLearningItemId: string): Observable<UserDictionaryItemResponseDto> {
    // Learning item kimliğini route segmentine eklemeden önce güvenli URL encoding uygular.
    const encodedId = encodeURIComponent(userLearningItemId);

    // Detail response zarfını feature katmanına sızdırmadan merkezi adaptörden döndürür.
    return this.getData<UserDictionaryItemResponseDto>(`user-dictionary/${encodedId}`);
  }

  /** Word veya phrase learning item'ını mevcut tek selectedMeaningId sözleşmesiyle kaydeder. */
  saveLearningItem(request: SaveLearningItemRequest): Observable<SaveLearningItemResponseDto> {
    // Swagger save DTO'sunu ownership alanı eklemeden merkezi POST adaptörüne iletir.
    return this.postData<SaveLearningItemRequest, SaveLearningItemResponseDto>(
      'user-dictionary',
      request,
    );
  }

  /** Sentence sonucunu kendine ait gerçek dictionary save endpointiyle kaydeder. */
  saveSentence(
    request: SaveSentenceToDictionaryRequest,
  ): Observable<SaveSentenceToDictionaryResponseDto> {
    // Sentence requestini word/phrase kaydından ayrı canonical endpointine gönderir.
    return this.postData<SaveSentenceToDictionaryRequest, SaveSentenceToDictionaryResponseDto>(
      'user-dictionary/sentences',
      request,
    );
  }

  /** Bir dictionary itemına ait notları ownership alanı göndermeden gerçek endpointten getirir. */
  getNotes(userLearningItemId: string): Observable<GetUserLearningNotesResponseDto> {
    // Learning item kimliğini nested notes route'una eklemeden önce encode eder.
    const encodedId = encodeURIComponent(userLearningItemId);

    // Note collection payloadını merkezi GET ve response unwrap davranışıyla alır.
    return this.getData<GetUserLearningNotesResponseDto>(`user-dictionary/${encodedId}/notes`);
  }

  /** Dictionary itemına yeni notu canlı create endpointiyle ekler. */
  createNote(
    userLearningItemId: string,
    request: SaveDictionaryNoteRequest,
  ): Observable<UserLearningNoteResponseDto> {
    // Learning item kimliğini nested notes route'una eklemeden önce encode eder.
    const encodedId = encodeURIComponent(userLearningItemId);

    // Note create DTO'sunu merkezi POST adaptörü üzerinden gerçek endpointine gönderir.
    return this.postData<SaveDictionaryNoteRequest, UserLearningNoteResponseDto>(
      `user-dictionary/${encodedId}/notes`,
      request,
    );
  }

  /** Mevcut not metnini note UUID kullanan canlı update endpointiyle değiştirir. */
  updateNote(
    noteId: string,
    request: SaveDictionaryNoteRequest,
  ): Observable<UserLearningNoteResponseDto> {
    // Note kimliğini update route segmentine eklemeden önce encode eder.
    const encodedId = encodeURIComponent(noteId);

    // Note update DTO'sunu merkezi PUT adaptörü üzerinden gerçek endpointine gönderir.
    return this.putData<SaveDictionaryNoteRequest, UserLearningNoteResponseDto>(
      `user-dictionary/notes/${encodedId}`,
      request,
    );
  }

  /** Notu note UUID kullanan canlı delete endpointinden siler ve backend sonucunu döndürür. */
  deleteNote(noteId: string): Observable<UserLearningNoteResponseDto> {
    // Note kimliğini delete route segmentine eklemeden önce encode eder.
    const encodedId = encodeURIComponent(noteId);

    // Body göndermeyen DELETE operasyonunu merkezi Wordix adaptörü üzerinden çalıştırır.
    return this.deleteData<UserLearningNoteResponseDto>(`user-dictionary/notes/${encodedId}`);
  }

  /** Bir dictionary itemına ait flag kayıtlarını gerçek collection endpointinden getirir. */
  getFlags(userLearningItemId: string): Observable<GetUserLearningFlagsResponseDto> {
    // Learning item kimliğini nested flags route'una eklemeden önce encode eder.
    const encodedId = encodeURIComponent(userLearningItemId);

    // Flag collection payloadını merkezi GET ve response unwrap davranışıyla alır.
    return this.getData<GetUserLearningFlagsResponseDto>(`user-dictionary/${encodedId}/flags`);
  }

  /** Canonical Favorite veya Difficult flag değerini idempotent backend set endpointine gönderir. */
  setFlag(
    userLearningItemId: string,
    request: SetDictionaryFlagRequest,
  ): Observable<UserLearningFlagResponseDto> {
    // Learning item kimliğini nested flags route'una eklemeden önce encode eder.
    const encodedId = encodeURIComponent(userLearningItemId);

    // Canonical flag DTO'sunu merkezi POST adaptörü üzerinden idempotent endpointine gönderir.
    return this.postData<SetDictionaryFlagRequest, UserLearningFlagResponseDto>(
      `user-dictionary/${encodedId}/flags`,
      request,
    );
  }

  /** Canonical flag tipini dictionary itemın gerçek delete route'undan kaldırır. */
  removeFlag(
    userLearningItemId: string,
    flagType: EditableDictionaryFlagType,
  ): Observable<UserLearningFlagResponseDto> {
    // Learning item kimliği ve canonical flag tipi route için ayrı ayrı encode edilir.
    const encodedItemId = encodeURIComponent(userLearningItemId);
    const encodedFlagType = encodeURIComponent(flagType);

    // Body göndermeyen flag DELETE operasyonunu merkezi adaptör üzerinden çalıştırır.
    return this.deleteData<UserLearningFlagResponseDto>(
      `user-dictionary/${encodedItemId}/flags/${encodedFlagType}`,
    );
  }
}
