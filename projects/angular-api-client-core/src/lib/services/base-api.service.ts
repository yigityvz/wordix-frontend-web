/**
 * Feature API servislerine typed HTTP verbleri ve güvenli URL birleştirme altyapısı sunar.
 * Tekrar eden HttpClient kullanımını backend veya business response biçimine bağlanmadan merkezileştirir.
 */
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_CLIENT_CONFIG } from '../config/api-client-config.token';
import { ApiDeleteRequestOptions, ApiRequestOptions } from '../models/api-request-options.model';

/** Consumer feature servislerinin inheritance yoluyla kullanacağı backend-bağımsız HTTP temel sınıfıdır. */
export abstract class BaseApiService {
  /** Angular interceptor zincirini kullanan ortak HTTP client instanceını tutar. */
  private readonly httpClient = inject(HttpClient);

  /** Consumer uygulamanın DI üzerinden sağladığı normalize API ayarını tutar. */
  private readonly config = inject(API_CLIENT_CONFIG);

  /** Relative endpoint için typed GET requesti gönderir. */
  protected get<TResponse>(path: string, options: ApiRequestOptions = {}): Observable<TResponse> {
    // Bütün HTTP verblerinin aynı URL ve request dispatch davranışını kullanmasını sağlar.
    return this.request<TResponse>('GET', path, options);
  }

  /** Relative endpoint için typed POST requesti gönderir. */
  protected post<TRequest, TResponse>(
    path: string,
    body: TRequest,
    options: ApiRequestOptions = {},
  ): Observable<TResponse> {
    // Request bodyyi yalnızca bu çağrıya ait options nesnesine ekleyerek consumer nesnesini değiştirmez.
    return this.request<TResponse>('POST', path, { ...options, body });
  }

  /** Relative endpoint için typed PUT requesti gönderir. */
  protected put<TRequest, TResponse>(
    path: string,
    body: TRequest,
    options: ApiRequestOptions = {},
  ): Observable<TResponse> {
    // Tam kaynak güncelleme body ve seçeneklerini ortak dispatcher üzerinden gönderir.
    return this.request<TResponse>('PUT', path, { ...options, body });
  }

  /** Relative endpoint için typed PATCH requesti gönderir. */
  protected patch<TRequest, TResponse>(
    path: string,
    body: TRequest,
    options: ApiRequestOptions = {},
  ): Observable<TResponse> {
    // Kısmi güncelleme body ve seçeneklerini ortak dispatcher üzerinden gönderir.
    return this.request<TResponse>('PATCH', path, { ...options, body });
  }

  /** Relative endpoint için typed DELETE requesti gönderir. */
  protected delete<TResponse>(
    path: string,
    options: ApiDeleteRequestOptions = {},
  ): Observable<TResponse> {
    // DELETE body desteğini koruyarak requesti diğer verblerle aynı pipeline üzerinden gönderir.
    return this.request<TResponse>('DELETE', path, options);
  }

  /** Ortak JSON response ve request option sözleşmesiyle Angular HTTP çağrısını gerçekleştirir. */
  private request<TResponse>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    path: string,
    options: ApiRequestOptions & { readonly body?: unknown },
  ): Observable<TResponse> {
    // Absolute endpointlerin base URL ve consumer güvenlik sınırını yanlışlıkla aşmasını engeller.
    const url = this.buildUrl(path);

    // Angular'ın typed JSON body overloadını kullanarak response gövdesini Observable olarak döndürür.
    return this.httpClient.request<TResponse>(method, url, {
      ...options,
      observe: 'body',
      responseType: 'json',
      transferCache:
        typeof options.transferCache === 'object'
          ? { includeHeaders: [...(options.transferCache.includeHeaders ?? [])] }
          : options.transferCache,
    });
  }

  /** Normalize base URL ile relative endpoint pathini tek slash kullanarak birleştirir. */
  private buildUrl(path: string): string {
    // Scheme veya protocol-relative path kabul etmeyerek requestin yapılandırılmış API dışına çıkmasını önler.
    const normalizedPath = path.trim();
    if (/^[a-z][a-z\d+.-]*:/i.test(normalizedPath) || normalizedPath.startsWith('//')) {
      throw new Error('BaseApiService yalnızca relative endpoint path kabul eder.');
    }

    // Traversal segmentleri ve backslash kullanımıyla base path dışına çıkılmasını engeller.
    const pathOnly = normalizedPath.split(/[?#]/, 1)[0];
    if (normalizedPath.includes('\\') || pathOnly.split('/').some((part) => part === '..')) {
      throw new Error('Endpoint path base URL sınırının dışına çıkamaz.');
    }

    // Boş path API kökünü, dolu path ise baştaki fazla slashler temizlenmiş endpointi hedefler.
    const relativePath = normalizedPath.replace(/^\/+/, '');
    return relativePath ? `${this.config.baseUrl}/${relativePath}` : this.config.baseUrl;
  }
}
