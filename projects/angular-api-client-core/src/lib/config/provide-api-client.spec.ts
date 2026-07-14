/**
 * API client providerının base URL doğrulama ve normalizasyon davranışını sınar.
 * Hatalı consumer yapılandırmasının request çalıştırılmadan önce görünür olmasını güvenceye alır.
 */
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';

import { API_CLIENT_CONFIG } from './api-client-config.token';
import { provideApiClient } from './provide-api-client';

/** Standalone provider kurulum sözleşmesini bağımsız Angular test containerında doğrular. */
describe('provideApiClient', () => {
  /** Her senaryodan sonra provider stateinin sonraki teste taşınmasını engeller. */
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  /** Base URL çevresindeki whitespace ve son slashleri tek seferde temizler. */
  it('provides an immutable normalized config', () => {
    TestBed.configureTestingModule({
      providers: [provideApiClient({ baseUrl: '  https://api.example.test/v1///  ' })],
    });

    // Consumerın inject edeceği gerçek token değerinin normalize ve immutable olduğunu doğrular.
    const config = TestBed.inject(API_CLIENT_CONFIG);
    expect(config).toEqual({ baseUrl: 'https://api.example.test/v1' });
    expect(Object.isFrozen(config)).toBe(true);
  });

  /** Boş base URL değerinin geçersiz provider üretmesine izin vermez. */
  it('rejects an empty base URL', () => {
    expect(() => provideApiClient({ baseUrl: '   ' })).toThrowError(
      'API client baseUrl değeri boş olamaz.',
    );
  });
});
