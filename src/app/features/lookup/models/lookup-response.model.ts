/** Bu dosya, lookup state ve UI katmanının tüketeceği normalize edilmiş salt-okunur sonuç modellerini tanımlar. */

/** UI'ın tek bir lookup anlamı için kullandığı güvenli görünüm modelidir. */
export interface LookupMeaning {
  readonly meaningId: string;
  readonly translation: string | null;
  readonly definition: string | null;
  readonly exampleSentence: string | null;
  readonly partOfSpeech: string | null;
  readonly contentSource: string | null;
  readonly qualityStatus: string | null;
  readonly sourceProvider: string | null;
}

/** UI'ın tek bir sentence translation için kullandığı güvenli görünüm modelidir. */
export interface LookupSentenceTranslation {
  readonly sentenceTranslationId: string | null;
  readonly translatedText: string | null;
  readonly sourceProvider: string | null;
  readonly license: string | null;
}

/** Nullable listeleri boş diziye normalize edilmiş lookup görünüm sonucudur. */
export interface LookupResult {
  readonly learningItemId: string | null;
  readonly wordId: string | null;
  readonly phraseId: string | null;
  readonly sentenceId: string | null;
  readonly lookupHistoryId: string;
  readonly text: string | null;
  readonly normalizedText: string | null;
  readonly itemType: string | null;
  readonly sourceLanguageCode: string | null;
  readonly targetLanguageCode: string | null;
  readonly lookupSource: string | null;
  readonly contentSource: string | null;
  readonly qualityStatus: string | null;
  readonly sourceType: string | null;
  readonly isAlreadyInUserDictionary: boolean;
  readonly meanings: readonly LookupMeaning[];
  readonly sentenceTranslations: readonly LookupSentenceTranslation[];
}
