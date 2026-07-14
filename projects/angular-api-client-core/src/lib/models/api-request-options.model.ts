/**
 * Typed JSON HTTP çağrılarında desteklenen ortak Angular request seçeneklerini tanımlar.
 * Base servisin Angular HttpClient ayrıntılarını feature servislerine tekrar ettirmemesini sağlar.
 */
import { HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';

/** Query parametrelerinde Angular HttpClient tarafından desteklenen primitive değerlerdir. */
export type ApiQueryValue = string | number | boolean;

/** HttpParams veya sade nesne olarak gönderilebilen typed query parametre sözleşmesidir. */
export type ApiQueryParams = HttpParams | Record<string, ApiQueryValue | ApiQueryValue[]>;

/** JSON response bekleyen tüm HTTP verbleri için ortak request seçenekleridir. */
export interface ApiRequestOptions {
  /** Requeste özel header koleksiyonudur; global headerlar interceptor ile eklenebilir. */
  readonly headers?: HttpHeaders | Record<string, string | string[]>;
  /** Interceptorlar arasında request metadata taşımak için Angular HTTP context değeridir. */
  readonly context?: HttpContext;
  /** URL query stringine dönüştürülecek parametre koleksiyonudur. */
  readonly params?: ApiQueryParams;
  /** Upload/download ilerleme eventlerinin Angular katmanında hazırlanıp hazırlanmayacağını belirtir. */
  readonly reportProgress?: boolean;
  /** Cross-origin requestlerde credential gönderim tercihini belirtir. */
  readonly withCredentials?: boolean;
  /** Fetch tabanlı backend kullanıldığında credential politikasını taşır. */
  readonly credentials?: RequestCredentials;
  /** Server-side rendering transfer cache davranışını yapılandırır. */
  readonly transferCache?: boolean | { readonly includeHeaders?: string[] };
  /** Angular HTTP request timeout değerini milisaniye olarak belirtir. */
  readonly timeout?: number;
}

/** DELETE requestinin opsiyonel body taşıyabilen ek seçeneklerini tanımlar. */
export interface ApiDeleteRequestOptions extends ApiRequestOptions {
  /** Backend sözleşmesi gerektiriyorsa DELETE requestine eklenecek body değeridir. */
  readonly body?: unknown;
}
