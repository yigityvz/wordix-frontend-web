/** Bu dosya, gerçek deck collection state'ini create dialogu ve local aramayla birleştirir. */
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from '@shared/components/button/button';
import { Card } from '@shared/components/card/card';
import { EmptyState } from '@shared/components/empty-state/empty-state';
import { ErrorState } from '@shared/components/error-state/error-state';
import { Spinner } from '@shared/components/spinner/spinner';

import { CreateDeckDialog } from '../../components/create-deck-dialog/create-deck-dialog';
import { DeckCard } from '../../components/deck-card/deck-card';
import { DeckFacade } from '../../facades/deck.facade';
import { CreateDeckRequest } from '../../models/deck-request.models';
import { DeckSummary } from '../../models/deck.models';

/** Route açılışında collection yükleyen ve gerçek create mutationını yöneten liste sayfasıdır. */
@Component({
  selector: 'wx-deck-list-page',
  imports: [Button, Card, CreateDeckDialog, DeckCard, EmptyState, ErrorState, RouterLink, Spinner],
  templateUrl: './deck-list-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeckListPage implements OnInit {
  /** Deck NgRx state ve intent erişimini tek facade üzerinden sağlar. */
  private readonly deckFacade = inject(DeckFacade);

  /** Gerçek backend collection decklerini template'e sunar. */
  protected readonly decks = this.deckFacade.decks;

  /** Backend total count değerini sayfa özetine sunar. */
  protected readonly totalCount = this.deckFacade.totalCount;

  /** Collection lifecycle loading durumunu sayfa iskeletine bağlar. */
  protected readonly isLoading = this.deckFacade.isCollectionLoading;

  /** Normalize collection API hata mesajını recoverable state'e bağlar. */
  protected readonly error = this.deckFacade.collectionError;

  /** Create mutation loading durumunu dialog submit kontrolüne bağlar. */
  protected readonly isCreating = this.deckFacade.isCreating;

  /** Normalize create API hata mesajını dialog formuna bağlar. */
  protected readonly createError = this.deckFacade.createError;

  /** Create mutation lifecycle durumunu başarılı dialog kapanışı için izler. */
  private readonly createStatus = this.deckFacade.createStatus;

  /** Kullanıcı aramasını yalnızca yüklenmiş deck listesi üzerinde tutar. */
  protected readonly query = signal('');

  /** Create dialogunun görünürlüğünü page-local UI state olarak tutar. */
  protected readonly createDialogOpen = signal(false);

  /** Backend decklerini güncel local query değerine göre mutation yapmadan filtreler. */
  protected readonly visibleDecks = computed(() => filterDecks(this.decks(), this.query()));

  constructor() {
    // Başarılı gerçek create responseundan sonra açık dialog otomatik kapatılır.
    effect(() => {
      if (this.createStatus() === 'loaded') {
        this.createDialogOpen.set(false);
      }
    });
  }

  /** Route ilk açıldığında authenticated kullanıcının gerçek deck collectionını ister. */
  ngOnInit(): void {
    this.deckFacade.loadCollection();
  }

  /** Hata yüzeyindeki retry aksiyonunu aynı gerçek GET isteğine bağlar. */
  protected retryCollection(): void {
    this.deckFacade.loadCollection();
  }

  /** Search inputundan gelen controlled değeri local query state'e yazar. */
  protected updateQuery(value: string): void {
    this.query.set(value);
  }

  /** Eski create mutation stateini temizleyip yeni create dialogunu açar. */
  protected openCreateDialog(): void {
    this.deckFacade.clearCreateState();
    this.createDialogOpen.set(true);
  }

  /** Mutation sürmezken create dialogunu parent stateinden kapatır. */
  protected closeCreateDialog(): void {
    if (!this.isCreating()) {
      this.createDialogOpen.set(false);
    }
  }

  /** Validate edilmiş create requestini gerçek deck effectine gönderir. */
  protected createDeck(request: CreateDeckRequest): void {
    this.deckFacade.createDeck(request);
  }
}

/** Deck summary listesini name ve description alanlarında case-insensitive filtreler. */
export function filterDecks(decks: readonly DeckSummary[], query: string): readonly DeckSummary[] {
  const normalizedQuery = query.trim().toLocaleLowerCase('en-US');
  if (!normalizedQuery) {
    return decks;
  }

  return decks.filter((deck) =>
    [deck.name, deck.normalizedName, deck.description].some((value) =>
      value?.toLocaleLowerCase('en-US').includes(normalizedQuery),
    ),
  );
}
