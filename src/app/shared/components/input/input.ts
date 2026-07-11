/**
 * Label, helper ve validation error ilişkisini erişilebilir biçimde standartlaştıran text inputtur.
 * Form business kuralını bilmez; güncel değeri parent componente bildirir.
 */
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

/** Her component instance'ı için benzersiz ve stabil input id üretmekte kullanılan sayaçtır. */
let inputSequence = 0;

@Component({
  selector: 'wx-input',
  templateUrl: './input.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Input {
  /** Form alanını kullanıcıya ve screen reader'a açıklayan zorunlu labeldır. */
  readonly label = input.required<string>();

  /** Native input value değerini controlled component contractıyla parenttan alır. */
  readonly value = input('');

  /** Boş alanda beklenen formatı açıklayan opsiyonel kısa metindir. */
  readonly placeholder = input('');

  /** Geçerli alan hakkında hata dışı açıklama verir. */
  readonly helperText = input<string>();

  /** Validation başarısız olduğunda alanla ilişkili hata metnini taşır. */
  readonly errorText = input<string>();

  /** Parent async işlem veya yetki durumuna göre native inputu kapatır. */
  readonly disabled = input(false);

  /** Browser autocomplete davranışını form amacına göre parentın belirlemesini sağlar. */
  readonly autocomplete = input('off');

  /** Kullanıcı yazdıkça yeni string değeri parent componente iletir. */
  readonly valueChange = output<string>();

  /** Label ve input ilişkisi için bu instance'a özel id oluşturur. */
  protected readonly inputId = `wx-input-${++inputSequence}`;

  /** Helper veya error metninin screen reader tarafından inputla ilişkilendirilmesini sağlar. */
  protected readonly describedBy = computed(() => {
    // Error helperdan daha önceliklidir ve aynı anda iki mesaj okunmasını engeller.
    if (this.errorText()) {
      return `${this.inputId}-error`;
    }

    // Error yoksa opsiyonel helper metni input açıklaması olur.
    return this.helperText() ? `${this.inputId}-helper` : null;
  });

  /** Native input eventindeki güncel değeri typesafe outputa dönüştürür. */
  protected handleInput(event: Event): void {
    // Event hedefi native input olarak daraltılarak any kullanımı engellenir.
    const target = event.target as HTMLInputElement;

    // Parent form state yalnızca yeni string değerle güncellenir.
    this.valueChange.emit(target.value);
  }
}
