/** Bu dosya, canlı Swagger'daki deck endpointlerinin gerçek HTTP entegrasyonunu yönetir. */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppConfigService } from '@core/config/app-config.service';
import { unwrapApiResponse } from '@core/http/api-response.mapper';
import { ApiResponse } from '@core/http/models/api-response.model';
import { map, Observable } from 'rxjs';

import {
  AddItemToDeckResponseDto,
  CreateDeckResponseDto,
  DeckDetailResponseDto,
  GetMyDecksResponseDto,
  RemoveItemFromDeckResponseDto,
} from '../models/deck-api.models';
import { AddItemToDeckRequest, CreateDeckRequest } from '../models/deck-request.models';

/** Deck endpointlerini component ve state katmanından izole eden feature API servisidir. */
@Injectable()
export class DeckApiService {
  /** Interceptor zincirini kullanan Angular HTTP client üzerinden protected request gönderir. */
  private readonly httpClient = inject(HttpClient);

  /** Environment bazlı Wordix API adresini merkezi config servisinden okur. */
  private readonly apiBaseUrl = inject(AppConfigService).apiBaseUrl.replace(/\/+$/, '');

  /** Authenticated kullanıcının deck collection payloadını gerçek endpointten getirir. */
  getMyDecks(): Observable<GetMyDecksResponseDto> {
    return this.httpClient
      .get<ApiResponse<GetMyDecksResponseDto>>(`${this.apiBaseUrl}/decks`)
      .pipe(map(unwrapApiResponse));
  }

  /** Canonical deck UUID değeriyle tek deck detail payloadını getirir. */
  getById(deckId: string): Observable<DeckDetailResponseDto> {
    const encodedId = encodeURIComponent(deckId);
    return this.httpClient
      .get<ApiResponse<DeckDetailResponseDto>>(`${this.apiBaseUrl}/decks/${encodedId}`)
      .pipe(map(unwrapApiResponse));
  }

  /** Ownership alanı olmadan yeni deck'i gerçek create endpointinde oluşturur. */
  createDeck(request: CreateDeckRequest): Observable<CreateDeckResponseDto> {
    return this.httpClient
      .post<ApiResponse<CreateDeckResponseDto>>(`${this.apiBaseUrl}/decks`, request)
      .pipe(map(unwrapApiResponse));
  }

  /** Mevcut dictionary itemını canonical deck UUID altındaki gerçek add endpointine gönderir. */
  addItem(deckId: string, request: AddItemToDeckRequest): Observable<AddItemToDeckResponseDto> {
    const encodedId = encodeURIComponent(deckId);
    return this.httpClient
      .post<ApiResponse<AddItemToDeckResponseDto>>(
        `${this.apiBaseUrl}/decks/${encodedId}/items`,
        request,
      )
      .pipe(map(unwrapApiResponse));
  }

  /** Dictionary itemını iki canonical UUID kullanan gerçek remove endpointinden kaldırır. */
  removeItem(
    deckId: string,
    userLearningItemId: string,
  ): Observable<RemoveItemFromDeckResponseDto> {
    const encodedDeckId = encodeURIComponent(deckId);
    const encodedItemId = encodeURIComponent(userLearningItemId);
    return this.httpClient
      .delete<ApiResponse<RemoveItemFromDeckResponseDto>>(
        `${this.apiBaseUrl}/decks/${encodedDeckId}/items/${encodedItemId}`,
      )
      .pipe(map(unwrapApiResponse));
  }
}
