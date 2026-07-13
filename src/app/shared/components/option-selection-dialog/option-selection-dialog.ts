/** Bu dosya, business alanından bağımsız tekli seçenek seçimini erişilebilir modal içinde sunar. */
import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { Button } from '@shared/components/button/button';
import { Modal } from '@shared/components/modal/modal';
import { Spinner } from '@shared/components/spinner/spinner';

/** Dialog içinde gösterilebilen generic seçenek görünüm modelidir. */
export interface SelectionDialogOption {
  readonly id: string;
  readonly title: string;
  readonly description?: string | null;
  readonly meta?: string | null;
}

/** Loading, empty, error ve submit lifecyclelarını business kararı vermeden yöneten seçim dialogudur. */
@Component({
  selector: 'wx-option-selection-dialog',
  imports: [Button, Modal, Spinner],
  templateUrl: './option-selection-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionSelectionDialog {
  /** Parent stateine göre dialog görünürlüğünü belirler. */
  readonly open = input(false);
  /** Dialog başlığını erişilebilir modal adına bağlar. */
  readonly title = input('Choose an option');
  /** Backend veya parent verisinden üretilen generic seçenekleri alır. */
  readonly options = input<readonly SelectionDialogOption[]>([]);
  /** Collection yüklenirken gerçek loading görünümünü açar. */
  readonly loading = input(false);
  /** Collection yükleme hatasını ve retry aksiyonunu gösterir. */
  readonly error = input<string | null>(null);
  /** Confirm mutation sürerken dialogu tekrar etkileşime kapatır. */
  readonly mutationLoading = input(false);
  /** Confirm mutation hatasını dialog içinde görünür tutar. */
  readonly mutationError = input<string | null>(null);
  /** Boş collection açıklamasını kullanım bağlamına göre özelleştirir. */
  readonly emptyDescription = input('No options are available yet.');
  /** Confirm butonu metnini kullanım bağlamına göre özelleştirir. */
  readonly confirmLabel = input('Confirm');
  /** Kullanıcı dialogu kapatmak istediğinde parent state sahibine bildirir. */
  readonly closed = output<void>();
  /** Recoverable collection hatasında parenta retry intenti gönderir. */
  readonly reload = output<void>();
  /** Seçilen gerçek option kimliğini parent mutation akışına iletir. */
  readonly confirmed = output<string>();
  /** Dialog içinde seçili olan tek option kimliğini local UI state olarak tutar. */
  protected readonly selectedId = signal<string | null>(null);

  /** Her yeni dialog açılışında önceki seçim state'ini sıfırlayan reactive izlemeyi kurar. */
  constructor() {
    // Dialog her yeni açılışında önceki bağlamdan kalan seçimi temizler.
    effect(() => {
      if (this.open()) {
        this.selectedId.set(null);
      }
    });
  }

  /** Radio değişikliğini generic option kimliği olarak local state'e yazar. */
  protected select(id: string): void {
    if (!this.mutationLoading()) {
      this.selectedId.set(id);
    }
  }

  /** Geçerli seçim varsa canonical kimliği parent confirm akışına yollar. */
  protected confirmSelection(): void {
    const selectedId = this.selectedId();
    if (selectedId && !this.mutationLoading()) {
      this.confirmed.emit(selectedId);
    }
  }
}
