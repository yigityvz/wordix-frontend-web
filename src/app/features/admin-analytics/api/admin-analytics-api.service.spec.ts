/** Bu dosya, admin analytics API service'in canlı Swagger route, query ve unwrap davranışını doğrular. */
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AppConfigService } from '@core/config/app-config.service';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AdminAnalyticsApiService } from './admin-analytics-api.service';

/** Beş admin-only GET operasyonunu Angular HTTP test backend'iyle sınar. */
describe('AdminAnalyticsApiService', () => {
  let http: HttpTestingController;

  /** Kontrollü API base URL ile service containerını kurar. */
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AdminAnalyticsApiService,
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:5000/api/' } },
      ],
    });
    http = TestBed.inject(HttpTestingController);
  });

  /** Beklenmeyen HTTP isteği kalmadığını doğrular. */
  afterEach(() => http.verify());

  /** Dashboard route'unu ownership parametresi olmadan çağırır ve zarfı açar. */
  it('loads dashboard analytics', async () => {
    const result = firstValueFrom(TestBed.inject(AdminAnalyticsApiService).getDashboard());
    const req = http.expectOne('http://localhost:5000/api/admin/analytics/dashboard');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.keys()).toEqual([]);
    req.flush(api({ generatedAt: '2026-01-01T00:00:00Z' }));
    await expect(result).resolves.toEqual({ generatedAt: '2026-01-01T00:00:00Z' });
  });

  /** Tarih ve limit filtrelerini Swagger PascalCase alan adlarıyla gönderir. */
  it('sends canonical top searches filters', () => {
    TestBed.inject(AdminAnalyticsApiService).getTopSearches({
      fromUtc: '2026-01-01T00:00:00Z',
      toUtc: '2026-02-01T00:00:00Z',
      limit: 50,
    }).subscribe();
    const req = http.expectOne((request) => request.url.endsWith('/admin/analytics/top-searches'));
    expect(req.request.params.get('FromUtc')).toBe('2026-01-01T00:00:00Z');
    expect(req.request.params.get('ToUtc')).toBe('2026-02-01T00:00:00Z');
    expect(req.request.params.get('Limit')).toBe('50');
    req.flush(api({ items: null }));
  });

  /** Kalan Swagger route adlarının değişmeden çağrıldığını doğrular. */
  it('uses top-saved, most-wrong and provider-stats routes', () => {
    const service = TestBed.inject(AdminAnalyticsApiService);
    service.getTopSaved().subscribe();
    http.expectOne('http://localhost:5000/api/admin/analytics/top-saved').flush(api({}));
    service.getMostWrong().subscribe();
    http.expectOne('http://localhost:5000/api/admin/analytics/most-wrong').flush(api({}));
    service.getProviderStats().subscribe();
    http.expectOne('http://localhost:5000/api/admin/analytics/provider-stats').flush(api({}));
  });

  /** Test response zarfını merkezi ApiResponse biçiminde üretir. */
  function api<T>(data: T) {
    return { success: true, message: null, data, timestamp: '2026-01-01T00:00:00Z' };
  }
});
