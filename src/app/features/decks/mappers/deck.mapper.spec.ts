/** Bu dosya, deck DTO mapperlarının nullable collection ve nested item dönüşümlerini doğrular. */
import { describe, expect, it } from 'vitest';

import { mapDeckCollection, mapDeckDetail } from './deck.mapper';

/** Transport nullability bilgisinin UI stateine güvenli biçimde normalize edildiğini sınar. */
describe('deck mappers', () => {
  /** Nullable backend deck listesinin kararlı boş diziye dönüştüğünü doğrular. */
  it('normalizes a nullable deck collection', () => {
    expect(mapDeckCollection({ totalCount: 0, decks: null })).toEqual({
      totalCount: 0,
      decks: [],
    });
  });

  /** Nested meaning alanını ve nullable deck adını detail modeline dönüştürdüğünü doğrular. */
  it('maps a deck detail with nested item content', () => {
    const result = mapDeckDetail({
      deckId: '11111111-1111-1111-1111-111111111111',
      name: null,
      normalizedName: null,
      description: null,
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
    });

    expect(result.name).toBe('');
    expect(result.items[0]?.selectedMeaning?.translation).toBe('okyanus');
  });
});
