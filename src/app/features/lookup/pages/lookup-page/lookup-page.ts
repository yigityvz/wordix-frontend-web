/** Bu dosya, lookup search formunu gerçek NgRx state ve sonuç componentleriyle birleştiren route sayfasıdır. */
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { DictionaryFacade } from '@features/dictionary/facades/dictionary.facade';
import { DictionaryItem } from '@features/dictionary/models/dictionary.models';
import { DeckFacade } from '@features/decks/facades/deck.facade';
import { Card } from '@shared/components/card/card';
import { ErrorState } from '@shared/components/error-state/error-state';
import {
  OptionSelectionDialog,
  SelectionDialogOption,
} from '@shared/components/option-selection-dialog/option-selection-dialog';
import { Spinner } from '@shared/components/spinner/spinner';

import { LookupSearchForm } from '../../components/lookup-search-form/lookup-search-form';
import {
  LookupDictionarySaveSelection,
  LookupResultCard,
} from '../../components/lookup-result-card/lookup-result-card';
import { LookupFacade } from '../../facades/lookup.facade';
import { LookupResult } from '../../models/lookup-response.model';

/** Mevcut ürün kapsamındaki gerçek kaynak dil kodudur. */
const SOURCE_LANGUAGE_CODE = 'en';

/** Mevcut ürün kapsamındaki gerçek hedef dil kodudur. */
const TARGET_LANGUAGE_CODE = 'tr';

