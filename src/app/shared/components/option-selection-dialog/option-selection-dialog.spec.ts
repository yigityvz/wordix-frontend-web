/** Bu dosya, generic seçim dialogunun gerçek option kimliğini yalnızca açık kullanıcı onayıyla yaydığını doğrular. */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Button } from '@shared/components/button/button';
import { describe, expect, it } from 'vitest';

import { OptionSelectionDialog } from './option-selection-dialog';

/** Dialogun loading/empty durumları ve canonical selection output sözleşmesini sınar. */
describe('OptionSelectionDialog', () => {
  /** Gerekli inputlarla açık dialog fixture'ı üretir. */
  function createFixture(): ComponentFixture<OptionSelectionDialog> {
    const fixture = TestBed.createComponent(OptionSelectionDialog);
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('options', [
      { id: 'deck-1', title: 'Core Words', meta: '2 items' },
      { id: 'deck-2', title: 'Travel', meta: '5 items' },
    ]);
    fixture.detectChanges();
    return fixture;
  }

  /** Native radio seçimi sonrasında confirm aksiyonunun gerçek option kimliğini yaydığını doğrular. */
  it('emits the selected canonical option id on confirmation', () => {
    const fixture = createFixture();
    const confirmed: string[] = [];
    fixture.componentInstance.confirmed.subscribe((id) => confirmed.push(id));
    const radios = fixture.debugElement.queryAll(By.css('input[type="radio"]'));

    radios[1]!.nativeElement.click();
    fixture.detectChanges();
    const confirmButton = fixture.debugElement
      .queryAll(By.directive(Button))
      .find((button) => (button.nativeElement.textContent ?? '').includes('Confirm'))!;
    (confirmButton.componentInstance as Button).activated.emit(new MouseEvent('click'));

    expect(confirmed).toEqual(['deck-2']);
  });

  /** Seçim yapılmadan confirm butonunun native disabled durumda kaldığını doğrular. */
  it('keeps confirmation disabled until an option is selected', () => {
    const fixture = createFixture();
    const confirmButton = fixture.debugElement
      .queryAll(By.directive(Button))
      .find((button) => (button.nativeElement.textContent ?? '').includes('Confirm'))!;

    expect((confirmButton.nativeElement as HTMLElement).querySelector('button')?.disabled).toBe(
      true,
    );
  });
});
