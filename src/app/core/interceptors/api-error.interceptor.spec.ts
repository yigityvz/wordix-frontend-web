/** Bu dosya, interceptor'ın ham HTTP hatalarını normalize ederek yeniden yayınladığını doğrular. */
import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { firstValueFrom, throwError } from 'rxjs';
import { describe, expect, it } from 'vitest';

import { ApiError } from '../errors/api-error.model';
import { apiErrorInterceptor } from './api-error.interceptor';

// Interceptor'ın RxJS hata kanalındaki dönüşüm sorumluluğunu sınar.
describe('apiErrorInterceptor', () => {
  // 403 cevabının authorization türünde ApiError olarak iletildiğini doğrular.
  it('rethrows HTTP failures as normalized ApiError instances', async () => {
    const request = new HttpRequest('GET', '/api/test');
    const responseError = new HttpErrorResponse({ status: 403 });
    const result = apiErrorInterceptor(request, () => throwError(() => responseError));

    await expect(firstValueFrom(result)).rejects.toMatchObject({
      name: 'ApiError',
      kind: 'authorization',
      statusCode: 403,
    } satisfies Partial<ApiError>);
  });
});
