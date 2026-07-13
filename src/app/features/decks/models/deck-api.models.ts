/** Bu dosya, canlı Swagger'daki deck response DTO'larını transport katmanı için tanımlar. */

/** Deck item içindeki seçili meaning alanının ham transport modelidir. */
export interface DeckMeaningResponseDto {
  readonly meaningId: string;
  readonly translation: string | null;
  readonly definition: string | null;
  readonly partOfSpeech: string | null;
  readonly isPrimary: boolean;
  readonly displayOrder: number;
}

/** Deck item içindeki sentence translation alanının ham transport modelidir. */
export interface DeckSentenceTranslationResponseDto {
  readonly sentenceTranslationId: string;
  readonly translatedText: string | null;
  readonly targetLanguageCode: string | null;
  readonly isPrimary: boolean;
  readonly displayOrder: number;
}

/** Deck detail içindeki tek dictionary itemın ham transport modelidir. */
export interface DeckItemResponseDto {
  readonly deckItemId: string;
  readonly userLearningItemId: string;
  readonly learningItemId: string;
  readonly wordId: string | null;
  readonly phraseId: string | null;
  readonly sentenceId: string | null;
  readonly itemType: string | null;
  readonly displayText: string | null;
  readonly normalizedText: string | null;
  readonly sourceLanguageCode: string | null;
  readonly selectedMeaning: DeckMeaningResponseDto | null;
  readonly sentenceTranslation: DeckSentenceTranslationResponseDto | null;
  readonly addedAt: string;
}

/** Deck liste endpointindeki tek özet kaydın ham transport modelidir. */
export interface DeckSummaryResponseDto {
  readonly deckId: string;
  readonly name: string | null;
  readonly normalizedName: string | null;
  readonly description: string | null;
  readonly itemCount: number;
  readonly createdAt: string;
  readonly updatedAt: string | null;
  readonly isActive: boolean;
}

/** `GET /api/decks` payloadının nullable deck listesini taşıyan transport modelidir. */
export interface GetMyDecksResponseDto {
  readonly totalCount: number;
  readonly decks: readonly DeckSummaryResponseDto[] | null;
}

/** Tek deck ve nullable item listesini taşıyan detail transport modelidir. */
export interface DeckDetailResponseDto extends DeckSummaryResponseDto {
  readonly items: readonly DeckItemResponseDto[] | null;
}

/** Create deck endpointinin oluşturduğu kayıt transport modelidir. */
export interface CreateDeckResponseDto {
  readonly deckId: string;
  readonly name: string | null;
  readonly normalizedName: string | null;
  readonly description: string | null;
  readonly createdAt: string;
  readonly isActive: boolean;
}

/** Deck item add endpointinin oluşturduğu ilişki transport modelidir. */
export interface AddItemToDeckResponseDto {
  readonly deckItemId: string;
  readonly deckId: string;
  readonly userLearningItemId: string;
  readonly addedAt: string;
}

/** Deck item remove endpointinin gerçek sonuç transport modelidir. */
export interface RemoveItemFromDeckResponseDto {
  readonly deckId: string;
  readonly userLearningItemId: string;
  readonly removedDeckItemId: string;
  readonly removed: boolean;
}
