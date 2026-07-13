/** Bu dosya, dictionary notlarını erişilebilir create/edit/delete dialoglarıyla sunan feature UI componentidir. */
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from '@shared/components/button/button';
import { Card } from '@shared/components/card/card';
import { Modal } from '@shared/components/modal/modal';
import { Spinner } from '@shared/components/spinner/spinner';

import { DictionaryNote } from '../../models/dictionary.models';
import { DictionaryOperationStatus } from '../../store/dictionary.state';

/** Not listesini gösterir; mutation kararlarını outputlarla page/facade sahibine bırakır. */
@Component({
  selector: 'wx-dictionary-notes-panel',
  imports: [Button, Card, DatePipe, Modal, ReactiveFormsModule, Spinner],
  templateUrl: './dictionary-notes-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DictionaryNotesPanel {
  /** Backendden normalize edilmiş güncel not listesini alır. */
  readonly notes = input<readonly DictionaryNote[]>([]);

  /** Notes collection requestinin sürdüğünü belirtir. */
  readonly loading = input(false);

  /** Notes collection için recoverable API hata mesajını alır. */
  readonly error = input<string | null>(null);

  /** Create, update veya delete requestinin ortak lifecycle durumunu alır. */
  readonly mutationStatus = input<DictionaryOperationStatus>('idle');

  /** Mutation hatasını ilgili açık dialog içinde gösterir. */
  readonly mutationError = input<string | null>(null);

  /** Notes collection yeniden yükleme niyetini parenta bildirir. */
  readonly reload = output<void>();

  /** Validate edilmiş yeni not metnini parenta bildirir. */
  readonly createRequested = output<string>();

  /** Validate edilmiş note UUID ve yeni metni parenta bildirir. */
  readonly updateRequested = output<{ readonly noteId: string; readonly noteText: string }>();

  /** Onaylanan note UUID silme niyetini parenta bildirir. */
  readonly deleteRequested = output<string>();

  /** Yeni dialog açılırken eski mutation state'ini temizleme niyetini parenta bildirir. */
  readonly mutationResetRequested = output<void>();

  /** Create/edit dialogunun görünürlüğünü yerel UI stateinde tutar. */
  protected readonly editorOpen = signal(false);

  /** Edit modunda düzenlenen gerçek notu, create modunda null değerini tutar. */
  protected readonly editingNote = signal<DictionaryNote | null>(null);

  /** Delete onay dialogunda hedeflenen gerçek notu tutar. */
  protected readonly deleteTarget = signal<DictionaryNote | null>(null);

  /** Not metnini required validation ile erişilebilir reactive form controlünde tutar. */
  protected readonly noteTextControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  constructor() {
    // Başarılı backend mutationından sonra açık dialoglar otomatik kapatılır.
    effect(() => {
      if (this.mutationStatus() === 'loaded') {
        this.closeLocalDialogs();
      }
    });
  }

  /** Boş form ile gerçek create note dialogunu açar. */
  protected openCreateDialog(): void {
    this.mutationResetRequested.emit();
    this.editingNote.set(null);
    this.noteTextControl.setValue('');
    this.noteTextControl.markAsPristine();
    this.editorOpen.set(true);
  }

  /** Seçilen backend notunun metniyle edit dialogunu açar. */
  protected openEditDialog(note: DictionaryNote): void {
    this.mutationResetRequested.emit();
    this.editingNote.set(note);
    this.noteTextControl.setValue(note.noteText);
    this.noteTextControl.markAsPristine();
    this.editorOpen.set(true);
  }

  /** Seçilen backend notu için delete confirmation dialogunu açar. */
  protected openDeleteDialog(note: DictionaryNote): void {
    this.mutationResetRequested.emit();
    this.deleteTarget.set(note);
  }

  /** Editoru mutation sürmezken kapatır. */
  protected closeEditor(): void {
    if (this.mutationStatus() !== 'loading') {
      this.editorOpen.set(false);
      this.editingNote.set(null);
    }
  }

  /** Delete dialogunu mutation sürmezken kapatır. */
  protected closeDeleteDialog(): void {
    if (this.mutationStatus() !== 'loading') {
      this.deleteTarget.set(null);
    }
  }

  /** Trim edilmiş ve boş olmayan form değerini create veya update intentine dönüştürür. */
  protected submitEditor(): void {
    const noteText = this.noteTextControl.value.trim();
    if (!noteText) {
      this.noteTextControl.setErrors({ required: true });
      this.noteTextControl.markAsTouched();
      return;
    }

    const note = this.editingNote();
    if (note) {
      this.updateRequested.emit({ noteId: note.userLearningNoteId, noteText });
      return;
    }

    this.createRequested.emit(noteText);
  }

  /** Delete dialogundaki hedef not varsa gerçek silme niyetini parenta iletir. */
  protected confirmDelete(): void {
    const note = this.deleteTarget();
    if (note) {
      this.deleteRequested.emit(note.userLearningNoteId);
    }
  }

  /** Başarılı mutation sonrası tüm yerel dialog hedeflerini temizler. */
  private closeLocalDialogs(): void {
    this.editorOpen.set(false);
    this.editingNote.set(null);
    this.deleteTarget.set(null);
  }
}
