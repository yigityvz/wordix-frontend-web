/** Bu dosya, backend hata ve alan doğrulama cevaplarının ortak sözleşmelerini tanımlar. */

/** Bir request alanına ait backend validation hatasını temsil eder. */
export interface ValidationError {
  readonly propertyName: string | null;
  readonly errorMessage: string | null;
  readonly errorCode: string | null;
}

/** Backend'in başarısız HTTP cevaplarında kullandığı ortak hata sözleşmesidir. */
export interface ErrorResponse {
  readonly success: boolean;
  readonly statusCode: number;
  readonly errorCode: string | null;
  readonly message: string | null;
  readonly detail: string | null;
  readonly traceId: string | null;
  readonly validationErrors: readonly ValidationError[] | null;
  readonly timestamp: string;
}
