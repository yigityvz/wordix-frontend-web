/** Bu dosya, deck state ve UI katmanının kullanacağı normalize salt-okunur modelleri tanımlar. */

/** Deck item içinde kullanıcıya gösterilecek seçili meaning modelidir. */
export interface DeckMeaning {
  readonly meaningId: string;
  readonly translation: string | null;
  readonly definition: string | null;
  readonly partOfSpeech: string | null;
  readonly isPrimary: boolean;
  readonly displayOrder: number;
}

/** Deck item içinde kullanıcıya gösterilecek sentence translation modelidir. */
export interface DeckSentenceTranslation {
  readonly sentenceTranslationId: string;
  readonly translatedText: string | null;
  readonly targetLanguageCode: string | null;
  readonly isPrimary: boolean;
  readonly displayOrder: number;
}

/** Deck detail içinde gösterilecek normalize dictionary item modelidir. */
export interface DeckItem {
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
  readonly selectedMeaning: DeckMeaning | null;
  readonly sentenceTranslation: DeckSentenceTranslation | null;
  readonly addedAt: string;
}

/** Deck liste ve seçim akışlarında kullanılan normalize özet modelidir. */
export interface DeckSummary {
  readonly deckId: string;
  readonly name: string;
  readonly normalizedName: string;
  readonly description: string | null;
  readonly itemCount: number;
  readonly createdAt: string;
  readonly updatedAt: string | null;
  readonly isActive: boolean;
}

/** Nullable backend deck listesini boş diziye normalize eden collection modelidir. */
export interface DeckCollection {
  readonly totalCount: number;
  readonly decks: readonly DeckSummary[];
}

/** Tek deck ve normalize item listesini taşıyan detail modelidir. */
export interface DeckDetail extends DeckSummary {
  readonly items: readonly DeckItem[];
}

/** Create deck mutationından sonra oluşan normalize deck kaydıdır. */
export interface CreatedDeck {
  readonly deckId: string;
  readonly name: string;
  readonly normalizedName: string;
  readonly description: string | null;
  readonly createdAt: string;
  readonly isActive: boolean;
}

/** Item add mutationından sonra oluşan deck ilişkisi modelidir. */
export interface AddedDeckItem {
  readonly deckItemId: string;
  readonly deckId: string;
  readonly userLearningItemId: string;
  readonly addedAt: string;
}

/** Item remove mutationının backend tarafından doğrulanan sonuç modelidir. */
export interface RemovedDeckItem {
  readonly deckId: string;
  readonly userLearningItemId: string;
  readonly removedDeckItemId: string;
  readonly removed: boolean;
}
