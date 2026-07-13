/** Bu dosya, canlı Swagger'daki user dictionary response DTO'larını transport katmanı için tanımlar. */

/** Dictionary item içinde seçilen meaning alanının ham transport modelidir. */
export interface UserDictionaryMeaningResponseDto {
  readonly meaningId: string;
  readonly translation: string | null;
  readonly definition: string | null;
  readonly partOfSpeech: string | null;
  readonly isPrimary: boolean;
  readonly displayOrder: number;
}

/** Dictionary sentence item içindeki seçili çevirinin ham transport modelidir. */
export interface UserDictionarySentenceTranslationResponseDto {
  readonly sentenceTranslationId: string;
  readonly translatedText: string | null;
  readonly targetLanguageCode: string | null;
  readonly isPrimary: boolean;
  readonly displayOrder: number;
}

/** Liste ve detay endpointlerinin ortak dictionary item transport modelidir. */
export interface UserDictionaryItemResponseDto {
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
  readonly sentenceTranslation: UserDictionarySentenceTranslationResponseDto | null;
  readonly selectedMeaning: UserDictionaryMeaningResponseDto | null;
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

/** `GET /api/user-dictionary` payloadının nullable item listesini taşıyan transport modelidir. */
export interface GetMyDictionaryResponseDto {
  readonly totalCount: number;
  readonly items: readonly UserDictionaryItemResponseDto[] | null;
}

/** Notes endpointlerinin tek not kaydı için döndürdüğü ham transport modelidir. */
export interface UserLearningNoteResponseDto {
  readonly userLearningNoteId: string;
  readonly userLearningItemId: string;
  readonly noteText: string | null;
  readonly createdAt: string;
  readonly updatedAt: string | null;
}

/** `GET .../notes` payloadının nullable not listesini taşıyan transport modelidir. */
export interface GetUserLearningNotesResponseDto {
  readonly totalCount: number;
  readonly items: readonly UserLearningNoteResponseDto[] | null;
}

/** Flags endpointlerinin tek flag kaydı için döndürdüğü ham transport modelidir. */
export interface UserLearningFlagResponseDto {
  readonly userLearningFlagId: string;
  readonly userLearningItemId: string;
  readonly flagType: string | null;
  readonly createdAt: string;
}

/** `GET .../flags` payloadının nullable flag listesini taşıyan transport modelidir. */
export interface GetUserLearningFlagsResponseDto {
  readonly totalCount: number;
  readonly items: readonly UserLearningFlagResponseDto[] | null;
}

/** Notes endpointlerinin tek not kaydı için döndürdüğü ham transport modelidir. */
export interface UserLearningNoteResponseDto {
  readonly userLearningNoteId: string;
  readonly userLearningItemId: string;
  readonly noteText: string | null;
  readonly createdAt: string;
  readonly updatedAt: string | null;
}

/** `GET .../notes` payloadının nullable not listesini taşıyan transport modelidir. */
export interface GetUserLearningNotesResponseDto {
  readonly totalCount: number;
  readonly items: readonly UserLearningNoteResponseDto[] | null;
}

/** Notes endpointlerinin tek not kaydı için döndürdüğü ham transport modelidir. */
export interface UserLearningNoteResponseDto {
  readonly userLearningNoteId: string;
  readonly userLearningItemId: string;
  readonly noteText: string | null;
  readonly createdAt: string;
  readonly updatedAt: string | null;
}

/** `GET .../notes` payloadının nullable not listesini taşıyan transport modelidir. */
export interface GetUserLearningNotesResponseDto {
  readonly totalCount: number;
  readonly items: readonly UserLearningNoteResponseDto[] | null;
}

/** Word/phrase save endpointinin oluşturduğu dictionary kayıt transport modelidir. */
export interface SaveLearningItemResponseDto {
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

/** Sentence save endpointinin oluşturduğu dictionary kayıt transport modelidir. */
export interface SaveSentenceToDictionaryResponseDto {
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
