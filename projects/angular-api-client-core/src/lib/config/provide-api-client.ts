/**
 * API client yapılandırmasını standalone Angular uygulamalarına provider olarak ekler.
 * Consumerların kütüphanenin injection token ayrıntılarını bilmeden kurulum yapmasını sağlar.
 */
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { ApiClientConfig } from './api-client-config.model';
import { API_CLIENT_CONFIG } from './api-client-config.token';

/** API client ayarını doğrulayıp Angular environment provider koleksiyonuna dönüştürür. */
export function provideApiClient(config: ApiClientConfig): EnvironmentProviders {
  // Hatalı base URL değerinin ilk HTTP çağrısına kadar gizlenmesini önler.
  const normalizedConfig = normalizeConfig(config);

  // Consumer uygulamanın bootstrap providers listesinde kullanılabilecek provider grubunu döndürür.
  return makeEnvironmentProviders([
    {
      provide: API_CLIENT_CONFIG,
      useValue: normalizedConfig,
    },
  ]);
}

/** Dışarıdan alınan ayarı immutable ve normalize edilmiş library contractına çevirir. */
function normalizeConfig(config: ApiClientConfig): ApiClientConfig {
  // Boş veya yalnızca whitespace içeren base URL ile geçersiz request üretilmesini engeller.
  const baseUrl = config.baseUrl.trim();
  if (!baseUrl) {
    throw new Error('API client baseUrl değeri boş olamaz.');
  }

  // Son slashleri tek noktada kaldırarak endpoint birleştirmesinin tutarlı kalmasını sağlar.
  return Object.freeze({ baseUrl: baseUrl.replace(/\/+$/, '') });
}
