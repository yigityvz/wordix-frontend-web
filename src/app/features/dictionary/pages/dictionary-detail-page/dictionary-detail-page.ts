/** Bu dosya, route kimliğini gerçek dictionary detail ve notes state'iyle birleştirir. */
import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Badge } from '@shared/components/badge/badge';
import { Button } from '@shared/components/button/button';
import { Card } from '@shared/components/card/card';
import { ErrorState } from '@shared/components/error-state/error-state';
import { Spinner } from '@shared/components/spinner/spinner';
import {
  OptionSelectionDialog,
  SelectionDialogOption,
} from '@shared/components/option-selection-dialog/option-selection-dialog';
import { DeckFacade } from '@features/decks/facades/deck.facade';

import { DictionaryMeaningPanel } from '../../components/dictionary-meaning-panel/dictionary-meaning-panel';
import { DictionaryFlagsPanel } from '../../components/dictionary-flags-panel/dictionary-flags-panel';
import { DictionaryNotesPanel } from '../../components/dictionary-notes-panel/dictionary-notes-panel';
import { LearningProgressPanel } from '../../components/learning-progress-panel/learning-progress-panel';
import { DictionaryFacade } from '../../facades/dictionary.facade';

/** Canonical UUID route değerinin temel biçimini backend çağrısından önce doğrular. */
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Route açılışında tek dictionary itemı yükleyen ve lifecycle state'lerini sunan detail sayfasıdır. */
@Component({
  selector: 'wx-dictionary-detail-page',
  imports: [
    Badge,
    Button,
    Card,
    DatePipe,
    DictionaryMeaningPanel,
    DictionaryFlagsPanel,
    DictionaryNotesPanel,
    ErrorState,
    LearningProgressPanel,
    OptionSelectionDialog,
    RouterLink,
    Spinner,
  ],
  templateUrl: './dictionary-detail-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DictionaryDetailPage implements OnInit, OnDestroy {
  /** Canonical userLearningItemId route parametresini okur. */
  private readonly route = inject(ActivatedRoute);

  /** Detail action ve state erişimini tek facade üzerinden sağlar. */
  private readonly dictionaryFacade = inject(DictionaryFacade);

  /** Dictionary itemı gerçek deck collection ve add mutation endpointine bağlar. */
  private readonly deckFacade = inject(DeckFacade);

  /** Snapshot route kimliğini sayfa lifecycle boyunca kararlı tutar. */
  private readonly userLearningItemId = this.route.snapshot.paramMap.get('userLearningItemId');

  /** Geçersiz route kimliğini API çağrısı yapmadan güvenli UI hatasına dönüştürür. */
  protected readonly routeError = signal<string | null>(null);

  /** Mapper tarafından normalize edilmiş gerçek detail itemını template'e sunar. */
  protected readonly item = this.dictionaryFacade.selectedItem;

  /** Gerçek detail request loading durumunu sayfa iskeletine bağlar. */
  protected readonly isLoading = this.dictionaryFacade.isDetailLoading;

  /** Merkezi normalize API hata mesajını recoverable detail error state'e bağlar. */
  protected readonly error = this.dictionaryFacade.detailError;

  /** Dictionary itemına ait normalize gerçek not listesini template'e sunar. */
  protected readonly notes = this.dictionaryFacade.notes;

  /** Notes collection request loading durumunu panel iskeletine bağlar. */
  protected readonly areNotesLoading = this.dictionaryFacade.areNotesLoading;

  /** Notes collection API hatasını recoverable panel stateine bağlar. */
  protected readonly notesError = this.dictionaryFacade.notesError;

  /** Note mutation lifecycle durumunu editor ve delete dialoglarına bağlar. */
  protected readonly noteMutationStatus = this.dictionaryFacade.noteMutationStatus;

  /** Note mutation API hatasını açık dialoga bağlar. */
  protected readonly noteMutationError = this.dictionaryFacade.noteMutationError;

  /** Flags collection request loading durumunu panel iskeletine bağlar. */
  protected readonly areFlagsLoading = this.dictionaryFacade.areFlagsLoading;

  /** Flags collection API hatasını recoverable panel stateine bağlar. */
  protected readonly flagsError = this.dictionaryFacade.flagsError;

  /** Gerçek flags collection içindeki Favorite durumunu toggle panele bağlar. */
  protected readonly hasFavoriteFlag = this.dictionaryFacade.hasFavoriteFlag;

  /** Gerçek flags collection içindeki Difficult durumunu toggle panele bağlar. */
  protected readonly hasDifficultFlag = this.dictionaryFacade.hasDifficultFlag;

  /** Flag mutation loading durumunu tekrar tıklama kontrolüne bağlar. */
  protected readonly isFlagMutating = this.dictionaryFacade.isFlagMutating;

  /** Flag mutation hedefini ilgili toggle spinnerına bağlar. */
  protected readonly mutatingFlagType = this.dictionaryFacade.mutatingFlagType;

  /** Flag mutation API hatasını paneldeki hata yüzeyine bağlar. */
  protected readonly flagMutationError = this.dictionaryFacade.flagMutationError;

  /** Nullable display alanları için güvenli detail başlığını türetir. */
  protected readonly title = computed(
    () => this.item()?.displayText ?? this.item()?.normalizedText ?? 'Dictionary item',
  );

  /** Deck seçim dialogunun local görünürlük durumunu tutar. */
  protected readonly isDeckDialogOpen = signal(false);

  /** Gerçek deck özetlerini generic dialog seçeneklerine dönüştürür. */
  protected readonly deckOptions = computed<readonly SelectionDialogOption[]>(() =>
    this.deckFacade.decks().map((deck) => ({
      id: deck.deckId,
      title: deck.name || 'Untitled deck',
      description: deck.description,
      meta: `${deck.itemCount} ${deck.itemCount === 1 ? 'item' : 'items'}`,
    })),
  );

  /** Deck collection loading durumunu seçim dialoguna sunar. */
  protected readonly areDecksLoading = this.deckFacade.isCollectionLoading;

  /** Deck collection API hatasını seçim dialoguna sunar. */
  protected readonly deckCollectionError = this.deckFacade.collectionError;

  /** Deck add mutation loading durumunu tekrar submit kontrolüne bağlar. */
  protected readonly isAddingToDeck = this.deckFacade.isItemMutating;

  /** Deck add mutation API hatasını açık dialog içinde gösterir. */
  protected readonly addToDeckError = this.deckFacade.itemMutationError;

  /** Gerçek deck add cevabından sonra dialog lifecycleını tamamlayan izlemeyi kurar. */
  constructor() {
    // Bu detail sayfasından başlatılan gerçek add tamamlandığında seçim dialogu kapatılır.
    effect(() => {
      if (
        this.isDeckDialogOpen() &&
        this.deckFacade.itemMutationStatus() === 'loaded' &&
        this.deckFacade.addedItem()?.userLearningItemId === this.userLearningItemId
      ) {
        this.closeDeckDialog();
      }
    });
  }

  /** Route ilk açıldığında geçerli canonical kimlikle gerçek detail isteğini başlatır. */
  ngOnInit(): void {
    if (!this.userLearningItemId || !UUID_PATTERN.test(this.userLearningItemId)) {
      this.routeError.set('The dictionary item address is not valid.');
      return;
    }

    this.dictionaryFacade.loadDetail(this.userLearningItemId);
    this.dictionaryFacade.loadNotes(this.userLearningItemId);
    this.dictionaryFacade.loadFlags(this.userLearningItemId);
  }

  /** Route kapanırken eski detail verisinin sonraki itemda görünmesini engeller. */
  ngOnDestroy(): void {
    this.dictionaryFacade.clearDetail();
    this.dictionaryFacade.clearNotes();
    this.dictionaryFacade.clearFlags();
  }

  /** Recoverable API hatasında aynı canonical kimlikle gerçek detail isteğini tekrarlar. */
  protected retryDetail(): void {
    if (this.userLearningItemId && UUID_PATTERN.test(this.userLearningItemId)) {
      this.dictionaryFacade.loadDetail(this.userLearningItemId);
    }
  }

  /** Recoverable notes hatasında aynı dictionary item kimliğiyle gerçek requesti tekrarlar. */
  protected retryNotes(): void {
    if (this.userLearningItemId && UUID_PATTERN.test(this.userLearningItemId)) {
      this.dictionaryFacade.loadNotes(this.userLearningItemId);
    }
  }

  /** Trim edilmiş yeni not metnini mevcut dictionary itemın create endpointine gönderir. */
  protected createNote(noteText: string): void {
    if (this.userLearningItemId && UUID_PATTERN.test(this.userLearningItemId)) {
      this.dictionaryFacade.createNote(this.userLearningItemId, { noteText });
    }
  }

  /** Seçilen not kimliği ve yeni metni gerçek update endpointine gönderir. */
  protected updateNote(event: { readonly noteId: string; readonly noteText: string }): void {
    this.dictionaryFacade.updateNote(event.noteId, { noteText: event.noteText });
  }

  /** Onaylanan not kimliğini gerçek delete endpointine gönderir. */
  protected deleteNote(noteId: string): void {
    this.dictionaryFacade.deleteNote(noteId);
  }

  /** Yeni dialog açılırken eski mutation hatasını state'ten temizler. */
  protected clearNoteMutationState(): void {
    this.dictionaryFacade.clearNoteMutationState();
  }

  /** Recoverable flags hatasında aynı dictionary item kimliğiyle gerçek requesti tekrarlar. */
  protected retryFlags(): void {
    if (this.userLearningItemId && UUID_PATTERN.test(this.userLearningItemId)) {
      this.dictionaryFacade.loadFlags(this.userLearningItemId);
    }
  }

  /** Toggle hedefini canonical flag tipine göre gerçek set veya remove effectine gönderir. */
  protected toggleFlag(event: {
    readonly flagType: 'Favorite' | 'Difficult';
    readonly active: boolean;
  }): void {
    if (!this.userLearningItemId || !UUID_PATTERN.test(this.userLearningItemId)) {
      return;
    }

    if (event.active) {
      this.dictionaryFacade.setFlag(this.userLearningItemId, event.flagType);
      return;
    }

    this.dictionaryFacade.removeFlag(this.userLearningItemId, event.flagType);
  }

  /** Yeni flag niyetinden önce eski mutation hata state'ini temizler. */
  protected clearFlagMutationState(): void {
    this.dictionaryFacade.clearFlagMutationState();
  }

  /** Deck seçim dialogunu açıp authenticated kullanıcının gerçek deck listesini yükler. */
  protected openDeckDialog(): void {
    this.deckFacade.clearItemMutationState();
    this.isDeckDialogOpen.set(true);
    this.deckFacade.loadCollection();
  }

  /** Seçilen deck kimliği ve route item kimliğiyle gerçek add endpointini çağırır. */
  protected addToDeck(deckId: string): void {
    if (
      this.userLearningItemId &&
      UUID_PATTERN.test(this.userLearningItemId) &&
      !this.deckFacade.isItemMutating()
    ) {
      this.deckFacade.clearItemMutationState();
      this.deckFacade.addItem(deckId, { userLearningItemId: this.userLearningItemId });
    }
  }

  /** Deck collection hatasında gerçek liste requestini yeniden başlatır. */
  protected reloadDecks(): void {
    this.deckFacade.loadCollection();
  }

  /** Mutation sürmüyorsa dialogu kapatıp eski deck mutation state'ini temizler. */
  protected closeDeckDialog(): void {
    if (this.deckFacade.isItemMutating()) {
      return;
    }

    this.isDeckDialogOpen.set(false);
    this.deckFacade.clearItemMutationState();
  }
}
