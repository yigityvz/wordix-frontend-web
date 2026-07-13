/** Bu dosya, deck page ve birleşik item akışlarına NgRx ayrıntısı göstermeden state ve intent sunar. */
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AddItemToDeckRequest, CreateDeckRequest } from '../models/deck-request.models';
import { DeckActions } from '../store/deck.actions';
import {
  selectAddedItem,
  selectCollectionError,
  selectCollectionStatus,
  selectCreatedDeck,
  selectCreateError,
  selectCreateStatus,
  selectDecks,
  selectDetailError,
  selectDetailStatus,
  selectIsCollectionLoading,
  selectIsCreating,
  selectIsDetailLoading,
  selectIsItemMutating,
  selectItemMutationError,
  selectItemMutationStatus,
  selectLastMutatedDeckId,
  selectRemovedItem,
  selectSelectedDeck,
  selectTotalCount,
} from '../store/deck.selectors';

/** Deck feature componentlerinin kullanacağı tek state ve action köprüsüdür. */
@Injectable()
export class DeckFacade {
  /** Deck feature state action ve selector erişimini sağlar. */
  private readonly store = inject(Store);

  /** Collection lifecycle durumunu signal olarak sunar. */
  readonly collectionStatus = this.store.selectSignal(selectCollectionStatus);

  /** Normalize deck listesini signal olarak sunar. */
  readonly decks = this.store.selectSignal(selectDecks);

  /** Backend collection total count değerini signal olarak sunar. */
  readonly totalCount = this.store.selectSignal(selectTotalCount);

  /** Collection loading durumunu liste ve seçim UI'larına sunar. */
  readonly isCollectionLoading = this.store.selectSignal(selectIsCollectionLoading);

  /** Collection API hata mesajını recoverable UI state'e sunar. */
  readonly collectionError = this.store.selectSignal(selectCollectionError);

  /** Detail lifecycle durumunu signal olarak sunar. */
  readonly detailStatus = this.store.selectSignal(selectDetailStatus);

  /** Seçili deck detail modelini signal olarak sunar. */
  readonly selectedDeck = this.store.selectSignal(selectSelectedDeck);

  /** Detail loading durumunu sayfa iskeletine sunar. */
  readonly isDetailLoading = this.store.selectSignal(selectIsDetailLoading);

  /** Detail API hata mesajını recoverable UI state'e sunar. */
  readonly detailError = this.store.selectSignal(selectDetailError);

  /** Create mutation lifecycle durumunu dialog akışına sunar. */
  readonly createStatus = this.store.selectSignal(selectCreateStatus);

  /** Create tekrar submit kontrolü için loading durumunu sunar. */
  readonly isCreating = this.store.selectSignal(selectIsCreating);

  /** Son gerçek create sonucunu signal olarak sunar. */
  readonly createdDeck = this.store.selectSignal(selectCreatedDeck);

  /** Normalize create hata mesajını dialog akışına sunar. */
  readonly createError = this.store.selectSignal(selectCreateError);

  /** Item add/remove mutation lifecycle durumunu birleşik akışlara sunar. */
  readonly itemMutationStatus = this.store.selectSignal(selectItemMutationStatus);

  /** Item mutation tekrar submit kontrolü için loading durumunu sunar. */
  readonly isItemMutating = this.store.selectSignal(selectIsItemMutating);

  /** Son gerçek item add sonucunu signal olarak sunar. */
  readonly addedItem = this.store.selectSignal(selectAddedItem);

  /** Son gerçek item remove sonucunu signal olarak sunar. */
  readonly removedItem = this.store.selectSignal(selectRemovedItem);

  /** Son item mutation sonucundaki canonical deck UUID değerini sunar. */
  readonly lastMutatedDeckId = this.store.selectSignal(selectLastMutatedDeckId);

  /** Normalize item mutation hata mesajını UI akışına sunar. */
  readonly itemMutationError = this.store.selectSignal(selectItemMutationError);

  /** Authenticated kullanıcının deck collection yüklemesini başlatır. */
  loadCollection(): void {
    this.store.dispatch(DeckActions.loadCollection());
  }

  /** Canonical deck UUID ile gerçek detail yüklemesini başlatır. */
  loadDetail(deckId: string): void {
    this.store.dispatch(DeckActions.loadDetail({ deckId }));
  }

  /** Yeni deck requestini gerçek create effectine gönderir. */
  createDeck(request: CreateDeckRequest): void {
    this.store.dispatch(DeckActions.createDeck({ request }));
  }

  /** Dictionary itemını seçilen deck'in gerçek add effectine gönderir. */
  addItem(deckId: string, request: AddItemToDeckRequest): void {
    this.store.dispatch(DeckActions.addItem({ deckId, request }));
  }

  /** Dictionary itemını seçilen deck'in gerçek remove effectine gönderir. */
  removeItem(deckId: string, userLearningItemId: string): void {
    this.store.dispatch(DeckActions.removeItem({ deckId, userLearningItemId }));
  }

  /** Route değişiminde yalnızca detail state'ini başlangıç durumuna döndürür. */
  clearDetail(): void {
    this.store.dispatch(DeckActions.clearDetail());
  }

  /** Yeni create mutationı öncesinde result ve error state'ini temizler. */
  clearCreateState(): void {
    this.store.dispatch(DeckActions.clearCreateState());
  }

  /** Yeni item mutationı öncesinde add/remove result ve error state'ini temizler. */
  clearItemMutationState(): void {
    this.store.dispatch(DeckActions.clearItemMutationState());
  }

  /** Logout veya feature teardown için tüm deck state'ini temizler. */
  clear(): void {
    this.store.dispatch(DeckActions.clear());
  }
}