/** Componentleri HTTP/NgRx ayrıntılarından ayırıp kullanıcı niyetini facade'a ileten lookup sayfasıdır. */
@Component({
  selector: 'wx-lookup-page',
  imports: [Card, ErrorState, LookupResultCard, LookupSearchForm, OptionSelectionDialog, Spinner],
  templateUrl: './lookup-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LookupPage {
  /** Lookup feature state ve gerçek search action erişimini tek facade üzerinden sağlar. */
  private readonly lookupFacade = inject(LookupFacade);

  /** Lookup sonucunu gerçek dictionary mutation state ve endpointleriyle birleştirir. */
  private readonly dictionaryFacade = inject(DictionaryFacade);

  /** Kullanıcının gerçek deck collection ve item mutation akışını facade sınırından yönetir. */
  private readonly deckFacade = inject(DeckFacade);

  /** Save lifecycle mesajlarının yalnızca ait olduğu lookup sonucunda gösterilmesini sağlar. */
  private readonly saveLookupHistoryId = signal<string | null>(null);

  /** Deck seçiminin görünürlüğünü yalnızca bu sayfanın UI state'i olarak tutar. */
  protected readonly isDeckDialogOpen = signal(false);

  /** Deck akışında korunması gereken lookup meaning veya sentence seçimini tutar. */
  private readonly deckSaveSelection = signal<LookupDictionarySaveSelection | null>(null);

  /** Save veya dictionary çözümlemesi tamamlanınca kullanılacak gerçek deck kimliğini tutar. */
  private readonly pendingDeckId = signal<string | null>(null);

  /** Sözleşme alanlarıyla çözülemeyen production akışını sahte mutation yerine açık hata yapar. */
  private readonly deckFlowError = signal<string | null>(null);

  /** Normalize backend sonucunu template'e sunar. */
  protected readonly result = this.lookupFacade.result;

  /** Son requesti recoverable retry davranışı için template'e sunar. */
  protected readonly request = this.lookupFacade.request;

  /** Search formu ve loading card görünümünü gerçek request lifecycle'ına bağlar. */
  protected readonly isLoading = this.lookupFacade.isLoading;

  /** Normalize API hata mesajını recoverable error state'e bağlar. */
  protected readonly error = this.lookupFacade.error;

  /** Gerçek dictionary mutation loading durumunu result carda sunar. */
  protected readonly isSaving = this.dictionaryFacade.isSaving;

  /** Güncel result backendde kayıtlıysa veya bu resultın mutationı başarılandıysa saved durumu üretir. */
  protected readonly isCurrentResultSaved = computed(() => {
    const result = this.result();
    if (!result) {
      return false;
    }

    return (
      result.isAlreadyInUserDictionary ||
      (this.saveLookupHistoryId() === result.lookupHistoryId &&
        this.dictionaryFacade.saveStatus() === 'loaded')
    );
  });

  /** Normalize save hatasını yalnızca hatayı üreten lookup sonucuna bağlar. */
  protected readonly currentSaveError = computed(() => {
    const result = this.result();
    return result && this.saveLookupHistoryId() === result.lookupHistoryId
      ? this.dictionaryFacade.saveError()
      : null;
  });

  /** Backend deck özetlerini business bağımsız seçim dialogu modeline dönüştürür. */
  protected readonly deckOptions = computed<readonly SelectionDialogOption[]>(() =>
    this.deckFacade.decks().map((deck) => ({
      id: deck.deckId,
      title: deck.name || 'Untitled deck',
      description: deck.description,
      meta: `${deck.itemCount} ${deck.itemCount === 1 ? 'item' : 'items'}`,
    })),
  );

  /** Deck collection request loading durumunu dialoga sunar. */
  protected readonly areDecksLoading = this.deckFacade.isCollectionLoading;

  /** Deck collection API hatasını retry yüzeyine bağlar. */
  protected readonly deckCollectionError = this.deckFacade.collectionError;

  /** Save, dictionary çözümleme ve deck add adımlarının ortak loading durumunu üretir. */
  protected readonly isDeckFlowLoading = computed(
    () =>
      this.deckFacade.isItemMutating() ||
      this.dictionaryFacade.isSaving() ||
      (!!this.pendingDeckId() &&
        this.result()?.isAlreadyInUserDictionary === true &&
        this.dictionaryFacade.collectionStatus() === 'loading'),
  );

  /** Birleşik akışın tüm gerçek backend hatalarını tek dialog yüzeyinde birleştirir. */
  protected readonly currentDeckFlowError = computed(
    () =>
      this.deckFlowError() ??
      this.deckFacade.itemMutationError() ??
      this.currentSaveError() ??
      (this.pendingDeckId() ? this.dictionaryFacade.collectionError() : null),
  );

  /** Dictionary çözümleme, save sonucu ve deck add başarısını izleyen birleşik akışı kurar. */
  constructor() {
    // Yeni dictionary save tamamlandığında canonical userLearningItemId ile bekleyen deck add başlatılır.
    effect(() => {
      const deckId = this.pendingDeckId();
      const result = this.result();
      const userLearningItemId = this.dictionaryFacade.lastSavedUserLearningItemId();
      if (
        deckId &&
        result &&
        !result.isAlreadyInUserDictionary &&
        this.saveLookupHistoryId() === result.lookupHistoryId &&
        this.dictionaryFacade.saveStatus() === 'loaded' &&
        userLearningItemId
      ) {
        this.pendingDeckId.set(null);
        this.deckFacade.addItem(deckId, { userLearningItemId });
      }
    });

    // Daha önce kaydedilmiş lookup sonucu gerçek dictionary collectionından çözüldüğünde deck add başlatılır.
    effect(() => {
      const deckId = this.pendingDeckId();
      const result = this.result();
      if (
        !deckId ||
        !result?.isAlreadyInUserDictionary ||
        this.dictionaryFacade.collectionStatus() !== 'loaded'
      ) {
        return;
      }

      const dictionaryItem = this.findDictionaryItem(result);
      this.pendingDeckId.set(null);
      if (!dictionaryItem) {
        this.deckFlowError.set(
          'The saved dictionary item could not be resolved from the current backend collection.',
        );
        return;
      }

      this.deckFacade.addItem(deckId, {
        userLearningItemId: dictionaryItem.userLearningItemId,
      });
    });

    // Gerçek add cevabı geldiğinde yalnızca bu lookup akışına ait açık dialog kapatılır.
    effect(() => {
      if (
        this.isDeckDialogOpen() &&
        this.deckFacade.itemMutationStatus() === 'loaded' &&
        this.deckFacade.addedItem()
      ) {
        this.closeDeckDialog();
      }
    });
  }

  /** Formdan gelen geçerli metni canonical en→tr requesti olarak gerçek lookup effectine yollar. */
  protected search(query: string): void {
    this.resetDictionarySaveState();
    this.lookupFacade.search({
      text: query,
      sourceLanguageCode: SOURCE_LANGUAGE_CODE,
      targetLanguageCode: TARGET_LANGUAGE_CODE,
    });
  }

  /** Son başarısız request varsa aynı gerçek backend çağrısını yeniden başlatır. */
  protected retrySearch(): void {
    const request = this.lookupFacade.request();
    if (request) {
      this.resetDictionarySaveState();
      this.lookupFacade.search(request);
    }
  }

  /** Kullanıcı clear istediğinde form ile birlikte lookup feature state'ini sıfırlar. */
  protected clearSearch(): void {
    this.resetDictionarySaveState();
    this.lookupFacade.clear();
  }

  /** Result card seçimini canlı Swagger sözleşmesine uygun dictionary requestine dönüştürür. */
  protected saveToDictionary(selection: LookupDictionarySaveSelection): void {
    const result = this.result();
    if (!result || result.isAlreadyInUserDictionary || this.dictionaryFacade.isSaving()) {
      return;
    }

    this.dictionaryFacade.clearSaveState();
    this.saveLookupHistoryId.set(result.lookupHistoryId);

    if (selection.kind === 'learning-item') {
      if (!result.learningItemId) {
        return;
      }

      this.dictionaryFacade.saveLearningItem({
        learningItemId: result.learningItemId,
        selectedMeaningId: selection.selectedMeaningId,
        sourceLookupHistoryId: result.lookupHistoryId,
      });
      return;
    }

    const sourceText = result.text ?? result.normalizedText;
    if (!sourceText || !result.sourceLanguageCode || !result.targetLanguageCode) {
      return;
    }

    this.dictionaryFacade.saveSentence({
      sourceText,
      translatedText: selection.translatedText,
      sourceLanguageCode: result.sourceLanguageCode,
      targetLanguageCode: result.targetLanguageCode,
      sourceLookupHistoryId: result.lookupHistoryId,
    });
  }

  /** Lookup kartındaki seçimi koruyup gerçek deck collectionını seçim dialogu için yükler. */
  protected openDeckDialog(selection: LookupDictionarySaveSelection): void {
    this.deckSaveSelection.set(selection);
    this.pendingDeckId.set(null);
    this.deckFlowError.set(null);
    this.deckFacade.clearItemMutationState();
    this.isDeckDialogOpen.set(true);
    this.deckFacade.loadCollection();
  }

  /** Kullanıcının seçtiği deck için save-if-needed ve add endpoint sırasını başlatır. */
  protected addCurrentResultToDeck(deckId: string): void {
    const result = this.result();
    const selection = this.deckSaveSelection();
    if (!result || !selection || this.isDeckFlowLoading()) {
      return;
    }

    this.deckFlowError.set(null);
    this.deckFacade.clearItemMutationState();

    // Aynı lookup oturumunda save edilmiş kayıt canonical mutation cevabındaki ID ile kullanılır.
    const recentlySavedId =
      this.saveLookupHistoryId() === result.lookupHistoryId
        ? this.dictionaryFacade.lastSavedUserLearningItemId()
        : null;
    if (recentlySavedId) {
      this.deckFacade.addItem(deckId, { userLearningItemId: recentlySavedId });
      return;
    }

    // Backend lookup sonucu zaten kayıtlı diyorsa ID yalnızca gerçek dictionary collectionından çözülür.
    if (result.isAlreadyInUserDictionary) {
      const dictionaryItem = this.findDictionaryItem(result);
      if (dictionaryItem) {
        this.deckFacade.addItem(deckId, {
          userLearningItemId: dictionaryItem.userLearningItemId,
        });
        return;
      }

      this.pendingDeckId.set(deckId);
      this.dictionaryFacade.loadCollection();
      return;
    }

    // Yeni lookup sonucu önce gerçek dictionary save endpointinden canonical item kimliğini alır.
    this.pendingDeckId.set(deckId);
    this.saveToDictionary(selection);
  }

  /** Deck collection hatasında aynı gerçek liste requestini yeniden başlatır. */
  protected reloadDecks(): void {
    this.deckFacade.loadCollection();
  }

  /** Mutation sürmüyorsa deck dialoguna ait local ve feature mutation state'ini temizler. */
  protected closeDeckDialog(): void {
    if (this.deckFacade.isItemMutating() || this.dictionaryFacade.isSaving()) {
      return;
    }

    this.isDeckDialogOpen.set(false);
    this.deckSaveSelection.set(null);
    this.pendingDeckId.set(null);
    this.deckFlowError.set(null);
    this.deckFacade.clearItemMutationState();
  }

  /** Lookup item kimliklerini gerçek dictionary collectionındaki canonical kayıtla eşleştirir. */
  private findDictionaryItem(result: LookupResult): DictionaryItem | null {
    return (
      this.dictionaryFacade
        .items()
        .find(
          (item) =>
            (!!result.learningItemId && item.learningItemId === result.learningItemId) ||
            (!!result.sentenceId && item.sentenceId === result.sentenceId),
        ) ?? null
    );
  }

  /** Yeni lookup veya clear öncesinde önceki sonuca ait save mesajlarını temizler. */
  private resetDictionarySaveState(): void {
    this.closeDeckDialog();
    this.saveLookupHistoryId.set(null);
    this.dictionaryFacade.clearSaveState();
  }
}
