/** Bu dosya, lookup feature store'un request, sonuç ve lifecycle state sözleşmesini tanımlar. */
import { LookupRequest } from '../models/lookup-request.model';
import { LookupResult } from '../models/lookup-response.model';

/** Lookup request yaşam döngüsünde desteklenen durumları sınırlar. */
export type LookupStatus = 'idle' | 'loading' | 'loaded' | 'error';

/** Lookup sayfası ve componentlerinin facade üzerinden tüketeceği feature state alanlarıdır. */
export interface LookupState {
  readonly status: LookupStatus;
  readonly request: LookupRequest | null;
  readonly result: LookupResult | null;
  readonly error: string | null;
}

/** Lookup yapılmadan önce kullanılan sonuç ve request içermeyen başlangıç state'idir. */
export const initialLookupState: LookupState = {
  status: 'idle',
  request: null,
  result: null,
  error: null,
};
