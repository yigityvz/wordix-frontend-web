/** Bu dosya, user dictionary ve notes endpointlerinin gerçek HTTP entegrasyonunu yönetir. */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppConfigService } from '@core/config/app-config.service';
import { unwrapApiResponse } from '@core/http/api-response.mapper';
import { ApiResponse } from '@core/http/models/api-response.model';
import { map, Observable } from 'rxjs';

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
export class DictionaryApiService {
  /** Interceptor zincirini kullanan Angular HTTP client üzerinden protected request gönderir. */
  private readonly httpClient = inject(HttpClient);

  /** Environment bazlı Wordix API adresini merkezi config servisinden okur. */
  private readonly apiBaseUrl = inject(AppConfigService).apiBaseUrl.replace(/\/+$/, '');

  /** Authenticated kullanıcının tüm dictionary collection payloadını gerçek endpointten getirir. */
  getMyDictionary(): Observable<GetMyDictionaryResponseDto> {
    return this.httpClient
      .get<ApiResponse<GetMyDictionaryResponseDto>>(`${this.apiBaseUrl}/user-dictionary`)
      .pipe(map(unwrapApiResponse));
  }

  /** Canonical userLearningItem route kimliğiyle tek dictionary item detayını getirir. */
  getById(userLearningItemId: string): Observable<UserDictionaryItemResponseDto> {
    const encodedId = encodeURIComponent(userLearningItemId);
    return this.httpClient
      .get<ApiResponse<UserDictionaryItemResponseDto>>(
        `${this.apiBaseUrl}/user-dictionary/${encodedId}`,
      )
      .pipe(map(unwrapApiResponse));
  }

  /** Word veya phrase learning item'ını mevcut tek selectedMeaningId sözleşmesiyle kaydeder. */
  saveLearningItem(request: SaveLearningItemRequest): Observable<SaveLearningItemResponseDto> {
    return this.httpClient
      .post<ApiResponse<SaveLearningItemResponseDto>>(`${this.apiBaseUrl}/user-dictionary`, request)
      .pipe(map(unwrapApiResponse));
  }

  /** Sentence sonucunu kendine ait gerçek dictionary save endpointiyle kaydeder. */
  saveSentence(
    request: SaveSentenceToDictionaryRequest,
  ): Observable<SaveSentenceToDictionaryResponseDto> {
    return this.httpClient
      .post<ApiResponse<SaveSentenceToDictionaryResponseDto>>(
        `${this.apiBaseUrl}/user-dictionary/sentences`,
        request,
      )
      .pipe(map(unwrapApiResponse));
  }

  /** Bir dictionary itemına ait notları ownership alanı göndermeden gerçek endpointten getirir. */
  getNotes(userLearningItemId: string): Observable<GetUserLearningNotesResponseDto> {
    const encodedId = encodeURIComponent(userLearningItemId);
    return this.httpClient
      .get<ApiResponse<GetUserLearningNotesResponseDto>>(
        `${this.apiBaseUrl}/user-dictionary/${encodedId}/notes`,
      )
      .pipe(map(unwrapApiResponse));
  }

  /** Dictionary itemına yeni notu canlı create endpointiyle ekler. */
  createNote(
    userLearningItemId: string,
    request: SaveDictionaryNoteRequest,
  ): Observable<UserLearningNoteResponseDto> {
    const encodedId = encodeURIComponent(userLearningItemId);
    return this.httpClient
      .post<ApiResponse<UserLearningNoteResponseDto>>(
        `${this.apiBaseUrl}/user-dictionary/${encodedId}/notes`,
        request,
      )
      .pipe(map(unwrapApiResponse));
  }

  /** Mevcut not metnini note UUID kullanan canlı update endpointiyle değiştirir. */
  updateNote(
    noteId: string,
    request: SaveDictionaryNoteRequest,
  ): Observable<UserLearningNoteResponseDto> {
    const encodedId = encodeURIComponent(noteId);
    return this.httpClient
      .put<ApiResponse<UserLearningNoteResponseDto>>(
        `${this.apiBaseUrl}/user-dictionary/notes/${encodedId}`,
        request,
      )
      .pipe(map(unwrapApiResponse));
  }

  /** Notu note UUID kullanan canlı delete endpointinden siler ve backend sonucunu döndürür. */
  deleteNote(noteId: string): Observable<UserLearningNoteResponseDto> {
    const encodedId = encodeURIComponent(noteId);
    return this.httpClient
      .delete<ApiResponse<UserLearningNoteResponseDto>>(
        `${this.apiBaseUrl}/user-dictionary/notes/${encodedId}`,
      )
      .pipe(map(unwrapApiResponse));
  }

  /** Bir dictionary itemına ait flag kayıtlarını gerçek collection endpointinden getirir. */
  getFlags(userLearningItemId: string): Observable<GetUserLearningFlagsResponseDto> {
    const encodedId = encodeURIComponent(userLearningItemId);
    return this.httpClient
      .get<ApiResponse<GetUserLearningFlagsResponseDto>>(
        `${this.apiBaseUrl}/user-dictionary/${encodedId}/flags`,
      )
      .pipe(map(unwrapApiResponse));
  }

  /** Canonical Favorite veya Difficult flag değerini idempotent backend set endpointine gönderir. */
  setFlag(
    userLearningItemId: string,
    request: SetDictionaryFlagRequest,
  ): Observable<UserLearningFlagResponseDto> {
    const encodedId = encodeURIComponent(userLearningItemId);
    return this.httpClient
      .post<ApiResponse<UserLearningFlagResponseDto>>(
        `${this.apiBaseUrl}/user-dictionary/${encodedId}/flags`,
        request,
      )
      .pipe(map(unwrapApiResponse));
  }

  /** Canonical flag tipini dictionary itemın gerçek delete route'undan kaldırır. */
  removeFlag(
    userLearningItemId: string,
    flagType: EditableDictionaryFlagType,
  ): Observable<UserLearningFlagResponseDto> {
    const encodedItemId = encodeURIComponent(userLearningItemId);
    const encodedFlagType = encodeURIComponent(flagType);
    return this.httpClient
      .delete<ApiResponse<UserLearningFlagResponseDto>>(
        `${this.apiBaseUrl}/user-dictionary/${encodedItemId}/flags/${encodedFlagType}`,
      )
      .pipe(map(unwrapApiResponse));
  }
}
