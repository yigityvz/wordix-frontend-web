/** Bu dosya, lookup sonucunun gerçek dictionary save lifecycle durumunu generic buton ve mesajlarla sunar. */
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button } from '@shared/components/button/button';

/** API çağrısı yapmadan save niyetini parent sayfaya ileten presentational mutation componentidir. */
@Component({
  selector: 'wx-save-to-dictionary-button',
  imports: [Button],
  templateUrl: './save-to-dictionary-button.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaveToDictionaryButton {
  /** Güncel lookup sonucunun backend veya başarı state'ine göre kayıtlı olduğunu belirtir. */
  readonly saved = input(false);

  /** Gerçek dictionary mutation sürerken duplicate submiti engeller. */
  readonly loading = input(false);

  /** Eksik backend alanı nedeniyle geçerli request üretilemediğinde butonu kapatır. */
  readonly disabled = input(false);

  /** Merkezi API hata katmanından gelen güvenli mutation mesajını gösterir. */
  readonly error = input<string | null>(null);

  /** Kullanıcı geçerli save butonunu seçtiğinde parent akışına intent yayınlar. */
  readonly saveRequested = output<void>();

  /** Shared button aktivasyonunu business davranışı bilmeden parent componente aktarır. */
  protected requestSave(): void {
    this.saveRequested.emit();
  }
}
