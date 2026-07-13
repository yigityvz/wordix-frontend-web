/** Bu dosya, dictionary detail progress ve öğrenme durumunu gerçek backend alanlarından gösterir. */
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Badge } from '@shared/components/badge/badge';
import { Card } from '@shared/components/card/card';

import { DictionaryItem } from '../../models/dictionary.models';
import { DictionaryProgressBadge } from '../progress-badge/progress-badge';

/** Confidence ve learning flag alanlarını salt-okunur olarak sunan detail panelidir. */
@Component({
  selector: 'wx-learning-progress-panel',
  imports: [Badge, Card, DictionaryProgressBadge],
  templateUrl: './learning-progress-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearningProgressPanel {
  /** Normalize detail itemını progress alanları için alır. */
  readonly item = input.required<DictionaryItem>();
}
