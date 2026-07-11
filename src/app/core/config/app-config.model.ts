/**
 * Environment dosyalarının uyması gereken typesafe public configuration sözleşmesini tanımlar.
 * API ve authentication altyapısının string alanlarını tahmin etmesini veya secret kabul etmesini engeller.
 */

/** Keycloak Authorization Code + PKCE akışı için gerekli public client ayarlarıdır. */
export interface KeycloakAppConfig {
  /** Keycloak authorization serverının browser tarafından erişilebilir public adresidir. */
  readonly url: string;

  /** Wordix client ve rollerinin tanımlı olduğu realm adıdır. */
  readonly realm: string;

  /** Client secret kullanmayan public web client kimliğidir. */
  readonly clientId: string;
}

/** Uygulamanın environment bağımsız public runtime configuration sözleşmesidir. */
export interface AppConfig {
  /** Production optimizasyon ve davranışlarının aktif olup olmadığını belirtir. */
  readonly production: boolean;

  /** Feature API servislerinin endpoint yollarını birleştireceği Wordix API kök adresidir. */
  readonly apiBaseUrl: string;

  /** Authentication altyapısının kullanacağı public Keycloak ayarlarını gruplar. */
  readonly keycloak: KeycloakAppConfig;
}
