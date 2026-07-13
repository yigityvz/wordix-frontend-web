/** Bu dosya, lookup search form validation, trim ve clear kullanıcı niyetlerini doğrular. */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LookupSearchForm } from './lookup-search-form';

/** Search formun backend çağırmadan yalnızca geçerli kullanıcı intenti ürettiğini sınar. */
describe('LookupSearchForm', () => {
  /** Her testte bağımsız standalone search form fixture'ını tutar. */
  let fixture: ComponentFixture<LookupSearchForm>;

  /** Her test için form componentini kararlı loading=false inputuyla oluşturur. */
  beforeEach(() => {
    fixture = TestBed.createComponent(LookupSearchForm);
    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();
  });

  /** Kullanıcı metnindeki dış boşlukların backend niyetinden önce temizlendiğini doğrular. */
  it('emits a trimmed search query', () => {
    const emittedQueries: string[] = [];
    fixture.componentInstance.search.subscribe((query) => emittedQueries.push(query));
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;

    input.value = '  ocean  ';
    input.dispatchEvent(new Event('input'));
    form.dispatchEvent(new Event('submit'));

    expect(emittedQueries).toEqual(['ocean']);
  });

  /** Boş submitin search outputu üretmeyip erişilebilir validation mesajı gösterdiğini doğrular. */
  it('rejects an empty lookup query', () => {
    const searchListener = vi.fn();
    fixture.componentInstance.search.subscribe(searchListener);
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;

    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(searchListener).not.toHaveBeenCalled();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Please enter a word, phrase, or sentence.',
    );
  });

  /** Clear butonunun local inputu temizleyip parent state temizleme niyeti yaydığını doğrular. */
  it('clears the form and emits the clear intent', () => {
    const clearListener = vi.fn();
    fixture.componentInstance.cleared.subscribe(clearListener);
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    input.value = 'ocean';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const clearButton = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find((button) => button.textContent?.includes('Clear'));
    clearButton?.click();
    fixture.detectChanges();

    expect(clearListener).toHaveBeenCalledOnce();
    expect((fixture.nativeElement.querySelector('input') as HTMLInputElement).value).toBe('');
  });
});
