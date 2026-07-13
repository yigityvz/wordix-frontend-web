/** Bu dosya, uygulama genelinde kullanılacak normalize API hata modelini tanımlar. */
import { ValidationError } from '../http/models/error-response.model';

/** Hatanın UI ve auth akışlarında hangi davranışla ele alınacağını belirtir. */
export type ApiErrorKind =
  | 'network'
  | 'validation'
  | 'business'
  | 'authentication'
  | 'authorization'
  | 'not-found'
  | 'server'
  | 'unknown';

/** ApiError oluşturulurken taşınacak normalize backend ve network alanlarını tanımlar. */
export interface ApiErrorOptions {
  readonly kind: ApiErrorKind;
  readonly statusCode: number;
  readonly message: string;
  readonly errorCode: string | null;
  readonly detail: string | null;
  readonly traceId: string | null;
  readonly validationErrors: readonly ValidationError[];
  readonly timestamp: string | null;
  readonly cause?: unknown;
}

/** Uygulama katmanlarının backend ve network hatalarını tek biçimde tüketmesini sağlar. */
export class ApiError extends Error {
  override readonly name = 'ApiError';
  readonly kind: ApiErrorKind;
  readonly statusCode: number;
  readonly errorCode: string | null;
  readonly detail: string | null;
  readonly traceId: string | null;
  readonly validationErrors: readonly ValidationError[];
  readonly timestamp: string | null;

  /** Normalize alanları Error taban sınıfına ve salt-okunur propertylere aktarır. */
  constructor(options: ApiErrorOptions) {
    super(options.message, { cause: options.cause });
    this.kind = options.kind;
    this.statusCode = options.statusCode;
    this.errorCode = options.errorCode;
    this.detail = options.detail;
    this.traceId = options.traceId;
    this.validationErrors = options.validationErrors;
    this.timestamp = options.timestamp;
  }
}
