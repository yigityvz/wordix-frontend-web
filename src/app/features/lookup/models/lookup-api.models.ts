/** Bu dosya, canlı Swagger'daki lookup response DTO'larını transport katmanı için birebir tanımlar. */

/** Backend lookup sonucundaki tek bir anlamın ham transport modelidir. */
export interface LookupMeaningResponseDto {
  /** Dictionary save akışında backend'e geri gönderilebilen meaning kimliğidir. */
  readonly meaningId: string;

  /** Hedef dildeki kısa karşılıktır. */
  readonly translation: string | null;

  /** Backend sağlayıcısından gelen açıklamadır. */
  readonly definition: string | null;

  /** Anlamla ilişkili örnek cümledir. */
  readonly exampleSentence: string | null;

  /** Backend tarafından döndürülen sözcük türüdür. */
  readonly partOfSpeech: string | null;

  /** İçeriğin backend kaynak sınıflandırmasıdır. */
  readonly contentSource: string | null;

  /** İçeriğin backend kalite durumudur. */
  readonly qualityStatus: string | null;

  /** İçeriği sağlayan gerçek provider bilgisidir. */
  readonly sourceProvider: string | null;
}

/** Cümle lookup sonucundaki tek bir çevirinin ham transport modelidir. */
export interface LookupSentenceTranslationResponseDto {
  /** Varsa kalıcı sentence translation kimliğidir. */
  readonly sentenceTranslationId: string | null;

  /** Backend tarafından üretilen hedef dil metnidir. */
  readonly translatedText: string | null;

  /** Çeviriyi sağlayan gerçek provider bilgisidir. */
  readonly sourceProvider: string | null;

  /** Provider içeriğiyle ilişkili lisans bilgisidir. */
  readonly license: string | null;
}

/** `LookupResponse` şemasının nullable alanlarını koruyan ham endpoint payload modelidir. */
export interface LookupResponseDto {
  /** Word/phrase sonuçlarında dictionary save için kullanılan learning item kimliğidir. */
  readonly learningItemId: string | null;

  /** Sonuç word ise backend word kimliğidir. */
  readonly wordId: string | null;

  /** Sonuç phrase ise backend phrase kimliğidir. */
  readonly phraseId: string | null;

  /** Sonuç sentence ise backend sentence kimliğidir. */
  readonly sentenceId: string | null;

  /** Save akışında kaynak lookup kaydını ilişkilendiren zorunlu kimliktir. */
  readonly lookupHistoryId: string;

  /** Backend'in sonuçta döndürdüğü asıl metindir. */
  readonly text: string | null;

  /** Arama ve eşleştirme için normalize edilmiş metindir. */
  readonly normalizedText: string | null;

  /** Word, phrase veya sentence sınıflandırmasının backend metin değeridir. */
  readonly itemType: string | null;

  /** Sonuçta doğrulanan kaynak dil kodudur. */
  readonly sourceLanguageCode: string | null;

  /** Sonuçta doğrulanan hedef dil kodudur. */
  readonly targetLanguageCode: string | null;

  /** Lookup operasyonunun backend kaynak sınıflandırmasıdır. */
  readonly lookupSource: string | null;

  /** İçeriğin backend kaynak sınıflandırmasıdır. */
  readonly contentSource: string | null;

  /** Sonucun backend kalite durumudur. */
  readonly qualityStatus: string | null;

  /** Sonucun backend source type değeridir. */
  readonly sourceType: string | null;

  /** Learning item'ın mevcut kullanıcı sözlüğünde olup olmadığını backendden bildirir. */
  readonly isAlreadyInUserDictionary: boolean;

  /** Word/phrase anlamlarının nullable transport listesidir. */
  readonly meanings: readonly LookupMeaningResponseDto[] | null;

  /** Sentence çevirilerinin nullable transport listesidir. */
  readonly sentenceTranslations: readonly LookupSentenceTranslationResponseDto[] | null;
}
