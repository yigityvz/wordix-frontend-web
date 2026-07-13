/** Bu dosya, ham HTTP ve runtime hatalarını uygulamanın ortak ApiError modeline dönüştürür. */
import { HttpErrorResponse } from '@angular/common/http';

import { ErrorResponse, ValidationError } from '../http/models/error-response.model';
import { ApiError, ApiErrorKind } from './api-error.model';

/** Backend güvenli bir mesaj sağlamadığında hata türüne göre gösterilecek varsayılan metinlerdir. */
const FALLBACK_MESSAGES: Readonly<Record<ApiErrorKind, string>> = {
  network: 'Sunucuya ulaşılamadı. Lütfen bağlantınızı kontrol edin.',
  validation: 'Gönderilen bilgiler geçerli değil.',
  business: 'İşlem tamamlanamadı.',
  authentication: 'Oturumunuz geçerli değil.',
  authorization: 'Bu işlem için yetkiniz bulunmuyor.',
  'not-found': 'İstenen kaynak bulunamadı.',
  server: 'Sunucuda beklenmeyen bir hata oluştu.',
  unknown: 'Beklenmeyen bir hata oluştu.',
};

/** Bilinmeyen, HTTP veya önceden normalize edilmiş hatayı tek ApiError biçimine getirir. */
export function mapApiError(error: unknown): ApiError {
  // Aynı hata interceptor zincirinden tekrar geçerse mevcut normalize bilgileri korur.
  if (error instanceof ApiError) {
    return error;
  }

  // HTTP dışındaki runtime hatalarını güvenli ve genel bir hata olarak sınırlar.
  if (!(error instanceof HttpErrorResponse)) {
    return createApiError('unknown', 0, null, error);
  }

  // Response body yalnızca gerçek ErrorResponse sözleşmesine uyuyorsa güvenilir kabul edilir.
  const response = isErrorResponse(error.error) ? error.error : null;
  const kind = resolveErrorKind(error.status, response?.validationErrors ?? null);

  // Backend correlation ve validation ayrıntılarını feature katmanına kaybetmeden aktarır.
  return new ApiError({
    kind,
    statusCode: error.status,
    message: response?.message ?? FALLBACK_MESSAGES[kind],
    errorCode: response?.errorCode ?? null,
    detail: response?.detail ?? null,
    traceId: response?.traceId ?? null,
    validationErrors: response?.validationErrors ?? [],
    timestamp: response?.timestamp ?? null,
    cause: error,
  });
}

/** Ortak fallback alanlarıyla yeni bir normalize ApiError üretir. */
function createApiError(
  kind: ApiErrorKind,
  statusCode: number,
  response: ErrorResponse | null,
  cause: unknown,
): ApiError {
  return new ApiError({
    kind,
    statusCode,
    message: response?.message ?? FALLBACK_MESSAGES[kind],
    errorCode: response?.errorCode ?? null,
    detail: response?.detail ?? null,
    traceId: response?.traceId ?? null,
    validationErrors: response?.validationErrors ?? [],
    timestamp: response?.timestamp ?? null,
    cause,
  });
}

/** HTTP status ve validation içeriğine göre frontend hata davranışını sınıflandırır. */
function resolveErrorKind(
  statusCode: number,
  validationErrors: readonly ValidationError[] | null,
): ApiErrorKind {
  // Status eşlemesi auth, form ve sayfa akışlarının hatayı tutarlı ele almasını sağlar.
  if (statusCode === 0) return 'network';
  if (statusCode === 400) return validationErrors?.length ? 'validation' : 'business';
  if (statusCode === 401) return 'authentication';
  if (statusCode === 403) return 'authorization';
  if (statusCode === 404) return 'not-found';
  if (statusCode >= 500) return 'server';
  return 'unknown';
}

/** Bilinmeyen response body değerinin backend ErrorResponse sözleşmesine uyduğunu doğrular. */
function isErrorResponse(value: unknown): value is ErrorResponse {
  // Primitive ve null değerlerde property erişimini engeller.
  if (!isRecord(value)) return false;

  return (
    typeof value['success'] === 'boolean' &&
    typeof value['statusCode'] === 'number' &&
    isNullableString(value['errorCode']) &&
    isNullableString(value['message']) &&
    isNullableString(value['detail']) &&
    isNullableString(value['traceId']) &&
    isValidationErrors(value['validationErrors']) &&
    typeof value['timestamp'] === 'string'
  );
}

/** Bilinmeyen değerin güvenli property erişimine uygun bir nesne olduğunu doğrular. */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/** Swagger'da nullable tanımlanan metin alanlarını doğrular. */
function isNullableString(value: unknown): value is string | null {
  return typeof value === 'string' || value === null;
}

/** Validation error listesinin null veya sözleşmeye uygun elemanlardan oluştuğunu doğrular. */
function isValidationErrors(value: unknown): value is readonly ValidationError[] | null {
  return value === null || (Array.isArray(value) && value.every(isValidationError));
}

/** Tek bir validation error nesnesinin Swagger alanlarına uyduğunu doğrular. */
function isValidationError(value: unknown): value is ValidationError {
  return (
    isRecord(value) &&
    isNullableString(value['propertyName']) &&
    isNullableString(value['errorMessage']) &&
    isNullableString(value['errorCode'])
  );
}
