/** Bu dosya, lookup result card metin üretimini ve ölü mutation butonu içermediğini doğrular. */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';

import { LookupResult } from '../../models/lookup-response.model';
import { buildLookupCopyText, LookupResultCard } from './lookup-result-card';
import { SaveToDictionaryButton } from '../save-to-dictionary-button/save-to-dictionary-button';

/** Result cardın backend verisini güvenli sunduğunu ve yalnızca local copy aksiyonu taşıdığını sınar. */
describe('LookupResultCard', () => {
  /** Her testte inputu atanmış standalone result card fixture'ını üretir. */
  function createFixture(
    result: LookupResult = createLookupResult(),
  ): ComponentFixture<LookupResultCard> {
    const fixture = TestBed.createComponent(LookupResultCard);
    fixture.componentRef.setInput('result', result);
    fixture.detectChanges();
    return fixture;
  }

  /** Backend result, meaning ve provider alanlarının ekranda gösterildiğini doğrular. */
  it('renders real lookup result fields', () => {
    const text = (createFixture().nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('ocean');
    expect(text).toContain('okyanus');
    expect(text).toContain('Kaikki');
  });

  /** Gerçek dictionary save ve birleşik deck aksiyonlarının birlikte göründüğünü doğrular. */
  it('renders the real save and add-to-deck actions', () => {
    const text = (createFixture().nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('Save to Dictionary');
    expect(text).toContain('Add to Deck');
    expect(text).toContain('Copy result');
  });

  /** Varsayılan ilk meaning seçiminin parent sayfaya canonical UUID olarak iletildiğini doğrular. */
  it('emits the selected meaning for dictionary save', () => {
    const fixture = createFixture();
    const selections: unknown[] = [];
    fixture.componentInstance.saveRequested.subscribe((selection) => selections.push(selection));
    const saveButton = fixture.debugElement.query(By.directive(SaveToDictionaryButton))
      .componentInstance as SaveToDictionaryButton;

    saveButton.saveRequested.emit();

    expect(selections).toEqual([
      {
        kind: 'learning-item',
        selectedMeaningId: '44444444-4444-4444-4444-444444444444',
      },
    ]);
  });

  /** Sentence sonucunda ilk geçerli gerçek çevirinin ayrı save intenti olarak yayınlandığını doğrular. */
  it('emits the selected sentence translation for dictionary save', () => {
    const fixture = createFixture({
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
    const selections: unknown[] = [];
    fixture.componentInstance.saveRequested.subscribe((selection) => selections.push(selection));
    const saveButton = fixture.debugElement.query(By.directive(SaveToDictionaryButton))
      .componentInstance as SaveToDictionaryButton;

    saveButton.saveRequested.emit();

    expect(selections).toEqual([{ kind: 'sentence', translatedText: 'Okyanus sakin.' }]);
  });

  /** Clipboard metninin backend meaning ve sentence translation içeriğini koruduğunu doğrular. */
  it('builds clipboard text from the lookup result', () => {
    const result = {
      ...createLookupResult(),
      sentenceTranslations: [
        {
          sentenceTranslationId: null,
          translatedText: 'Okyanus sakin.',
          sourceProvider: 'Azure',
          license: null,
        },
      ],
    };

    expect(buildLookupCopyText(result)).toContain('okyanus — A large body of salt water.');
    expect(buildLookupCopyText(result)).toContain('Okyanus sakin.');
  });
});

/** Result card testlerinde kullanılan eksiksiz lookup görünüm fixture'ını üretir. */
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
