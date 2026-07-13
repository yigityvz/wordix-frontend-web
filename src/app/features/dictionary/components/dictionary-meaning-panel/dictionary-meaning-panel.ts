/** Bu dosya, dictionary detail içindeki seçili meaning veya sentence translation içeriğini gösterir. */
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Badge } from '@shared/components/badge/badge';
import { Card } from '@shared/components/card/card';

import { DictionaryItem } from '../../models/dictionary.models';

/** Backend detail payloadındaki seçili öğrenme içeriğini mutation yapmadan sunan componenttir. */
@Component({
  selector: 'wx-dictionary-meaning-panel',
  imports: [Badge, Card],
  templateUrl: './dictionary-meaning-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DictionaryMeaningPanel {
  /** Mapper tarafından normalize edilmiş gerçek dictionary detail itemını alır. */
  readonly item = input.required<DictionaryItem>();

  /** Detail payloadındaki gerçek içerik tipine göre panel başlığını türetir. */
  protected readonly contentHeading = computed(() => {
    if (this.item().selectedMeaning) {
      return 'Selected meaning';
    }

    return this.item().sentenceTranslation ? 'Selected translation' : 'Selected content';
  });
}
