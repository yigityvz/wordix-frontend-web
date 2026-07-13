/**
 * Business bağımsız, tema uyumlu içerik yüzeyi sunar.
 * Featureların border, radius, padding ve hover davranışını tekrar tanımlamasını engeller.
 */
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'wx-card',
  host: { class: 'block' },
  templateUrl: './card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {
  /** Card içeriğinin ihtiyacına göre kontrollü boşluk ölçeği seçer. */
  readonly padding = input<CardPadding>('md');

  /** Yalnızca gerçekten interactive card kullanıldığında hover hareketini açar. */
  readonly hoverable = input(false);

  /** Padding tokenını Tailwind classına dönüştürür. */
  protected readonly paddingClass = computed(() => {
    // Tek sözlük tutarlı spacing sistemi sağlar.
    const classes: Record<CardPadding, string> = {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-5',
      lg: 'p-6',
    };

    // Seçili padding classı template'e döndürülür.
    return classes[this.padding()];
  });
}
