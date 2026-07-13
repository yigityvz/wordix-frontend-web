/** Bu dosya, dictionary state ve UI katmanının kullanacağı normalize salt-okunur modelleri tanımlar. */

/** Dictionary item içinde kullanıcıya gösterilecek seçili meaning modelidir. */
export interface DictionaryMeaning {
  readonly meaningId: string;
  readonly translation: string | null;
  readonly definition: string | null;
  readonly partOfSpeech: string | null;
  readonly isPrimary: boolean;
  readonly displayOrder: number;
}

/** Sentence dictionary item içinde kullanıcıya gösterilecek çeviri modelidir. */
export interface DictionarySentenceTranslation {
  readonly sentenceTranslationId: string;
  readonly translatedText: string | null;
  readonly targetLanguageCode: string | null;
  readonly isPrimary: boolean;
  readonly displayOrder: number;
}

/** Liste ve detay ekranlarının ortak kullanacağı normalize dictionary item modelidir. */
export interface DictionaryItem {
  readonly userLearningItemId: string;
  readonly learningItemId: string;
  readonly wordId: string | null;
  readonly phraseId: string | null;
  readonly sentenceId: string | null;
  readonly itemType: string | null;
  readonly displayText: string | null;
  readonly normalizedText: string | null;
  readonly sourceLanguageCode: string | null;
  readonly selectedMeaningId: string | null;
  readonly sentenceTranslation: DictionarySentenceTranslation | null;
  readonly selectedMeaning: DictionaryMeaning | null;
  readonly savedAt: string;
  readonly sourceLookupHistoryId: string | null;
  readonly learningStatus: string | null;
  readonly learningConfidenceScore: number;
  readonly isFavorite: boolean;
  readonly isDifficult: boolean;
  readonly wantsMorePractice: boolean;
  readonly isIgnored: boolean;
  readonly noteCount: number;
  readonly isActive: boolean;
}

/** Nullable backend listesini boş diziye normalize eden dictionary collection modelidir. */
export interface DictionaryCollection {
  readonly totalCount: number;
  readonly items: readonly DictionaryItem[];
}

/** Dictionary detail içinde gösterilen normalize kullanıcı notudur. */
export interface DictionaryNote {
  readonly userLearningNoteId: string;
  readonly userLearningItemId: string;
  readonly noteText: string;
  readonly createdAt: string;
  readonly updatedAt: string | null;
}

/** Nullable backend listesini boş diziye normalize eden notes collection modelidir. */
export interface DictionaryNotesCollection {
  readonly totalCount: number;
  readonly items: readonly DictionaryNote[];
}

/** Backendden gelen flag tipini kayıp olmadan taşıyan normalize kullanıcı flag kaydıdır. */
export interface DictionaryFlag {
  readonly userLearningFlagId: string;
  readonly userLearningItemId: string;
  readonly flagType: string;
  readonly createdAt: string;
}

/** Nullable backend listesini boş diziye normalize eden flags collection modelidir. */
export interface DictionaryFlagsCollection {
  readonly totalCount: number;
  readonly items: readonly DictionaryFlag[];
}

/** Word/phrase save işleminden sonraki canonical kayıt ve progress sonucudur. */
export interface SavedLearningItem {
  readonly userLearningItemId: string;
  readonly learningItemId: string;
  readonly selectedMeaningId: string | null;
  readonly userLearningProgressId: string;
  readonly sourceLookupHistoryId: string | null;
  readonly savedAt: string;
  readonly learningStatus: string | null;
  readonly learningConfidenceScore: number;
  readonly isActive: boolean;
}

/** Sentence save işleminden sonraki canonical kayıt, çeviri ve progress sonucudur. */
export interface SavedSentenceItem {
  readonly userLearningItemId: string;
  readonly learningItemId: string;
  readonly sentenceId: string;
  readonly sentenceTranslationId: string;
  readonly sourceText: string | null;
  readonly normalizedSourceText: string | null;
  readonly translatedText: string | null;
  readonly normalizedTranslatedText: string | null;
  readonly userLearningProgressId: string;
  readonly sourceLookupHistoryId: string | null;
  readonly savedAt: string;
  readonly learningStatus: string | null;
  readonly learningConfidenceScore: number;
  readonly isActive: boolean;
}
