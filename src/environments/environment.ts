/**
 * Production build tarafından kullanılan public Wordix runtime ayarlarını tanımlar.
 * Secret taşımaz; deploy ortamına göre güvenli public URL ve Keycloak client kimliği içerir.
 */
import { AppConfig } from '@core/config/app-config.model';

/** Varsayılan bundle içine alınan typesafe ve salt-okunur uygulama ayarlarıdır. */
export const environment = {
  // Wordix API endpointlerinin türetileceği public API kök adresidir.
  apiBaseUrl: 'http://localhost:5000/api',

  // Browser tabanlı public Keycloak client için secret içermeyen bağlantı ayarlarıdır.
  keycloak: {
    // Keycloak authorization serverının public adresidir.
    url: 'http://localhost:8080',

    // Wordix kullanıcı ve rollerinin bulunduğu realm adıdır.
    realm: 'wordix',

    // Authorization Code + PKCE kullanan public frontend client kimliğidir.
    clientId: 'wordix-web',
  },
} as const satisfies AppConfig;
