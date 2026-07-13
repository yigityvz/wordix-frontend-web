/** Bu dosya, create deck dialogunun validation ve canonical request outputunu doğrular. */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { CreateDeckDialog } from './create-deck-dialog';

/** Dialogun boş name değerini engelleyip trim edilmiş request ürettiğini sınar. */
describe('CreateDeckDialog', () => {
  /** Yalnızca boşluk içeren deck adının mutation intenti üretmediğini doğrular. */
  it('rejects an empty deck name', () => {
    const fixture = createFixture();
    const createRequested = vi.fn();
    fixture.componentInstance.createRequested.subscribe(createRequested);

    setInputValue(fixture, '#deck-name', '   ');
    clickButton(fixture, 'Create deck');
    fixture.detectChanges();

    expect(createRequested).not.toHaveBeenCalled();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Enter a deck name before creating it.',
    );
  });

  /** Name ve description alanlarını trim ederek ownership alanı olmayan request yayınladığını doğrular. */
  it('emits a normalized create deck request', () => {
    const fixture = createFixture();
    const createRequested = vi.fn();
    fixture.componentInstance.createRequested.subscribe(createRequested);

    setInputValue(fixture, '#deck-name', '  Core Words  ');
    setInputValue(fixture, '#deck-description', '  Daily practice  ');
    clickButton(fixture, 'Create deck');

    expect(createRequested).toHaveBeenCalledWith({
      name: 'Core Words',
      description: 'Daily practice',
    });
  });
});

/** Açık standalone create dialog fixture'ı üretir. */
function createFixture(): ComponentFixture<CreateDeckDialog> {
  TestBed.configureTestingModule({ imports: [CreateDeckDialog] });
  const fixture = TestBed.createComponent(CreateDeckDialog);
  fixture.componentRef.setInput('open', true);
  fixture.detectChanges();
  return fixture;
}

/** Seçilen input veya textarea değerini native input eventiyle reactive form controle taşır. */
function setInputValue(
  fixture: ComponentFixture<CreateDeckDialog>,
  selector: string,
  value: string,
): void {
  const element = (fixture.nativeElement as HTMLElement).querySelector<
    HTMLInputElement | HTMLTextAreaElement
  >(selector);
  expect(element).not.toBeNull();
  if (element) {
    element.value = value;
    element.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }
}

/** Görünür metni eşleşen native butonu tıklar. */
function clickButton(fixture: ComponentFixture<CreateDeckDialog>, label: string): void {
  const button = Array.from(
    (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('button'),
  ).find((candidate) => candidate.textContent?.trim() === label);
  expect(button).toBeDefined();
  button?.click();
}
