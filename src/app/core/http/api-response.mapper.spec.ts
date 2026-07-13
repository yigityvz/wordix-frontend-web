/** Bu dosya, başarılı response zarfının güvenli biçimde açıldığını doğrular. */
import { describe, expect, it } from 'vitest';

import { unwrapApiResponse } from './api-response.mapper';
import { ApiResponse } from './models/api-response.model';

// Mapper'ın başarı ve sözleşme ihlali davranışlarını birlikte sınar.
describe('unwrapApiResponse', () => {
  // Başarılı response içinde yalnızca data payloadının döndüğünü doğrular.
  it('returns the response data for a successful backend envelope', () => {
    const response: ApiResponse<{ readonly id: number }> = {
      success: true,
      message: null,
      data: { id: 42 },
      timestamp: '2026-07-13T07:00:00Z',
    };

    expect(unwrapApiResponse(response)).toEqual({ id: 42 });
  });

  // success=false zarfının feature katmanına veri sızdırmadığını doğrular.
  it('rejects an unsuccessful envelope instead of exposing its data', () => {
    const response: ApiResponse<null> = {
      success: false,
      message: 'Request failed.',
      data: null,
      timestamp: '2026-07-13T07:00:00Z',
    };

    expect(() => unwrapApiResponse(response)).toThrowError('Request failed.');
  });
});
