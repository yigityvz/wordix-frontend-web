/**
 * Status, rol ve bilgi etiketlerini semantic renklerle tutarlı biçimde gösterir.
 * Badge metninin business anlamını parent belirler; component yalnızca sunum varyantını uygular.
 */
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type BadgeVariant = 'neutral' | 'info' | 'success' | 'warning' | 'error';

@Component({
  selector: 'wx-badge',
  templateUrl: './badge.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Badge {
  /** Badge'in semantic durum rengini belirler. */
  readonly variant = input<BadgeVariant>('neutral');

  /** Metinden önce aynı semantic renkte küçük durum işareti gösterir. */
  readonly dot = input(false);

  /** Variant değerini tema uyumlu background, border ve text classlarına dönüştürür. */
  protected readonly variantClasses = computed(() => {
    // Semantic sözlük component içinde hard-coded hex kullanımını engeller.
    const classes: Record<BadgeVariant, string> = {
      neutral: 'border-wx-border bg-wx-surface-muted text-wx-text-secondary',
      info: 'border-wx-info/30 bg-wx-info/10 text-wx-info',
      success: 'border-wx-success/30 bg-wx-success/10 text-wx-success',
      warning: 'border-wx-warning/30 bg-wx-warning/10 text-wx-warning',
      error: 'border-wx-error/30 bg-wx-error/10 text-wx-error',
    };

    // Seçili semantic varyantın class seti template'e verilir.
    return classes[this.variant()];
  });
}
