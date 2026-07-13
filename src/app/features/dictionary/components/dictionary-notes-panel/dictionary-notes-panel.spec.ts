/** Bu dosya, notes panelinin validation ve gerçek mutation intent outputlarını doğrular. */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { DictionaryNote } from '../../models/dictionary.models';
import { DictionaryNotesPanel } from './dictionary-notes-panel';

/** Feature panelinin API çağrısı yapmadan typesafe parent intentleri ürettiğini sınar. */
describe('DictionaryNotesPanel', () => {
  /** Trim edilmiş yeni not metninin create outputuyla yayınlandığını doğrular. */
  it('emits a validated create note intent', () => {
    const fixture = createFixture([]);
    const createRequested = vi.fn();
    fixture.componentInstance.createRequested.subscribe(createRequested);

    clickButton(fixture, 'Add note');
    setTextareaValue(fixture, '  Remember this context.  ');
    clickButton(fixture, 'Save note');

    expect(createRequested).toHaveBeenCalledWith('Remember this context.');
  });

  /** Yalnızca boşluk içeren metnin create intenti üretmediğini doğrular. */
  it('rejects an empty note before mutation', () => {
    const fixture = createFixture([]);
    const createRequested = vi.fn();
    fixture.componentInstance.createRequested.subscribe(createRequested);

    clickButton(fixture, 'Add note');
    setTextareaValue(fixture, '   ');
    clickButton(fixture, 'Save note');
    fixture.detectChanges();

    expect(createRequested).not.toHaveBeenCalled();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Enter a note before saving.',
    );
  });

  /** Edit dialogunun canonical note UUID ve yeni metinle update intenti yayınladığını doğrular. */
  it('emits an update intent for the selected note', () => {
    const fixture = createFixture([createNote()]);
    const updateRequested = vi.fn();
    fixture.componentInstance.updateRequested.subscribe(updateRequested);

    clickButton(fixture, 'Edit');
    setTextareaValue(fixture, 'Updated note');
    clickButton(fixture, 'Save note');

    expect(updateRequested).toHaveBeenCalledWith({
      noteId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      noteText: 'Updated note',
    });
  });

  /** Confirmation sonrası canonical note UUID ile delete intenti yayınlandığını doğrular. */
  it('emits a confirmed delete intent', () => {
    const fixture = createFixture([createNote()]);
    const deleteRequested = vi.fn();
    fixture.componentInstance.deleteRequested.subscribe(deleteRequested);

    clickButton(fixture, 'Delete');
    clickButton(fixture, 'Delete note');

    expect(deleteRequested).toHaveBeenCalledWith('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
  });
});

/** Notes inputuyla render edilmiş standalone panel fixture'ı üretir. */
function createFixture(notes: readonly DictionaryNote[]): ComponentFixture<DictionaryNotesPanel> {
  TestBed.configureTestingModule({ imports: [DictionaryNotesPanel] });
  const fixture = TestBed.createComponent(DictionaryNotesPanel);
  fixture.componentRef.setInput('notes', notes);
  fixture.detectChanges();
  return fixture;
}

/** Görünür metni eşleşen native butonu tıklar ve UI'ı yeniden render eder. */
function clickButton(fixture: ComponentFixture<DictionaryNotesPanel>, label: string): void {
  const button = Array.from(
    (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('button'),
  ).find((candidate) => candidate.textContent?.trim() === label);
  expect(button, `Button ${label} should exist`).toBeDefined();
  button?.click();
  fixture.detectChanges();
}

/** Editor textarea değerini native input eventiyle reactive form controle taşır. */
function setTextareaValue(fixture: ComponentFixture<DictionaryNotesPanel>, value: string): void {
  const textarea = (fixture.nativeElement as HTMLElement).querySelector<HTMLTextAreaElement>(
    '#dictionary-note-text',
  );
  expect(textarea).not.toBeNull();
  if (textarea) {
    textarea.value = value;
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }
}

/** Panel edit/delete testleri için eksiksiz normalize note fixture'ı üretir. */
function createNote(): DictionaryNote {
  return {
    userLearningNoteId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    userLearningItemId: '11111111-1111-1111-1111-111111111111',
    noteText: 'Original note',
    createdAt: '2026-07-13T10:00:00Z',
    updatedAt: null,
  };
}
