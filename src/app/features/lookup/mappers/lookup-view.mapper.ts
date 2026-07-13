/** Bu dosya, ham Swagger lookup DTO'sunu state ve UI için kararlı görünüm modeline dönüştürür. */
import {
  LookupMeaningResponseDto,
  LookupResponseDto,
  LookupSentenceTranslationResponseDto,
} from '../models/lookup-api.models';
import {
  LookupMeaning,
  LookupResult,
  LookupSentenceTranslation,
} from '../models/lookup-response.model';

/** Lookup response alanlarını kaybetmeden nullable listeleri boş salt-okunur dizilere normalize eder. */
export function mapLookupResult(dto: LookupResponseDto): LookupResult {
  return {
    learningItemId: dto.learningItemId,
    wordId: dto.wordId,
    phraseId: dto.phraseId,
    sentenceId: dto.sentenceId,
    lookupHistoryId: dto.lookupHistoryId,
    text: dto.text,
    normalizedText: dto.normalizedText,
    itemType: dto.itemType,
    sourceLanguageCode: dto.sourceLanguageCode,
    targetLanguageCode: dto.targetLanguageCode,
    lookupSource: dto.lookupSource,
    contentSource: dto.contentSource,
    qualityStatus: dto.qualityStatus,
    sourceType: dto.sourceType,
    isAlreadyInUserDictionary: dto.isAlreadyInUserDictionary,
    meanings: (dto.meanings ?? []).map(mapLookupMeaning),
    sentenceTranslations: (dto.sentenceTranslations ?? []).map(mapSentenceTranslation),
  };
}

/** Ham meaning DTO'sunu provider ve kalite alanlarını koruyan UI modeline dönüştürür. */
function mapLookupMeaning(dto: LookupMeaningResponseDto): LookupMeaning {
  return {
    meaningId: dto.meaningId,
    translation: dto.translation,
    definition: dto.definition,
    exampleSentence: dto.exampleSentence,
    partOfSpeech: dto.partOfSpeech,
    contentSource: dto.contentSource,
    qualityStatus: dto.qualityStatus,
    sourceProvider: dto.sourceProvider,
  };
}

/** Ham sentence translation DTO'sunu lisans ve provider bilgisiyle UI modeline dönüştürür. */
function mapSentenceTranslation(
  dto: LookupSentenceTranslationResponseDto,
): LookupSentenceTranslation {
  return {
    sentenceTranslationId: dto.sentenceTranslationId,
    translatedText: dto.translatedText,
    sourceProvider: dto.sourceProvider,
    license: dto.license,
  };
}
