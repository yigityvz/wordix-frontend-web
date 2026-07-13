/** Bu dosya, backend lookup kaynak bilgisini reusable semantic badge görünümüne dönüştürür. */
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Badge, BadgeVariant } from '@shared/components/badge/badge';

/** Provider, lookup source ve content source alanlarından gerçek kaynak etiketini gösterir. */
@Component({
  selector: 'wx-provider-badge',
  imports: [Badge],
  templateUrl: './provider-badge.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProviderBadge {
  /** Meaning veya sentence translation seviyesindeki gerçek provider bilgisidir. */
  readonly sourceProvider = input<string | null>(null);

  /** Lookup response seviyesindeki backend kaynak sınıflandırmasıdır. */
  readonly lookupSource = input<string | null>(null);

  /** Lookup response seviyesindeki içerik kaynak sınıflandırmasıdır. */
  readonly contentSource = input<string | null>(null);

  /** Mevcut en spesifik backend kaynak alanını kullanıcı etiketine dönüştürür. */
  protected readonly label = computed(
    () =>
      this.sourceProvider() ?? this.lookupSource() ?? this.contentSource() ?? 'Source unavailable',
  );

  /** Gerçek kaynak varsa info, kaynak alanı boşsa neutral semantic görünüm seçer. */
  protected readonly variant = computed<BadgeVariant>(() =>
    this.sourceProvider() || this.lookupSource() || this.contentSource() ? 'info' : 'neutral',
  );
}
