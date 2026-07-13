/** Bu dosya, dictionary confidence değerini erişilebilir ve tema uyumlu bir ilerleme göstergesine dönüştürür. */
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Backend confidence değerini 0-100 aralığında görselleştiren salt-okunur componenttir. */
@Component({
  selector: 'wx-dictionary-progress-badge',
  templateUrl: './progress-badge.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DictionaryProgressBadge {
  /** Backend tarafından dönen confidence skorunu alır. */
  readonly value = input.required<number>();

  /** Bozuk veya sınır dışı transport değerlerinin layoutu taşırmasını engeller. */
  protected readonly normalizedValue = computed(() => Math.min(100, Math.max(0, this.value())));

  /** Erişilebilir label ve görünür yüzde için yuvarlanmış değeri üretir. */
  protected readonly percentage = computed(() => Math.round(this.normalizedValue()));
}
