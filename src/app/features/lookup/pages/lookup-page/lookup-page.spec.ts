/** Bu dosya, lookup sayfasının form niyetini canonical dil kodlarıyla facade'a ilettiğini doğrular. */
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DictionaryFacade } from '@features/dictionary/facades/dictionary.facade';
import { DeckFacade } from '@features/decks/facades/deck.facade';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LookupSearchForm } from '../../components/lookup-search-form/lookup-search-form';
import { LookupResultCard } from '../../components/lookup-result-card/lookup-result-card';
import { LookupFacade } from '../../facades/lookup.facade';
import { LookupResult } from '../../models/lookup-response.model';
import { LookupPage } from './lookup-page';

/** Page componentin HTTP yerine yalnızca facade ve child component contractlarıyla çalışmasını sınar. */
describe('LookupPage', () => {
  /** Her testte standalone page fixture'ını tutar. */
  let fixture: ComponentFixture<LookupPage>;
  const search = vi.fn();
  const clear = vi.fn();
  const clearSaveState = vi.fn();
  const saveLearningItem = vi.fn();
  const saveSentence = vi.fn();
  const result = signal<LookupResult | null>(null);
  const saveStatus = signal<'idle' | 'loading' | 'loaded' | 'error'>('idle');
  const isSaving = signal(false);
  const saveError = signal<string | null>(null);
  const collectionStatus = signal<'idle' | 'loading' | 'loaded' | 'error'>('idle');
  const itemMutationStatus = signal<'idle' | 'loading' | 'loaded' | 'error'>('idle');

  /** Her testte boş lookup state ve kontrollü facade mockuyla sayfayı oluşturur. */
  beforeEach(() => {
    search.mockClear();
    clear.mockClear();
    clearSaveState.mockClear();
    saveLearningItem.mockClear();
    saveSentence.mockClear();
    result.set(null);
    saveStatus.set('idle');
    isSaving.set(false);
    saveError.set(null);

    TestBed.configureTestingModule({
      imports: [LookupPage],
      providers: [
        {
          provide: LookupFacade,
          useValue: {
            result,
            request: signal(null),
            isLoading: signal(false),
            error: signal(null),
            search,
            clear,
          },
        },
        {
          provide: DictionaryFacade,
          useValue: {
            saveStatus,
            isSaving,
            saveError,
            collectionStatus,
            items: signal([]),
            collectionError: signal(null),
            lastSavedUserLearningItemId: signal(null),
            clearSaveState,
            saveLearningItem,
            saveSentence,
            loadCollection: vi.fn(),
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
            itemMutationStatus,
            addedItem: signal(null),
            loadCollection: vi.fn(),
            addItem: vi.fn(),
            clearItemMutationState: vi.fn(),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(LookupPage);
    fixture.detectChanges();
  });

  /** Form search outputunun gerçek en→tr LookupRequest olarak facade'a gönderildiğini doğrular. */
  it('dispatches an English to Turkish lookup request', () => {
    const searchForm = fixture.debugElement.query(By.directive(LookupSearchForm))
      .componentInstance as LookupSearchForm;

    searchForm.search.emit('ocean');

    expect(search).toHaveBeenCalledWith({
      text: 'ocean',
      sourceLanguageCode: 'en',
      targetLanguageCode: 'tr',
    });
  });

  /** Form clear outputunun lookup feature state temizliğine iletildiğini doğrular. */
  it('clears lookup state when the form is cleared', () => {
    const searchForm = fixture.debugElement.query(By.directive(LookupSearchForm))
      .componentInstance as LookupSearchForm;

    searchForm.cleared.emit();

    expect(clear).toHaveBeenCalledOnce();
  });

  /** İlk görünümde mock recent/popular listelerinin render edilmediğini doğrular. */
  it('does not render mock search suggestions', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).not.toContain('Recent searches');
    expect(text).not.toContain('Popular today');
  });

  /** Word/phrase seçiminden canlı Swagger SaveLearningItemRequest üretildiğini doğrular. */
  it('dispatches a real learning item save request', () => {
    result.set(createLookupResult());
    fixture.detectChanges();
    const resultCard = fixture.debugElement.query(By.directive(LookupResultCard))
      .componentInstance as LookupResultCard;

    resultCard.saveRequested.emit({
      kind: 'learning-item',
      selectedMeaningId: '44444444-4444-4444-4444-444444444444',
    });

    expect(saveLearningItem).toHaveBeenCalledWith({
      learningItemId: '11111111-1111-1111-1111-111111111111',
      selectedMeaningId: '44444444-4444-4444-4444-444444444444',
      sourceLookupHistoryId: '33333333-3333-3333-3333-333333333333',
    });
  });

  /** Sentence seçiminden ayrı endpointin gerçek request alanlarının üretildiğini doğrular. */
  it('dispatches a real sentence save request', () => {
    result.set({
      ...createLookupResult(),
      learningItemId: null,
      wordId: null,
      sentenceId: '55555555-5555-5555-5555-555555555555',
      itemType: 'Sentence',
      text: 'The ocean is calm.',
      meanings: [],
      sentenceTranslations: [
        {
          sentenceTranslationId: '66666666-6666-6666-6666-666666666666',
          translatedText: 'Okyanus sakin.',
          sourceProvider: 'Azure',
          license: null,
        },
      ],
    });
    fixture.detectChanges();
    const resultCard = fixture.debugElement.query(By.directive(LookupResultCard))
      .componentInstance as LookupResultCard;

    resultCard.saveRequested.emit({ kind: 'sentence', translatedText: 'Okyanus sakin.' });

    expect(saveSentence).toHaveBeenCalledWith({
      sourceText: 'The ocean is calm.',
      translatedText: 'Okyanus sakin.',
      sourceLanguageCode: 'en',
      targetLanguageCode: 'tr',
      sourceLookupHistoryId: '33333333-3333-3333-3333-333333333333',
    });
  });
});

/** Lookup page save testlerinde kullanılan eksiksiz word result fixture'ını üretir. */
function createLookupResult(): LookupResult {
  return {
    learningItemId: '11111111-1111-1111-1111-111111111111',
    wordId: '22222222-2222-2222-2222-222222222222',
    phraseId: null,
    sentenceId: null,
    lookupHistoryId: '33333333-3333-3333-3333-333333333333',
    text: 'ocean',
    normalizedText: 'ocean',
    itemType: 'Word',
    sourceLanguageCode: 'en',
    targetLanguageCode: 'tr',
    lookupSource: 'Database',
    contentSource: 'Imported',
    qualityStatus: 'Verified',
    sourceType: 'Dictionary',
    isAlreadyInUserDictionary: false,
    meanings: [
      {
        meaningId: '44444444-4444-4444-4444-444444444444',
        translation: 'okyanus',
        definition: 'A large body of salt water.',
        exampleSentence: null,
        partOfSpeech: 'noun',
        contentSource: 'Imported',
        qualityStatus: 'Verified',
        sourceProvider: 'Kaikki',
      },
    ],
    sentenceTranslations: [],
  };
}
