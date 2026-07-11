/**
 * Uygulama genelindeki buton görünümlerini, loading ve disabled davranışını standartlaştırır.
 * Business aksiyonunu bilmez; yalnızca geçerli kullanıcı etkileşimini parent componente iletir.
 */
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'wx-button',
  templateUrl: './button.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  /** Butonun semantic görsel amacını belirler. */
  readonly variant = input<ButtonVariant>('primary');

  /** Butonun dokunma alanı ve typography ölçeğini belirler. */
  readonly size = input<ButtonSize>('md');

  /** Parent işlem sürerken tekrar tıklamayı engeller ve spinner gösterir. */
  readonly loading = input(false);

  /** Parent validation veya yetki durumuna göre etkileşimi kapatır. */
  readonly disabled = input(false);

  /** Form senaryoları için native button type değerini korur. */
  readonly type = input<'button' | 'submit'>('button');

  /** Geçerli bir kullanıcı tıklamasını parent componente bildirir. */
  readonly activated = output<MouseEvent>();

  /** Loading durumunu da hesaba katarak native disabled değerini türetir. */
  protected readonly isDisabled = computed(() => this.disabled() || this.loading());

  /** Variant değerini merkezi semantic Tailwind classlarına dönüştürür. */
  protected readonly variantClasses = computed(() => {
    // Her variant hard-coded renk yerine Wordix semantic tokenlarını kullanır.
    const classes: Record<ButtonVariant, string> = {
      primary: 'border-transparent bg-yale-blue-bright text-white hover:bg-yale-blue',
      secondary: 'border-wx-border bg-wx-surface-muted text-wx-text hover:bg-wx-surface',
      ghost: 'border-transparent bg-transparent text-wx-text-secondary hover:bg-wx-surface-muted',
      danger: 'border-wx-error/30 bg-wx-error/10 text-wx-error hover:bg-wx-error/20',
    };

    // Seçili variant için tek bir class seti döndürülür.
    return classes[this.variant()];
  });

  /** Size değerini tutarlı padding ve font ölçeğine dönüştürür. */
  protected readonly sizeClasses = computed(() => {
    // Ortak boyut sözlüğü componentler arası rastgele ölçüyü engeller.
    const classes: Record<ButtonSize, string> = {
      sm: 'min-h-9 rounded-lg px-3 text-sm',
      md: 'min-h-11 rounded-xl px-4 text-sm',
      lg: 'min-h-12 rounded-xl px-6 text-base',
    };

    // Seçili size için class seti template'e verilir.
    return classes[this.size()];
  });

  /** Disabled/loading olmayan tıklamayı parent componente yayınlar. */
  protected handleClick(event: MouseEvent): void {
    // Native disabled yeterli olsa da programatik eventlere karşı contract burada da korunur.
    if (this.isDisabled()) {
      return;
    }

    // Business aksiyonunun ne olduğuna yalnızca parent component karar verir.
    this.activated.emit(event);
  }
}
