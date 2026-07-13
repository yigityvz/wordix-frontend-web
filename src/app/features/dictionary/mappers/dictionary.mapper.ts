/** Bu dosya, user dictionary transport DTO'larını state ve UI için normalize modellere dönüştürür. */
import {
  GetMyDictionaryResponseDto,
  GetUserLearningNotesResponseDto,
  GetUserLearningFlagsResponseDto,
  SaveLearningItemResponseDto,
  SaveSentenceToDictionaryResponseDto,
  UserDictionaryItemResponseDto,
  UserDictionaryMeaningResponseDto,
  UserDictionarySentenceTranslationResponseDto,
  UserLearningNoteResponseDto,
  UserLearningFlagResponseDto,
} from '../models/dictionary-api.models';
import {
  DictionaryCollection,
  DictionaryItem,
  DictionaryMeaning,
  DictionaryNote,
  DictionaryNotesCollection,
  DictionaryFlag,
  DictionaryFlagsCollection,
  DictionarySentenceTranslation,
  SavedLearningItem,
  SavedSentenceItem,
} from '../models/dictionary.models';

/** Nullable dictionary item listesini boş diziye normalize edip total count değerini korur. */
export function mapDictionaryCollection(dto: GetMyDictionaryResponseDto): DictionaryCollection {
  return {
    totalCount: dto.totalCount,
    items: (dto.items ?? []).map(mapDictionaryItem),
  };
}

/** Nullable note listesini boş diziye normalize edip backend total count değerini korur. */
export function mapDictionaryNotesCollection(
  dto: GetUserLearningNotesResponseDto,
): DictionaryNotesCollection {
  return {
    totalCount: dto.totalCount,
    items: (dto.items ?? []).map(mapDictionaryNote),
  };
}

/** Ham note DTO'sunu UI için null metin içermeyen normalize modele dönüştürür. */
export function mapDictionaryNote(dto: UserLearningNoteResponseDto): DictionaryNote {
  return {
    userLearningNoteId: dto.userLearningNoteId,
    userLearningItemId: dto.userLearningItemId,
    noteText: dto.noteText ?? '',
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

/** Nullable flag listesini boş diziye normalize edip backend total count değerini korur. */
export function mapDictionaryFlagsCollection(
  dto: GetUserLearningFlagsResponseDto,
): DictionaryFlagsCollection {
  return {
    totalCount: dto.totalCount,
    items: (dto.items ?? []).map(mapDictionaryFlag),
  };
}

/** Ham flag DTO'sunu null flag type içermeyen normalize modele dönüştürür. */
export function mapDictionaryFlag(dto: UserLearningFlagResponseDto): DictionaryFlag {
  return {
    userLearningFlagId: dto.userLearningFlagId,
    userLearningItemId: dto.userLearningItemId,
    flagType: dto.flagType ?? '',
    createdAt: dto.createdAt,
  };
}

/** Liste veya detay DTO'sunu flags, progress ve selected content alanlarıyla UI modeline dönüştürür. */
export function mapDictionaryItem(dto: UserDictionaryItemResponseDto): DictionaryItem {
  return {
    userLearningItemId: dto.userLearningItemId,
    learningItemId: dto.learningItemId,
    wordId: dto.wordId,
    phraseId: dto.phraseId,
    sentenceId: dto.sentenceId,
    itemType: dto.itemType,
    displayText: dto.displayText,
    normalizedText: dto.normalizedText,
    sourceLanguageCode: dto.sourceLanguageCode,
    selectedMeaningId: dto.selectedMeaningId,
    sentenceTranslation: dto.sentenceTranslation
      ? mapSentenceTranslation(dto.sentenceTranslation)
      : null,
    selectedMeaning: dto.selectedMeaning ? mapDictionaryMeaning(dto.selectedMeaning) : null,
    savedAt: dto.savedAt,
    sourceLookupHistoryId: dto.sourceLookupHistoryId,
    learningStatus: dto.learningStatus,
    learningConfidenceScore: dto.learningConfidenceScore,
    isFavorite: dto.isFavorite,
    isDifficult: dto.isDifficult,
    wantsMorePractice: dto.wantsMorePractice,
    isIgnored: dto.isIgnored,
    noteCount: dto.noteCount,
    isActive: dto.isActive,
  };
}

/** Word/phrase save responseunu sonraki dictionary ve deck akışlarının kullanacağı modele dönüştürür. */
export function mapSavedLearningItem(dto: SaveLearningItemResponseDto): SavedLearningItem {
  return {
    userLearningItemId: dto.userLearningItemId,
    learningItemId: dto.learningItemId,
    selectedMeaningId: dto.selectedMeaningId,
    userLearningProgressId: dto.userLearningProgressId,
    sourceLookupHistoryId: dto.sourceLookupHistoryId,
    savedAt: dto.savedAt,
    learningStatus: dto.learningStatus,
    learningConfidenceScore: dto.learningConfidenceScore,
    isActive: dto.isActive,
  };
}

/** Sentence save responseunu canonical item ve translation UUID alanlarını koruyan modele dönüştürür. */
export function mapSavedSentenceItem(dto: SaveSentenceToDictionaryResponseDto): SavedSentenceItem {
  return {
    userLearningItemId: dto.userLearningItemId,
    learningItemId: dto.learningItemId,
    sentenceId: dto.sentenceId,
    sentenceTranslationId: dto.sentenceTranslationId,
    sourceText: dto.sourceText,
    normalizedSourceText: dto.normalizedSourceText,
    translatedText: dto.translatedText,
    normalizedTranslatedText: dto.normalizedTranslatedText,
    userLearningProgressId: dto.userLearningProgressId,
    sourceLookupHistoryId: dto.sourceLookupHistoryId,
    savedAt: dto.savedAt,
    learningStatus: dto.learningStatus,
    learningConfidenceScore: dto.learningConfidenceScore,
    isActive: dto.isActive,
  };
}

/** Ham selected meaning DTO'sunu dictionary görünüm modeline dönüştürür. */
function mapDictionaryMeaning(dto: UserDictionaryMeaningResponseDto): DictionaryMeaning {
  return {
    meaningId: dto.meaningId,
    translation: dto.translation,
    definition: dto.definition,
    partOfSpeech: dto.partOfSpeech,
    isPrimary: dto.isPrimary,
    displayOrder: dto.displayOrder,
  };
}

/** Ham selected sentence translation DTO'sunu dictionary görünüm modeline dönüştürür. */
function mapSentenceTranslation(
  dto: UserDictionarySentenceTranslationResponseDto,
): DictionarySentenceTranslation {
  return {
    sentenceTranslationId: dto.sentenceTranslationId,
    translatedText: dto.translatedText,
    targetLanguageCode: dto.targetLanguageCode,
    isPrimary: dto.isPrimary,
    displayOrder: dto.displayOrder,
  };
}
