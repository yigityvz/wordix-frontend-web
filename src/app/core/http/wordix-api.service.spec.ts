/**
 * Wordix API adaptörünün genel library requestlerini `ApiResponse<T>` payloadına dönüştürmesini sınar.
 * Feature servislerinin response zarfını tekrar açmasına gerek kalmadığını güvenceye alır.
 */
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideApiClient } from 'angular-api-client-core';
import { firstValueFrom, Observable } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { WordixApiService } from './wordix-api.service';

/** Adaptörün protected metotlarını yalnızca izole test senaryolarına açar. */
@Injectable()
class TestWordixApiService extends WordixApiService {
  /** Adaptör GET metodunu typed test observableı olarak dışarı açar. */
  load<TResponse>(path: string): Observable<TResponse> {
    return this.getData<TResponse>(path);
  }

  /** Adaptör POST metodunu typed request ve response ile dışarı açar. */
  create<TRequest, TResponse>(path: string, body: TRequest): Observable<TResponse> {
    return this.postData<TRequest, TResponse>(path, body);
  }
}

/** Genel library ile Wordix response mapper birleşimini Angular HTTP test backend'iyle doğrular. */
describe('WordixApiService', () => {
  /** Her testte üretilen HTTP requestlerini yakalayan controllerı tutar. */
  let http: HttpTestingController;

  /** Gerçek Wordix base URL biçimiyle adaptör test containerını kurar. */
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideApiClient({ baseUrl: 'http://localhost:5000/api/' }),
        TestWordixApiService,
      ],
    });

    // Test requestleri ortak controller üzerinden tamamlanacaktır.
    http = TestBed.inject(HttpTestingController);
  });

  /** Test sonunda bekleyen veya beklenmeyen HTTP requesti kalmadığını doğrular. */
  afterEach(() => {
    http.verify();
  });

  /** Başarılı GET response zarfından yalnızca data payloadını döndürür. */
  it('unwraps successful GET responses', async () => {
    const result = firstValueFrom(
      TestBed.inject(TestWordixApiService).load<{ readonly value: string }>('sample'),
    );
    const request = http.expectOne('http://localhost:5000/api/sample');

    expect(request.request.method).toBe('GET');
    request.flush(apiResponse({ value: 'ok' }));

    await expect(result).resolves.toEqual({ value: 'ok' });
  });

  /** POST bodyyi koruyup başarılı response zarfını aynı adaptörde açar. */
  it('sends POST bodies and unwraps their responses', async () => {
    const result = firstValueFrom(
      TestBed.inject(TestWordixApiService).create<
        { readonly name: string },
        { readonly id: string }
      >('sample', { name: 'Example' }),
    );
    const request = http.expectOne('http://localhost:5000/api/sample');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ name: 'Example' });
    request.flush(apiResponse({ id: 'created-id' }));

    await expect(result).resolves.toEqual({ id: 'created-id' });
  });

  /** HTTP 2xx içinde başarısız işaretlenen Wordix zarfını sessizce başarılı kabul etmez. */
  it('rejects unsuccessful Wordix response envelopes', async () => {
    const result = firstValueFrom(TestBed.inject(TestWordixApiService).load('sample'));
    const request = http.expectOne('http://localhost:5000/api/sample');

    // Backend sözleşme ihlalinin feature stateine başarılı payload olarak ulaşmasını engeller.
    request.flush({
      success: false,
      message: 'Operation failed.',
      data: null,
      timestamp: '2026-07-14T00:00:00Z',
    });

    await expect(result).rejects.toThrowError('Operation failed.');
  });
});

/** Test payloadını canlı Swagger ile uyumlu başarılı Wordix response zarfında üretir. */
function apiResponse<T>(data: T) {
  return {
    success: true,
    message: null,
    data,
    timestamp: '2026-07-14T00:00:00Z',
  };
}
