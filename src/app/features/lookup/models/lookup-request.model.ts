/** Bu dosya, canlı Swagger'daki `POST /api/lookups` request sözleşmesini tanımlar. */

/** Smart lookup isteğinde backend'e gönderilen üç zorunlu kullanıcı girdisidir. */
export interface LookupRequest {
  /** Aranacak kelime, ifade veya cümle metnidir. */
  readonly text: string;

  /** Girilen metnin ISO/desteklenen kaynak dil kodudur. */
  readonly sourceLanguageCode: string;

  /** Sonucun üretileceği ISO/desteklenen hedef dil kodudur. */
  readonly targetLanguageCode: string;
}
