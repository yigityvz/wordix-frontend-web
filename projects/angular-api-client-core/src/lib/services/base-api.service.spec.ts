/**
 * Base API servisinin HTTP verb, URL, body ve option davranışlarını Angular test backend'iyle doğrular.
 * Kütüphane başka uygulamalara taşındığında temel request sözleşmesinin değişmesini engeller.
 */
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, Observable } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { provideApiClient } from '../config/provide-api-client';
import { ApiDeleteRequestOptions, ApiRequestOptions } from '../models/api-request-options.model';
import { BaseApiService } from './base-api.service';

/** Protected base metotlarını yalnızca unit test senaryolarına açan test servisidir. */
@Injectable()
class TestApiService extends BaseApiService {
  /** Base GET metodunu test observableı olarak dışarı açar. */
  requestGet<TResponse>(path: string, options?: ApiRequestOptions): Observable<TResponse> {
    return this.get<TResponse>(path, options);
  }

  /** Base POST metodunu typed request ve response ile dışarı açar. */
  requestPost<TRequest, TResponse>(
    path: string,
    body: TRequest,
    options?: ApiRequestOptions,
  ): Observable<TResponse> {
    return this.post<TRequest, TResponse>(path, body, options);
  }

  /** Base PUT metodunu typed request ve response ile dışarı açar. */
  requestPut<TRequest, TResponse>(path: string, body: TRequest): Observable<TResponse> {
    return this.put<TRequest, TResponse>(path, body);
  }

  /** Base PATCH metodunu typed request ve response ile dışarı açar. */
  requestPatch<TRequest, TResponse>(path: string, body: TRequest): Observable<TResponse> {
    return this.patch<TRequest, TResponse>(path, body);
  }

  /** Base DELETE metodunu opsiyonel body seçenekleriyle dışarı açar. */
  requestDelete<TResponse>(path: string, options?: ApiDeleteRequestOptions): Observable<TResponse> {
    return this.delete<TResponse>(path, options);
  }
}

/** Kütüphanenin backend-bağımsız request üretimini izole test containerında sınar. */
describe('BaseApiService', () => {
  /** Her testte üretilen HTTP requestlerini yakalayan Angular test controllerıdır. */
  let http: HttpTestingController;

  /** Slash içeren örnek base URL ile library providerlarını test containerına kaydeder. */
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideApiClient({ baseUrl: 'https://api.example.test/v1/' }),
        TestApiService,
      ],
    });

    // Her test aynı controller instanceı üzerinden beklenen requestleri yönetecektir.
    http = TestBed.inject(HttpTestingController);
  });

  /** Test sonunda karşılanmamış veya beklenmeyen HTTP requesti kalmadığını doğrular. */
  afterEach(() => {
    http.verify();
  });

  /** Base URL ve endpoint slashlerini normalize edip query/header seçeneklerini korur. */
  it('sends a typed GET request with normalized URL and options', async () => {
    const result = firstValueFrom(
      TestBed.inject(TestApiService).requestGet<{ readonly id: number }>('/items', {
        params: { page: 2, active: true },
        headers: { 'X-Request-Source': 'unit-test' },
      }),
    );
    const request = http.expectOne(
      (candidate) => candidate.url === 'https://api.example.test/v1/items',
    );

    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('page')).toBe('2');
    expect(request.request.params.get('active')).toBe('true');
    expect(request.request.headers.get('X-Request-Source')).toBe('unit-test');
    request.flush({ id: 42 });

    await expect(result).resolves.toEqual({ id: 42 });
  });

  /** POST requestinin typed body ve response değerlerini değiştirmeden taşıdığını doğrular. */
  it('sends a typed POST request', async () => {
    const result = firstValueFrom(
      TestBed.inject(TestApiService).requestPost<
        { readonly name: string },
        { readonly created: boolean }
      >('items', { name: 'Example' }),
    );
    const request = http.expectOne('https://api.example.test/v1/items');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ name: 'Example' });
    request.flush({ created: true });

    await expect(result).resolves.toEqual({ created: true });
  });

  /** PUT ve PATCH requestlerinin doğru HTTP verbleriyle body taşıdığını doğrular. */
  it('sends PUT and PATCH requests', () => {
    const service = TestBed.inject(TestApiService);

    // Tam güncelleme requesti PUT olarak gönderilir.
    service.requestPut('items/1', { name: 'Updated' }).subscribe();
    const putRequest = http.expectOne('https://api.example.test/v1/items/1');
    expect(putRequest.request.method).toBe('PUT');
    expect(putRequest.request.body).toEqual({ name: 'Updated' });
    putRequest.flush({});

    // Kısmi güncelleme requesti PATCH olarak gönderilir.
    service.requestPatch('items/1', { active: false }).subscribe();
    const patchRequest = http.expectOne('https://api.example.test/v1/items/1');
    expect(patchRequest.request.method).toBe('PATCH');
    expect(patchRequest.request.body).toEqual({ active: false });
    patchRequest.flush({});
  });

  /** DELETE requestinin opsiyonel body değerini Angular HttpClient'e ilettiğini doğrular. */
  it('sends a DELETE request with an optional body', () => {
    TestBed.inject(TestApiService)
      .requestDelete('items/1', { body: { reason: 'duplicate' } })
      .subscribe();
    const request = http.expectOne('https://api.example.test/v1/items/1');

    expect(request.request.method).toBe('DELETE');
    expect(request.request.body).toEqual({ reason: 'duplicate' });
    request.flush({ deleted: true });
  });

  /** Absolute endpoint verilirse yapılandırılmış API sınırının aşılamadığını doğrular. */
  it('rejects absolute endpoint URLs', () => {
    expect(() =>
      TestBed.inject(TestApiService).requestGet('https://other.example.test/items'),
    ).toThrowError('BaseApiService yalnızca relative endpoint path kabul eder.');
  });

  /** Parent traversal segmentiyle base API pathinin dışına çıkılmasını engeller. */
  it('rejects parent path traversal', () => {
    expect(() => TestBed.inject(TestApiService).requestGet('../admin')).toThrowError(
      'Endpoint path base URL sınırının dışına çıkamaz.',
    );
  });
});
