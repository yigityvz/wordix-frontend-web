/** Bu dosya, deck detail route lifecycle ve salt-okunur backend item sunumunu doğrular. */
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';

import { DeckFacade } from '../../facades/deck.facade';
import { DeckDetail } from '../../models/deck.models';
import { DeckDetailPage } from './deck-detail-page';

/** Detail page'in canonical route kimliğiyle facade kullandığını ve unsupported UI üretmediğini sınar. */
describe('DeckDetailPage', () => {
  /** Geçerli UUID route parametresinin gerçek detail load intentine dönüştüğünü doğrular. */
  it('loads and renders the canonical deck detail', () => {
    const context = createPageFixture('11111111-1111-1111-1111-111111111111');
    const text = (context.fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(context.loadDetail).toHaveBeenCalledWith('11111111-1111-1111-1111-111111111111');
    expect(text).toContain('Core Words');
    expect(text).toContain('ocean');
    expect(text).toContain('okyanus');
  });

  /** Invalid route kimliğinde backend çağrısı yapılmadan güvenli hata gösterildiğini doğrular. */
  it('rejects an invalid route id before the API call', () => {
    const context = createPageFixture('not-a-uuid');
    const text = (context.fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(context.loadDetail).not.toHaveBeenCalled();
    expect(text).toContain('Invalid deck');
  });

  /** Detail route kapanırken eski selected deck state'inin temizlendiğini doğrular. */
  it('clears detail state on destroy', () => {
    const context = createPageFixture('11111111-1111-1111-1111-111111111111');

    context.fixture.destroy();

    expect(context.clearDetail).toHaveBeenCalledOnce();
  });

  /** Gerçek remove görünürken backend desteği olmayan edit/delete/quiz aksiyonlarının gizli kaldığını doğrular. */
  it('renders item removal without unsupported deck actions', () => {
    const context = createPageFixture('11111111-1111-1111-1111-111111111111');
    const text = (context.fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('Remove');
    expect(text).not.toContain('Add from Dictionary');
    expect(text).not.toContain('Start Quiz');
    expect(text).not.toContain('Edit');
    expect(text).not.toContain('Delete');
  });
});

/** Route, facade signals ve spylarla standalone deck detail page test contexti üretir. */
function createPageFixture(deckId: string): {
  readonly fixture: ComponentFixture<DeckDetailPage>;
  readonly loadDetail: ReturnType<typeof vi.fn>;
  readonly clearDetail: ReturnType<typeof vi.fn>;
} {
  const loadDetail = vi.fn();
  const clearDetail = vi.fn();
  TestBed.configureTestingModule({
    imports: [DeckDetailPage],
    providers: [
      provideRouter([]),
      {
        provide: ActivatedRoute,
        useValue: { snapshot: { paramMap: convertToParamMap({ deckId }) } },
      },
      {
        provide: DeckFacade,
        useValue: {
          selectedDeck: signal<DeckDetail | null>(createDeckDetail()),
          isDetailLoading: signal(false),
          detailError: signal<string | null>(null),
          isItemMutating: signal(false),
          itemMutationError: signal<string | null>(null),
          itemMutationStatus: signal('idle'),
          removedItem: signal(null),
          loadDetail,
          clearDetail,
          removeItem: vi.fn(),
          clearItemMutationState: vi.fn(),
        },
      },
    ],
  });
  const fixture = TestBed.createComponent(DeckDetailPage);
  fixture.detectChanges();
  return { fixture, loadDetail, clearDetail };
}

/** Detail page testi için tek itemlı normalize deck fixture'ı üretir. */
function createDeckDetail(): DeckDetail {
  return {
    deckId: '11111111-1111-1111-1111-111111111111',
    name: 'Core Words',
    normalizedName: 'core words',
    description: 'Daily practice',
    itemCount: 1,
    items: [
      {
        deckItemId: '22222222-2222-2222-2222-222222222222',
        userLearningItemId: '33333333-3333-3333-3333-333333333333',
        learningItemId: '44444444-4444-4444-4444-444444444444',
        wordId: '55555555-5555-5555-5555-555555555555',
        phraseId: null,
        sentenceId: null,
        itemType: 'Word',
        displayText: 'ocean',
        normalizedText: 'ocean',
        sourceLanguageCode: 'en',
        selectedMeaning: {
          meaningId: '66666666-6666-6666-6666-666666666666',
          translation: 'okyanus',
          definition: null,
          partOfSpeech: 'noun',
          isPrimary: true,
          displayOrder: 1,
        },
        sentenceTranslation: null,
        addedAt: '2026-07-13T10:00:00Z',
      },
    ],
    createdAt: '2026-07-13T09:00:00Z',
    updatedAt: null,
    isActive: true,
  };
}
