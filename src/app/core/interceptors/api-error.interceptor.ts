/** Bu dosya, HTTP zincirindeki hataları feature katmanından önce merkezi biçimde normalize eder. */
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

import { mapApiError } from '../errors/api-error.mapper';

/** Tüm HTTP hatalarını feature katmanlarına ulaşmadan önce ApiError biçimine dönüştürür. */
export const apiErrorInterceptor: HttpInterceptorFn = (request, next) => {
  // Başarılı response akışını değiştirmeden yalnızca hata kanalını merkezi mapper'a yönlendirir.
  return next(request).pipe(
    catchError((error: unknown) => {
      // RxJS abonelerine ham HttpErrorResponse yerine uygulamanın ortak ApiError modelini iletir.
      return throwError(() => mapApiError(error));
    }),
  );
};
