/** Bu dosya, başarılı API response zarflarını feature verisine dönüştürür. */
import { ApiResponse } from './models/api-response.model';

/** Başarılı backend response zarfından feature katmanının kullanacağı veriyi çıkarır. */
export function unwrapApiResponse<T>(response: ApiResponse<T>): T {
  // Backend 2xx içinde başarısız zarf döndürürse bu sözleşme ihlalini gizlemez.
  if (!response.success) {
    throw new Error(response.message ?? 'API response reported an unsuccessful result.');
  }

  // Feature katmanına yalnızca endpointin gerçek payloadını verir.
  return response.data;
}
