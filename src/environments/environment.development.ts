/**
 * Local Angular development build tarafından kullanılan public Wordix ayarlarını tanımlar.
 * angular.json file replacement sayesinde production config yerine derlemeye girer ve secret içermez.
 */
import { AppConfig } from '@core/config/app-config.model';

/** Local backend ve Keycloak Docker servislerine bağlanan typesafe development ayarlarıdır. */
export const environment = {
  // Local Wordix API servisinin public HTTP kök adresidir.
  apiBaseUrl: 'http://localhost:5000/api',

  // Local Keycloak public client bağlantı bilgilerini gruplar.
  keycloak: {
    // Docker/local Keycloak servisinin browser tarafından erişilebilir adresidir.
    url: 'http://localhost:8080',

    // Local ortamda da canonical Wordix realm adı kullanılır.
    realm: 'wordix',

    // Secret gerektirmeyen frontend public client kimliğidir.
    clientId: 'wordix-web',
  },
} as const satisfies AppConfig;
