/** Bu dosya, HTTP status ve backend hata gövdesinin ApiError modeline eşlenmesini doğrular. */
import { HttpErrorResponse } from '@angular/common/http';
import { describe, expect, it } from 'vitest';

import { mapApiError } from './api-error.mapper';

// Mapper'ın backend detaylarını ve tüm status sınıflarını koruduğunu sınar.
describe('mapApiError', () => {
  // Validation alanları ile trace kimliğinin kaybolmadığını doğrular.
  it('maps backend validation details without losing the trace id', () => {
    const error = new HttpErrorResponse({
      status: 400,
      error: {
        success: false,
        statusCode: 400,
        errorCode: 'VALIDATION_ERROR',
        message: 'Validation failed.',
        detail: null,
        traceId: 'trace-42',
        validationErrors: [
          {
            propertyName: 'text',
            errorMessage: 'Text is required.',
            errorCode: 'NotEmptyValidator',
          },
        ],
        timestamp: '2026-07-13T07:00:00Z',
      },
    });

    expect(mapApiError(error)).toMatchObject({
      name: 'ApiError',
      kind: 'validation',
      statusCode: 400,
      errorCode: 'VALIDATION_ERROR',
      traceId: 'trace-42',
      validationErrors: [
        {
          propertyName: 'text',
          errorMessage: 'Text is required.',
          errorCode: 'NotEmptyValidator',
        },
      ],
    });
  });

  // Her desteklenen HTTP statusunun doğru frontend hata türüne eşlendiğini doğrular.
  it.each([
    [0, 'network'],
    [400, 'business'],
    [401, 'authentication'],
    [403, 'authorization'],
    [404, 'not-found'],
    [500, 'server'],
    [418, 'unknown'],
  ] as const)('maps HTTP status %i to %s', (status, kind) => {
    const error = new HttpErrorResponse({ status, error: null });

    expect(mapApiError(error)).toMatchObject({ kind, statusCode: status });
  });

  // HTTP dışındaki runtime hatalarının güvenli unknown türüne dönüştüğünü doğrular.
  it('normalizes non-HTTP failures as unknown errors', () => {
    expect(mapApiError(new Error('Unexpected failure'))).toMatchObject({
      kind: 'unknown',
      statusCode: 0,
    });
  });
});
