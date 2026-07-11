/**
 * Aktif Angular environment ayarlarını uygulama geneline salt-okunur ve tekil servis olarak sunar.
 * Featureların environment dosyasına doğrudan bağlanmasını ve config erişiminin dağılmasını engeller.
 */
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

import { AppConfig, KeycloakAppConfig } from './app-config.model';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  /** Seçili build configuration tarafından sağlanan environment nesnesini tek kaynak olarak tutar. */
  private readonly config: AppConfig = environment;

  /** Uygulamanın production build olup olmadığını salt-okunur olarak döndürür. */
  get production(): boolean {
    // Consumer aktif environment nesnesine doğrudan erişmeden boolean değeri alır.
    return this.config.production;
  }

  /** Wordix API kök adresini feature API servislerine merkezi olarak sunar. */
  get apiBaseUrl(): string {
    // Endpoint servisleri route parçalarını bu tek public base URL ile birleştirecektir.
    return this.config.apiBaseUrl;
  }

  /** Keycloak public client ayarlarını authentication altyapısına salt-okunur contract olarak sunar. */
  get keycloak(): KeycloakAppConfig {
    // Nested config nesnesi readonly interface üzerinden döndürülerek mutation niyeti engellenir.
    return this.config.keycloak;
  }

  /** Tanılama veya altyapı composition ihtiyacı için tüm public config snapshotını döndürür. */
  get snapshot(): AppConfig {
    // Service consumerı aktif build ayarlarını typesafe tek nesne olarak okuyabilir.
    return this.config;
  }
}
