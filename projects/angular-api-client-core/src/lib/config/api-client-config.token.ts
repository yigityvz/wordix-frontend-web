/**
 * API client ayarını Angular dependency injection üzerinden base servislere ulaştırır.
 * Kütüphanenin consumer uygulamanın environment yapısına doğrudan bağlanmasını engeller.
 */
import { InjectionToken } from '@angular/core';

import { ApiClientConfig } from './api-client-config.model';

/** Consumer tarafından sağlanması zorunlu API client yapılandırma tokenıdır. */
export const API_CLIENT_CONFIG = new InjectionToken<ApiClientConfig>('API_CLIENT_CONFIG');
