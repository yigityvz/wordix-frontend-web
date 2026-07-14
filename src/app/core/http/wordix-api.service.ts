/**
 * Genel API client library ile Wordix'in `ApiResponse<T>` sözleşmesi arasında adaptör görevi görür.
 * Feature servislerinin HTTP altyapısını tekrar etmeden yalnızca gerçek endpointlerine odaklanmasını sağlar.
 */
import { Observable, map } from 'rxjs';
import {
  ApiDeleteRequestOptions,
  ApiRequestOptions,
  BaseApiService,
} from 'angular-api-client-core';

import { unwrapApiResponse } from './api-response.mapper';
import { ApiResponse } from './models/api-response.model';

/** Wordix feature servislerinin inheritance alacağı response-zarfı farkındalıklı temel servistir. */
export abstract class WordixApiService extends BaseApiService {
  /** Wordix `ApiResponse<T>` zarfını açan typed GET requesti gönderir. */
  protected getData<TResponse>(
    path: string,
    options: ApiRequestOptions = {},
  ): Observable<TResponse> {
    // Genel library ham responseu taşırken yalnızca bu adaptör Wordix data alanını çıkarır.
    return this.get<ApiResponse<TResponse>>(path, options).pipe(map(unwrapApiResponse));
  }

  /** Wordix `ApiResponse<T>` zarfını açan typed POST requesti gönderir. */
  protected postData<TRequest, TResponse>(
    path: string,
    body: TRequest,
    options: ApiRequestOptions = {},
  ): Observable<TResponse> {
    // Request DTO'sunu genel library üzerinden gönderip başarılı Wordix payloadını döndürür.
    return this.post<TRequest, ApiResponse<TResponse>>(path, body, options).pipe(
      map(unwrapApiResponse),
    );
  }

  /** Wordix `ApiResponse<T>` zarfını açan typed PUT requesti gönderir. */
  protected putData<TRequest, TResponse>(
    path: string,
    body: TRequest,
    options: ApiRequestOptions = {},
  ): Observable<TResponse> {
    // Tam güncelleme cevabını feature katmanına zarf ayrıntısı sızdırmadan iletir.
    return this.put<TRequest, ApiResponse<TResponse>>(path, body, options).pipe(
      map(unwrapApiResponse),
    );
  }

  /** Wordix `ApiResponse<T>` zarfını açan typed PATCH requesti gönderir. */
  protected patchData<TRequest, TResponse>(
    path: string,
    body: TRequest,
    options: ApiRequestOptions = {},
  ): Observable<TResponse> {
    // Kısmi güncelleme cevabını aynı merkezi Wordix mapper üzerinden açar.
    return this.patch<TRequest, ApiResponse<TResponse>>(path, body, options).pipe(
      map(unwrapApiResponse),
    );
  }

  /** Wordix `ApiResponse<T>` zarfını açan typed DELETE requesti gönderir. */
  protected deleteData<TResponse>(
    path: string,
    options: ApiDeleteRequestOptions = {},
  ): Observable<TResponse> {
    // Opsiyonel DELETE body ve request seçeneklerini koruyarak data payloadını döndürür.
    return this.delete<ApiResponse<TResponse>>(path, options).pipe(map(unwrapApiResponse));
  }
}
