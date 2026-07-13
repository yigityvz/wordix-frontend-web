/** Bu dosya, dictionary save butonunun gerçek loading, success ve backend error durumlarını doğrular. */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { SaveToDictionaryButton } from './save-to-dictionary-button';

/** Mutation componentinin backend sonucu olmadan başarı göstermediğini ve hatayı saklamadığını sınar. */
describe('SaveToDictionaryButton', () => {
  /** İstenen inputlarla standalone save component fixture'ı üretir. */
  function createFixture(inputs: {
    readonly saved?: boolean;
    readonly loading?: boolean;
    readonly error?: string | null;
  }): ComponentFixture<SaveToDictionaryButton> {
    const fixture = TestBed.createComponent(SaveToDictionaryButton);
    fixture.componentRef.setInput('saved', inputs.saved ?? false);
    fixture.componentRef.setInput('loading', inputs.loading ?? false);
    fixture.componentRef.setInput('error', inputs.error ?? null);
    fixture.detectChanges();
    return fixture;
  }

  /** Duplicate dahil normalize backend hata mesajının alert olarak gösterildiğini doğrular. */
  it('renders the backend save error without fake success', () => {
    const fixture = createFixture({ error: 'This item is already in your dictionary.' });
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('This item is already in your dictionary.');
    expect(element.querySelector('[role="alert"]')).not.toBeNull();
    expect(element.textContent).not.toContain('Saved to Dictionary');
  });

  /** Gerçek success state geldiğinde mutation butonu yerine saved durumu gösterildiğini doğrular. */
  it('renders saved state only after success', () => {
    const fixture = createFixture({ saved: true });
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Saved to Dictionary');
    expect(element.querySelector('button')).toBeNull();
  });

  /** Gerçek request sürerken butonun disabled ve loading olduğunu doğrular. */
  it('disables duplicate submit while saving', () => {
    const fixture = createFixture({ loading: true });
    const button = (fixture.nativeElement as HTMLElement).querySelector('button');

    expect(button?.disabled).toBe(true);
    expect(button?.getAttribute('aria-busy')).toBe('true');
  });
});
