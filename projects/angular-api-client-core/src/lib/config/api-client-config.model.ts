/**
 * API client kütüphanesinin uygulamadan aldığı minimum çalışma ayarını tanımlar.
 * Backend veya environment ayrıntılarını genel HTTP çekirdeğine taşımadan base URL sağlar.
 */

/** Tüm relative endpointlerin bağlanacağı API kök adresini taşır. */
export interface ApiClientConfig {
  /** Consumer uygulamanın protokol, host ve opsiyonel kök path içeren API adresidir. */
  readonly baseUrl: string;
}
