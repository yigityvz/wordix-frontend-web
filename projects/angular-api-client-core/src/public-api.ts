/**
 * Angular API Client Core kütüphanesinin consumer uygulamalara açtığı desteklenen public yüzeydir.
 * Internal dosya yollarına bağımlılığı engelleyerek paket sürümleri arasında kararlı importlar sağlar.
 */
export * from './lib/config/api-client-config.model';
export * from './lib/config/api-client-config.token';
export * from './lib/config/provide-api-client';
export * from './lib/models/api-request-options.model';
export * from './lib/services/base-api.service';
