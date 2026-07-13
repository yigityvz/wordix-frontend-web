/** Bu dosya, canlı Swagger'daki dictionary save ve note mutation request sözleşmelerini tanımlar. */

/** Mevcut learning item'ı kullanıcı sözlüğüne kaydeden request modelidir. */
export interface SaveLearningItemRequest {
  /** Lookup sonucundan gelen canonical learning item UUID değeridir. */
  readonly learningItemId: string;

  /** Backend sözleşmesinin desteklediği tek seçili meaning UUID değeridir. */
  readonly selectedMeaningId: string | null;

  /** Kaydın üretildiği lookup history UUID değeridir. */
  readonly sourceLookupHistoryId: string | null;
}

/** Sentence lookup sonucunu ayrı backend endpointiyle sözlüğe kaydeden request modelidir. */
export interface SaveSentenceToDictionaryRequest {
  /** Kullanıcının aradığı kaynak cümle metnidir. */
  readonly sourceText: string;

  /** Backend lookup sonucundan seçilen gerçek çeviri metnidir. */
  readonly translatedText: string;

  /** Kaynak cümlenin backend dil kodudur. */
  readonly sourceLanguageCode: string;

  /** Çeviri metninin backend dil kodudur. */
  readonly targetLanguageCode: string;

  /** Kaydın üretildiği lookup history UUID değeridir. */
  readonly sourceLookupHistoryId: string | null;
}

/** Note create ve update endpointlerinin paylaştığı metin request modelidir. */
export interface SaveDictionaryNoteRequest {
  /** Kullanıcının boşluklardan arındırılmış gerçek not metnidir. */
  readonly noteText: string;
}

/** F8B UI kapsamında kullanıcının yönetebildiği canonical backend flag tipleridir. */
export type EditableDictionaryFlagType = 'Favorite' | 'Difficult';

/** Flag create endpointinin beklediği canonical enum adını taşıyan request modelidir. */
export interface SetDictionaryFlagRequest {
  /** Backend `UserLearningFlagType` enum adıyla birebir eşleşen flag değeridir. */
  readonly flagType: EditableDictionaryFlagType;
}
