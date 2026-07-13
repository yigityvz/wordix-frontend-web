/** Bu dosya, lookup meaning ve sentence translation listelerini salt-okunur sonuç içeriği olarak sunar. */
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { LookupMeaning, LookupSentenceTranslation } from '../../models/lookup-response.model';
import { ProviderBadge } from '../provider-badge/provider-badge';

/** Word/phrase anlamları ile sentence çevirilerini backend sırasını koruyarak render eder. */
@Component({
  selector: 'wx-lookup-meaning-list',
  imports: [ProviderBadge],
  templateUrl: './lookup-meaning-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LookupMeaningList {
  /** Word veya phrase sonucundaki normalize meaning listesidir. */
  readonly meanings = input.required<readonly LookupMeaning[]>();

  /** Sentence sonucundaki normalize translation listesidir. */
  readonly sentenceTranslations = input.required<readonly LookupSentenceTranslation[]>();

  /** Save akışında seçim kontrolünün gösterilip gösterilmeyeceğini belirler. */
  readonly selectable = input(false);

  /** Backend save requestine gönderilecek güncel meaning UUID değerini alır. */
  readonly selectedMeaningId = input<string | null>(null);

  /** Sentence save requestine gönderilecek güncel çeviri metnini alır. */
  readonly selectedTranslationText = input<string | null>(null);

  /** Kullanıcı meaning seçtiğinde parent result carda canonical UUID değerini iletir. */
  readonly meaningSelected = output<string>();

  /** Kullanıcı sentence translation seçtiğinde parent result carda gerçek metni iletir. */
  readonly translationSelected = output<string>();

  /** Native radio eventinden seçilen meaning UUID değerini yayınlar. */
  protected selectMeaning(meaningId: string): void {
    this.meaningSelected.emit(meaningId);
  }

  /** Nullable translation içinde yalnızca kaydedilebilir gerçek metni yayınlar. */
  protected selectTranslation(translatedText: string | null): void {
    if (translatedText) {
      this.translationSelected.emit(translatedText);
    }
  }
}
