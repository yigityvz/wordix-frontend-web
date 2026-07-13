/** Bu dosya, canlı Swagger'daki deck create ve item add request sözleşmelerini tanımlar. */

/** Authenticated kullanıcı için yeni deck oluşturan request modelidir. */
export interface CreateDeckRequest {
  /** Kullanıcının verdiği ve UI tarafında trim edilecek deck adıdır. */
  readonly name: string;

  /** Opsiyonel deck açıklamasıdır; ownership alanı içermez. */
  readonly description: string | null;
}

/** Mevcut dictionary itemını seçilen deck'e ekleyen request modelidir. */
export interface AddItemToDeckRequest {
  /** Authenticated kullanıcıya ait canonical dictionary item UUID değeridir. */
  readonly userLearningItemId: string;
}
