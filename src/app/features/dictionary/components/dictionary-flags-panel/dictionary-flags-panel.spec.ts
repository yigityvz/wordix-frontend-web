/** Bu dosya, flags panelinin erişilebilir state ve canonical toggle intentlerini doğrular. */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { DictionaryFlagsPanel } from './dictionary-flags-panel';

/** Panelin backend stateinden set/remove hedefi türettiğini ve tekrar tıklamayı engellediğini sınar. */
describe('DictionaryFlagsPanel', () => {
  /** Pasif Favorite kontrolünün canonical set intenti yayınladığını doğrular. */
  it('requests setting an inactive favorite flag', () => {
    const fixture = createFixture({ favorite: false });
    const toggleRequested = vi.fn();
    fixture.componentInstance.toggleRequested.subscribe(toggleRequested);

    getFlagButton(fixture, 0).click();

    expect(toggleRequested).toHaveBeenCalledWith({ flagType: 'Favorite', active: true });
  });

  /** Aktif Favorite kontrolünün canonical remove intenti yayınladığını doğrular. */
  it('requests removing an active favorite flag', () => {
    const fixture = createFixture({ favorite: true });
    const toggleRequested = vi.fn();
    fixture.componentInstance.toggleRequested.subscribe(toggleRequested);

    const favoriteButton = getFlagButton(fixture, 0);
    expect(favoriteButton.getAttribute('aria-pressed')).toBe('true');
    favoriteButton.click();

    expect(toggleRequested).toHaveBeenCalledWith({ flagType: 'Favorite', active: false });
  });

  /** Difficult kontrolünün canonical enum adıyla set intenti yayınladığını doğrular. */
  it('requests setting an inactive difficult flag', () => {
    const fixture = createFixture({ difficult: false });
    const toggleRequested = vi.fn();
    fixture.componentInstance.toggleRequested.subscribe(toggleRequested);

    getFlagButton(fixture, 1).click();

    expect(toggleRequested).toHaveBeenCalledWith({ flagType: 'Difficult', active: true });
  });

  /** Mutation sürerken iki flag kontrolünün de native disabled olduğunu doğrular. */
  it('disables both controls during a flag mutation', () => {
    const fixture = createFixture({ mutating: true, mutatingFlagType: 'Favorite' });
    const buttons = getFlagButtons(fixture);

    expect(buttons).toHaveLength(2);
    expect(buttons.every((button) => button.disabled)).toBe(true);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Updating favorite flag');
  });
});

/** Flag input kombinasyonlarıyla render edilmiş standalone panel fixture'ı üretir. */
function createFixture(
  options: {
    readonly favorite?: boolean;
    readonly difficult?: boolean;
    readonly mutating?: boolean;
    readonly mutatingFlagType?: 'Favorite' | 'Difficult' | null;
  } = {},
): ComponentFixture<DictionaryFlagsPanel> {
  TestBed.configureTestingModule({ imports: [DictionaryFlagsPanel] });
  const fixture = TestBed.createComponent(DictionaryFlagsPanel);
  fixture.componentRef.setInput('favorite', options.favorite ?? false);
  fixture.componentRef.setInput('difficult', options.difficult ?? false);
  fixture.componentRef.setInput('mutating', options.mutating ?? false);
  fixture.componentRef.setInput('mutatingFlagType', options.mutatingFlagType ?? null);
  fixture.detectChanges();
  return fixture;
}

/** Render edilen Favorite ve Difficult native toggle butonlarını DOM sırasıyla döndürür. */
function getFlagButtons(fixture: ComponentFixture<DictionaryFlagsPanel>): HTMLButtonElement[] {
  return Array.from(
    (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>(
      'button[aria-pressed]',
    ),
  );
}

/** İstenen sıradaki flag toggle butonunu test için güvenli biçimde döndürür. */
function getFlagButton(
  fixture: ComponentFixture<DictionaryFlagsPanel>,
  index: number,
): HTMLButtonElement {
  const button = getFlagButtons(fixture)[index];
  expect(button).toBeDefined();
  return button;
}
