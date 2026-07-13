/** Bu dosya, route kimliğini gerçek deck detail state'i ve salt-okunur item listesiyle birleştirir. */
import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Card } from '@shared/components/card/card';
import { Button } from '@shared/components/button/button';
import { EmptyState } from '@shared/components/empty-state/empty-state';
import { ErrorState } from '@shared/components/error-state/error-state';
import { Spinner } from '@shared/components/spinner/spinner';
import { Modal } from '@shared/components/modal/modal';

import { DeckItemCard } from '../../components/deck-item-card/deck-item-card';
import { DeckFacade } from '../../facades/deck.facade';
import { DeckItem } from '../../models/deck.models';

/** Canonical UUID route değerinin temel biçimini backend çağrısından önce doğrular. */
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Route açılışında tek deck'i yükleyen ve gerçek detail alanlarını sunan sayfadır. */
@Component({
  selector: 'wx-deck-detail-page',
  imports: [
    Button,
    Card,
    DatePipe,
    DeckItemCard,
    EmptyState,
    ErrorState,
    Modal,
    RouterLink,
    Spinner,
  ],
  templateUrl: './deck-detail-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeckDetailPage implements OnInit, OnDestroy {
  /** Canonical deckId route parametresini okur. */
  private readonly route = inject(ActivatedRoute);

  /** Detail action ve state erişimini tek facade üzerinden sağlar. */
  private readonly deckFacade = inject(DeckFacade);

  /** Snapshot route kimliğini sayfa lifecycle boyunca kararlı tutar. */
  private readonly deckId = this.route.snapshot.paramMap.get('deckId');

  /** Geçersiz route kimliğini API çağrısı yapmadan güvenli UI hatasına dönüştürür. */
  protected readonly routeError = signal<string | null>(null);

  /** Mapper tarafından normalize edilmiş gerçek deck detail modelini template'e sunar. */
  protected readonly deck = this.deckFacade.selectedDeck;

  /** Gerçek detail request loading durumunu sayfa iskeletine bağlar. */
  protected readonly isLoading = this.deckFacade.isDetailLoading;

  /** Merkezi normalize API hata mesajını recoverable detail error state'e bağlar. */
  protected readonly error = this.deckFacade.detailError;

  /** Remove onayı bekleyen gerçek deck itemını local dialog state olarak tutar. */
  protected readonly removeTarget = signal<DeckItem | null>(null);

  /** Gerçek remove endpoint mutation loading durumunu confirm dialoguna bağlar. */
  protected readonly isRemoving = this.deckFacade.isItemMutating;

  /** Normalize remove mutation hatasını confirm dialogunda görünür tutar. */
  protected readonly removeError = this.deckFacade.itemMutationError;

  /** Gerçek remove cevabını açık confirm hedefiyle eşleştiren lifecycle izlemeyi kurar. */
  constructor() {
    // Backend remove cevabı açık hedefle eşleştiğinde confirm dialogu güvenli biçimde kapatılır.
    effect(() => {
      const target = this.removeTarget();
      const removed = this.deckFacade.removedItem();
      if (
        target &&
        this.deckFacade.itemMutationStatus() === 'loaded' &&
        removed?.removed &&
        removed.userLearningItemId === target.userLearningItemId
      ) {
        this.closeRemoveDialog();
      }
    });
  }

  /** Route ilk açıldığında geçerli canonical kimlikle gerçek detail isteğini başlatır. */
  ngOnInit(): void {
    if (!this.deckId || !UUID_PATTERN.test(this.deckId)) {
      this.routeError.set('The deck address is not valid.');
      return;
    }

    this.deckFacade.loadDetail(this.deckId);
  }

  /** Route kapanırken eski detail verisinin sonraki deck'te görünmesini engeller. */
  ngOnDestroy(): void {
    this.deckFacade.clearDetail();
  }

  /** Recoverable API hatasında aynı canonical kimlikle gerçek detail isteğini tekrarlar. */
  protected retryDetail(): void {
    if (this.deckId && UUID_PATTERN.test(this.deckId)) {
      this.deckFacade.loadDetail(this.deckId);
    }
  }

  /** Seçilen itemı kullanıcı onayı alınacak dialog hedefi olarak açar. */
  protected openRemoveDialog(item: DeckItem): void {
    this.deckFacade.clearItemMutationState();
    this.removeTarget.set(item);
  }

  /** Onaylanan itemı canonical deck ve dictionary item kimlikleriyle gerçek remove endpointine yollar. */
  protected confirmRemove(): void {
    const target = this.removeTarget();
    if (this.deckId && target && !this.deckFacade.isItemMutating()) {
      this.deckFacade.clearItemMutationState();
      this.deckFacade.removeItem(this.deckId, target.userLearningItemId);
    }
  }

  /** Mutation sürmüyorsa remove dialogunu ve eski mutation state'ini temizler. */
  protected closeRemoveDialog(): void {
    if (this.deckFacade.isItemMutating()) {
      return;
    }

    this.removeTarget.set(null);
    this.deckFacade.clearItemMutationState();
  }
}
