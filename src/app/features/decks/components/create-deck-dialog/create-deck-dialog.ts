/** Bu dosya, gerçek create deck requestini üreten erişilebilir form dialogunu sunar. */
import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from '@shared/components/button/button';
import { Modal } from '@shared/components/modal/modal';

import { CreateDeckRequest } from '../../models/deck-request.models';

/** Form validation yapar ve typesafe create requestini owning page'e iletir. */
@Component({
  selector: 'wx-create-deck-dialog',
  imports: [Button, Modal, ReactiveFormsModule],
  templateUrl: './create-deck-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateDeckDialog {
  /** Parent local stateine göre dialogun açık olup olmadığını belirler. */
  readonly open = input(false);

  /** Gerçek create requesti sürerken form ve close aksiyonlarını kilitler. */
  readonly loading = input(false);

  /** Normalize create API hata mesajını form içinde gösterir. */
  readonly error = input<string | null>(null);

  /** Kullanıcının dialogu kapatma niyetini parent state sahibine bildirir. */
  readonly closed = output<void>();

  /** Validate edilmiş ve trim edilmiş create requestini parent page'e bildirir. */
  readonly createRequested = output<CreateDeckRequest>();

  /** Zorunlu deck adını non-nullable reactive form controlünde tutar. */
  protected readonly nameControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  /** Opsiyonel deck açıklamasını non-nullable local form controlünde tutar. */
  protected readonly descriptionControl = new FormControl('', { nonNullable: true });

  constructor() {
    // Dialog her yeni açılışta önceki form değerleri ve validation stateinden arındırılır.
    effect(() => {
      if (this.open()) {
        this.resetForm();
      }
    });
  }

  /** Mutation sürmezken dialogu kapatma niyetini parenta iletir. */
  protected requestClose(): void {
    if (!this.loading()) {
      this.closed.emit();
    }
  }

  /** Trim edilmiş name ve nullable description alanlarıyla gerçek create requesti üretir. */
  protected submit(): void {
    const name = this.nameControl.value.trim();
    if (!name) {
      this.nameControl.setErrors({ required: true });
      this.nameControl.markAsTouched();
      return;
    }

    const description = this.descriptionControl.value.trim();
    this.createRequested.emit({ name, description: description || null });
  }

  /** Form kontrollerini boş ve untouched başlangıç durumuna döndürür. */
  private resetForm(): void {
    this.nameControl.reset('');
    this.descriptionControl.reset('');
  }
}
