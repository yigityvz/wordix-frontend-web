/** Bu dosya, gerçek lookup sonucunu gösterir ve yalnızca local clipboard kopyalama aksiyonu sağlar. */
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Badge } from '@shared/components/badge/badge';
import { Button } from '@shared/components/button/button';
import { Card } from '@shared/components/card/card';

import { LookupResult } from '../../models/lookup-response.model';
import { LookupMeaningList } from '../lookup-meaning-list/lookup-meaning-list';
import { ProviderBadge } from '../provider-badge/provider-badge';
import { SaveToDictionaryButton } from '../save-to-dictionary-button/save-to-dictionary-button';

/** Clipboard işleminin kullanıcıya gösterilen kısa lifecycle durumlarıdır. */
type CopyStatus = 'idle' | 'copied' | 'error';

/** Result cardın parent sayfaya ilettiği iki gerçek dictionary save seçiminden biridir. */
export type LookupDictionarySaveSelection =
  | { readonly kind: 'learning-item'; readonly selectedMeaningId: string | null }
  | { readonly kind: 'sentence'; readonly translatedText: string };

/** Lookup header, metadata ve meaning listesini tek reusable sonuç yüzeyinde birleştirir. */
@Component({
  selector: 'wx-lookup-result-card',
  host: { class: 'block' },
  imports: [Badge, Button, Card, LookupMeaningList, ProviderBadge, SaveToDictionaryButton],
  templateUrl: './lookup-result-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LookupResultCard {
  /** Backendden gelip mapper ile normalize edilmiş lookup görünüm modelidir. */
  readonly result = input.required<LookupResult>();

  /** Güncel sonucun backend veya mutation state tarafından kayıtlı olduğunu alır. */
  readonly saved = input(false);

  /** Gerçek dictionary mutation sürerken save butonunu loading durumuna geçirir. */
  readonly saveLoading = input(false);

  /** Duplicate dahil normalize backend save hatasını kullanıcıya gösterir. */
  readonly saveError = input<string | null>(null);

  /** Kullanıcının seçtiği meaning veya translation ile save intentini parent sayfaya iletir. */
  readonly saveRequested = output<LookupDictionarySaveSelection>();

  /** Aynı geçerli seçimi birleşik save-if-needed ve deck add akışı için parent sayfaya iletir. */
  readonly addToDeckRequested = output<LookupDictionarySaveSelection>();

  /** Browser clipboard API erişimini test edilebilir document üzerinden sağlar. */
  private readonly document = inject(DOCUMENT);

  /** Son clipboard denemesinin başarı veya hata durumunu tutar. */
  private readonly copyStatus = signal<CopyStatus>('idle');

  /** Copy durumunun yalnızca ait olduğu lookup sonucu için gösterilmesini sağlar. */
  private readonly copiedLookupHistoryId = signal<string | null>(null);

  /** Kullanıcının güncel lookup sonucu içinde seçtiği meaning UUID değerini tutar. */
  private readonly selectedMeaningId = signal<string | null>(null);

  /** Kullanıcının güncel sentence sonucu içinde seçtiği gerçek çeviri metnini tutar. */
  private readonly selectedTranslationText = signal<string | null>(null);

  /** Item type ve sentence payloadına göre hangi backend save sözleşmesinin kullanılacağını belirler. */
  protected readonly isSentence = computed(() => {
    const result = this.result();
    return (
      result.itemType?.toLocaleLowerCase('en-US') === 'sentence' ||
      (result.sentenceId !== null && result.sentenceTranslations.length > 0)
    );
  });

  /** Eski lookup seçimini taşımadan güncel result içindeki seçili veya ilk meaning UUID'sini döndürür. */
  protected readonly effectiveMeaningId = computed(() => {
    const meanings = this.result().meanings;
    const selectedId = this.selectedMeaningId();

    return meanings.some((meaning) => meaning.meaningId === selectedId)
      ? selectedId
      : (meanings[0]?.meaningId ?? null);
  });

  /** Eski lookup seçimini taşımadan güncel result içindeki seçili veya ilk geçerli çeviriyi döndürür. */
  protected readonly effectiveTranslationText = computed(() => {
    const translations = this.result().sentenceTranslations;
    const selectedText = this.selectedTranslationText();

    return translations.some((translation) => translation.translatedText === selectedText)
      ? selectedText
      : (translations.find((translation) => !!translation.translatedText)?.translatedText ?? null);
  });

  /** Güncel resultın canlı backend requesti üretmek için zorunlu alanlara sahip olup olmadığını belirler. */
  protected readonly saveDisabled = computed(() => {
    const result = this.result();

    if (this.isSentence()) {
      return !(
        (result.text ?? result.normalizedText) &&
        this.effectiveTranslationText() &&
        result.sourceLanguageCode &&
        result.targetLanguageCode
      );
    }

    return !result.learningItemId;
  });

  /** Güncel sonuç değiştiğinde eski copy durumunu göstermeyen buton etiketini türetir. */
  protected readonly copyLabel = computed(() => {
    if (this.copiedLookupHistoryId() !== this.result().lookupHistoryId) {
      return 'Copy result';
    }

    if (this.copyStatus() === 'copied') {
      return 'Copied';
    }

    return this.copyStatus() === 'error' ? 'Copy failed' : 'Copy result';
  });

  /** Sonuç metni ve anlamlarını gerçek browser clipboard alanına yazar. */
  protected async copyResult(): Promise<void> {
    const clipboard = this.document.defaultView?.navigator.clipboard;
    this.copiedLookupHistoryId.set(this.result().lookupHistoryId);

    // Clipboard API bulunmayan veya izin vermeyen browserlarda sahte başarı gösterilmez.
    if (!clipboard) {
      this.copyStatus.set('error');
      return;
    }

    try {
      await clipboard.writeText(buildLookupCopyText(this.result()));
      this.copyStatus.set('copied');
    } catch {
      this.copyStatus.set('error');
    }
  }

  /** Kullanıcının açıkça seçtiği meaning UUID değerini güncel result state'ine yazar. */
  protected selectMeaning(meaningId: string): void {
    this.selectedMeaningId.set(meaningId);
  }

  /** Kullanıcının açıkça seçtiği sentence translation metnini güncel result state'ine yazar. */
  protected selectTranslation(translatedText: string): void {
    this.selectedTranslationText.set(translatedText);
  }

  /** Geçerli seçimi doğru word/phrase veya sentence intent türüyle parent sayfaya iletir. */
  protected requestDictionarySave(): void {
    if (this.saveDisabled() || this.saved() || this.saveLoading()) {
      return;
    }

    if (this.isSentence()) {
      const translatedText = this.effectiveTranslationText();
      if (translatedText) {
        this.saveRequested.emit({ kind: 'sentence', translatedText });
      }
      return;
    }

    this.saveRequested.emit({
      kind: 'learning-item',
      selectedMeaningId: this.effectiveMeaningId(),
    });
  }

  /** Geçerli lookup seçimini kaydedilmiş olma durumundan bağımsız deck akışına iletir. */
  protected requestDeckAdd(): void {
    if (this.saveDisabled() || this.saveLoading()) {
      return;
    }

    if (this.isSentence()) {
      const translatedText = this.effectiveTranslationText();
      if (translatedText) {
        this.addToDeckRequested.emit({ kind: 'sentence', translatedText });
      }
      return;
    }

    this.addToDeckRequested.emit({
      kind: 'learning-item',
      selectedMeaningId: this.effectiveMeaningId(),
    });
  }
}

/** Lookup sonucu, meanings ve sentence translations alanlarından okunabilir clipboard metni üretir. */
export function buildLookupCopyText(result: LookupResult): string {
  const lines: string[] = [result.text ?? result.normalizedText ?? 'Wordix lookup result'];

  // Her meaning için yalnızca backendde bulunan translation, definition ve example alanları eklenir.
  for (const meaning of result.meanings) {
    const meaningParts = [meaning.translation, meaning.definition, meaning.exampleSentence].filter(
      isPresentText,
    );
    if (meaningParts.length > 0) {
      lines.push(meaningParts.join(' — '));
    }
  }

  // Sentence sonucunda backendden gelen her translatedText ayrı satır olarak korunur.
  for (const translation of result.sentenceTranslations) {
    if (translation.translatedText) {
      lines.push(translation.translatedText);
    }
  }

  return lines.join('\n');
}

/** Nullable metin listesini clipboard içeriği için boş olmayan string değerlerine daraltır. */
function isPresentText(value: string | null): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}
