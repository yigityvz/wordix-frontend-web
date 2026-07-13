/** Bu dosya, deck list route lifecycle, backend kartları ve local search davranışını doğrular. */
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';

import { DeckFacade } from '../../facades/deck.facade';
import { DeckSummary } from '../../models/deck.models';
import { DeckListPage, filterDecks } from './deck-list-page';

/** List page'in gerçek collection intentini ve desteklenen create UI'ını kullandığını sınar. */
describe('DeckListPage', () => {
  /** Route açılışında collection yükleyip backend deck kartını render ettiğini doğrular. */
  it('loads and renders the deck collection', () => {
    const context = createPageFixture([createDeck()]);
    const text = (context.fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(context.loadCollection).toHaveBeenCalledOnce();
    expect(text).toContain('Core Words');
    expect(text).toContain('1 item');
    expect(text).toContain('New deck');
  });

  /** Backend desteği bulunmayan edit/delete ve henüz bağlanmayan quiz aksiyonlarının render edilmediğini doğrular. */
  it('does not render unsupported deck actions', () => {
    const context = createPageFixture([createDeck()]);
    const text = (context.fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).not.toContain('Edit');
    expect(text).not.toContain('Delete');
    expect(text).not.toContain('Start Quiz');
  });

  /** Local aramanın name ve description alanlarında case-insensitive çalıştığını doğrular. */
  it('filters loaded decks without changing backend state', () => {
    const decks = [createDeck(), createDeck({ deckId: '2', name: 'Travel', description: 'Trips' })];

    expect(filterDecks(decks, 'trip')).toEqual([decks[1]]);
    expect(filterDecks(decks, '')).toBe(decks);
  });
});

/** Facade signals ve spylarla standalone deck list page test contexti üretir. */
function createPageFixture(decksValue: readonly DeckSummary[]): {
  readonly fixture: ComponentFixture<DeckListPage>;
  readonly loadCollection: ReturnType<typeof vi.fn>;
} {
  const loadCollection = vi.fn();
  TestBed.configureTestingModule({
    imports: [DeckListPage],
    providers: [
      provideRouter([]),
      {
        provide: DeckFacade,
        useValue: {
          decks: signal(decksValue),
          totalCount: signal(decksValue.length),
          isCollectionLoading: signal(false),
          collectionError: signal<string | null>(null),
          isCreating: signal(false),
          createError: signal<string | null>(null),
          createStatus: signal<'idle' | 'loading' | 'loaded' | 'error'>('idle'),
          loadCollection,
          clearCreateState: vi.fn(),
          createDeck: vi.fn(),
        },
      },
    ],
  });
  const fixture = TestBed.createComponent(DeckListPage);
  fixture.detectChanges();
  return { fixture, loadCollection };
}

/** List page testleri için normalize deck summary fixture'ı üretir. */
function createDeck(overrides: Partial<DeckSummary> = {}): DeckSummary {
  return {
    deckId: '11111111-1111-1111-1111-111111111111',
    name: 'Core Words',
    normalizedName: 'core words',
    description: 'Daily practice',
    itemCount: 1,
    createdAt: '2026-07-13T10:00:00Z',
    updatedAt: null,
    isActive: true,
    ...overrides,
  };
}
