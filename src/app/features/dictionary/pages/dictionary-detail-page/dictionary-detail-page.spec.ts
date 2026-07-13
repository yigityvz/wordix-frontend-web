/** Bu dosya, dictionary detail route lifecycle, backend içeriği ve notes panel bağlantısını doğrular. */
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { ErrorState } from '@shared/components/error-state/error-state';
import { DeckFacade } from '@features/decks/facades/deck.facade';
import { describe, expect, it, vi } from 'vitest';

import { DictionaryFacade } from '../../facades/dictionary.facade';
import { DictionaryItem } from '../../models/dictionary.models';
import { DictionaryDetailPage } from './dictionary-detail-page';

/** Detail page'in canonical route kimliğiyle facade kullandığını ve unsupported UI üretmediğini sınar. */
describe('DictionaryDetailPage', () => {
  /** Geçerli UUID route parametresinin gerçek detail load intentine dönüştüğünü doğrular. */
  it('loads and renders the canonical dictionary item', () => {
    const context = createPageFixture('11111111-1111-1111-1111-111111111111');
    const text = (context.fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(context.loadDetail).toHaveBeenCalledWith('11111111-1111-1111-1111-111111111111');
    expect(context.loadNotes).toHaveBeenCalledWith('11111111-1111-1111-1111-111111111111');
    expect(context.loadFlags).toHaveBeenCalledWith('11111111-1111-1111-1111-111111111111');
    expect(text).toContain('ocean');
    expect(text).toContain('okyanus');
    expect(text).toContain('35%');
  });

  /** Invalid route kimliğinde backend çağrısı yapılmadan güvenli hata gösterildiğini doğrular. */
  it('rejects an invalid route id before the API call', () => {
    const context = createPageFixture('not-a-uuid');
    const text = (context.fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(context.loadDetail).not.toHaveBeenCalled();
    expect(context.loadNotes).not.toHaveBeenCalled();
    expect(context.loadFlags).not.toHaveBeenCalled();
    expect(text).toContain('Invalid dictionary item');
  });

  /** Recoverable API hata yüzeyindeki retry aksiyonunun aynı canonical id'yi kullandığını doğrular. */
  it('retries the real detail request', () => {
    const context = createPageFixture('11111111-1111-1111-1111-111111111111', {
      item: null,
      error: 'Dictionary item was not found.',
    });
    const errorState = context.fixture.debugElement.query(By.directive(ErrorState))
      .componentInstance as ErrorState;

    errorState.retry.emit();

    expect(context.loadDetail).toHaveBeenCalledTimes(2);
    expect(context.loadDetail).toHaveBeenLastCalledWith('11111111-1111-1111-1111-111111111111');
  });

  /** Detail route kapanırken eski item state'inin temizlendiğini doğrular. */
  it('clears detail state on destroy', () => {
    const context = createPageFixture('11111111-1111-1111-1111-111111111111');

    context.fixture.destroy();

    expect(context.clearDetail).toHaveBeenCalledOnce();
    expect(context.clearNotes).toHaveBeenCalledOnce();
    expect(context.clearFlags).toHaveBeenCalledOnce();
  });

  /** Gerçek deck add görünürken backend desteği olmayan quiz aksiyonlarının gizli kaldığını doğrular. */
  it('renders deck add without unsupported quiz actions', () => {
    const context = createPageFixture('11111111-1111-1111-1111-111111111111');
    const text = (context.fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('Add note');
    expect(text).toContain('Add to Deck');
    expect(text).not.toContain('Start Quiz');
    expect(text).not.toContain('Quiz History');
  });
});

/** Route, facade signals ve spylarıyla standalone detail page test contexti üretir. */
function createPageFixture(
  userLearningItemId: string,
  options: { readonly item?: DictionaryItem | null; readonly error?: string | null } = {},
): {
  readonly fixture: ComponentFixture<DictionaryDetailPage>;
  readonly loadDetail: ReturnType<typeof vi.fn>;
  readonly loadNotes: ReturnType<typeof vi.fn>;
  readonly loadFlags: ReturnType<typeof vi.fn>;
  readonly clearDetail: ReturnType<typeof vi.fn>;
  readonly clearNotes: ReturnType<typeof vi.fn>;
  readonly clearFlags: ReturnType<typeof vi.fn>;
} {
  const loadDetail = vi.fn();
  const loadNotes = vi.fn();
  const loadFlags = vi.fn();
  const clearDetail = vi.fn();
  const clearNotes = vi.fn();
  const clearFlags = vi.fn();
  const selectedItem = signal<DictionaryItem | null>(
    options.item === undefined ? createDictionaryItem() : options.item,
  );
  const isDetailLoading = signal(false);
  const detailError = signal<string | null>(options.error ?? null);
  const notes = signal([]);
  const areNotesLoading = signal(false);
  const notesError = signal<string | null>(null);
  const noteMutationStatus = signal<'idle' | 'loading' | 'loaded' | 'error'>('idle');
  const noteMutationError = signal<string | null>(null);
  const areFlagsLoading = signal(false);
  const flagsError = signal<string | null>(null);
  const hasFavoriteFlag = signal(true);
  const hasDifficultFlag = signal(false);
  const isFlagMutating = signal(false);
  const mutatingFlagType = signal<'Favorite' | 'Difficult' | null>(null);
  const flagMutationError = signal<string | null>(null);

  TestBed.configureTestingModule({
    imports: [DictionaryDetailPage],
    providers: [
      provideRouter([]),
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: { paramMap: convertToParamMap({ userLearningItemId }) },
        },
      },
      {
        provide: DictionaryFacade,
        useValue: {
          selectedItem,
          isDetailLoading,
          detailError,
          notes,
          areNotesLoading,
          notesError,
          noteMutationStatus,
          noteMutationError,
          areFlagsLoading,
          flagsError,
          hasFavoriteFlag,
          hasDifficultFlag,
          isFlagMutating,
          mutatingFlagType,
          flagMutationError,
          loadDetail,
          loadNotes,
          loadFlags,
          clearDetail,
          clearNotes,
          clearFlags,
          createNote: vi.fn(),
          updateNote: vi.fn(),
          deleteNote: vi.fn(),
          clearNoteMutationState: vi.fn(),
          setFlag: vi.fn(),
          removeFlag: vi.fn(),
          clearFlagMutationState: vi.fn(),
        },
      },
      {
        provide: DeckFacade,
        useValue: {
          decks: signal([]),
          isCollectionLoading: signal(false),
          collectionError: signal(null),
          isItemMutating: signal(false),
          itemMutationError: signal(null),
          itemMutationStatus: signal('idle'),
          addedItem: signal(null),
          loadCollection: vi.fn(),
          addItem: vi.fn(),
          clearItemMutationState: vi.fn(),
        },
      },
    ],
  });

  const fixture = TestBed.createComponent(DictionaryDetailPage);
  fixture.detectChanges();
  return {
    fixture,
    loadDetail,
    loadNotes,
    loadFlags,
    clearDetail,
    clearNotes,
    clearFlags,
  };
}

/** Detail page testleri için eksiksiz normalize dictionary item fixture'ı üretir. */
function createDictionaryItem(): DictionaryItem {
  return {
    userLearningItemId: '11111111-1111-1111-1111-111111111111',
    learningItemId: '22222222-2222-2222-2222-222222222222',
    wordId: '33333333-3333-3333-3333-333333333333',
    phraseId: null,
    sentenceId: null,
    itemType: 'Word',
    displayText: 'ocean',
    normalizedText: 'ocean',
    sourceLanguageCode: 'en',
    selectedMeaningId: '44444444-4444-4444-4444-444444444444',
    sentenceTranslation: null,
    selectedMeaning: {
      meaningId: '44444444-4444-4444-4444-444444444444',
      translation: 'okyanus',
      definition: 'A large body of salt water.',
      partOfSpeech: 'noun',
      isPrimary: true,
      displayOrder: 1,
    },
    savedAt: '2026-07-13T10:00:00Z',
    sourceLookupHistoryId: '55555555-5555-5555-5555-555555555555',
    learningStatus: 'Learning',
    learningConfidenceScore: 35,
    isFavorite: true,
    isDifficult: false,
    wantsMorePractice: false,
    isIgnored: false,
    noteCount: 2,
    isActive: true,
  };
}
