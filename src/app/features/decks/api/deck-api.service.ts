/** Bu dosya, canlı Swagger'daki deck endpointlerinin gerçek HTTP entegrasyonunu yönetir. */
import { Injectable } from '@angular/core';
import { WordixApiService } from '@core/http/wordix-api.service';
import { Observable } from 'rxjs';

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
export class DeckApiService extends WordixApiService {
  /** Authenticated kullanıcının deck collection payloadını gerçek endpointten getirir. */
  getMyDecks(): Observable<GetMyDecksResponseDto> {
    // Ownership parametresi eklemeden collection payloadını merkezi GET adaptöründen alır.
    return this.getData<GetMyDecksResponseDto>('decks');
  }

  /** Canonical deck UUID değeriyle tek deck detail payloadını getirir. */
  getById(deckId: string): Observable<DeckDetailResponseDto> {
    // Deck kimliğini path segmentine eklemeden önce güvenli URL encoding uygular.
    const encodedId = encodeURIComponent(deckId);

    // Detail response zarfını feature katmanına sızdırmadan merkezi adaptörden döndürür.
    return this.getData<DeckDetailResponseDto>(`decks/${encodedId}`);
  }

  /** Ownership alanı olmadan yeni deck'i gerçek create endpointinde oluşturur. */
  createDeck(request: CreateDeckRequest): Observable<CreateDeckResponseDto> {
    // Yalnızca Swagger create DTO alanlarını merkezi POST adaptörüne iletir.
    return this.postData<CreateDeckRequest, CreateDeckResponseDto>('decks', request);
  }

  /** Mevcut dictionary itemını canonical deck UUID altındaki gerçek add endpointine gönderir. */
  addItem(deckId: string, request: AddItemToDeckRequest): Observable<AddItemToDeckResponseDto> {
    // Deck kimliğini nested route segmentine eklemeden önce güvenli URL encoding uygular.
    const encodedId = encodeURIComponent(deckId);

    // Dictionary item requestini ownership alanı eklemeden gerçek add endpointine gönderir.
    return this.postData<AddItemToDeckRequest, AddItemToDeckResponseDto>(
      `decks/${encodedId}/items`,
      request,
    );
  }

  /** Dictionary itemını iki canonical UUID kullanan gerçek remove endpointinden kaldırır. */
  removeItem(
    deckId: string,
    userLearningItemId: string,
  ): Observable<RemoveItemFromDeckResponseDto> {
    // Her iki route kimliğini path segmentlerine eklemeden önce ayrı ayrı encode eder.
    const encodedDeckId = encodeURIComponent(deckId);
    const encodedItemId = encodeURIComponent(userLearningItemId);

    // Body göndermeyen DELETE operasyonunu merkezi Wordix adaptörü üzerinden çalıştırır.
    return this.deleteData<RemoveItemFromDeckResponseDto>(
      `decks/${encodedDeckId}/items/${encodedItemId}`,
    );
  }
}
