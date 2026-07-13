/** Bu dosya, profile feature store'un yükleme ve veri state sözleşmesini tanımlar. */
import { Profile } from '../models/profile.models';

/** Profile request yaşam döngüsünde desteklenen durumları sınırlar. */
export type ProfileStatus = 'idle' | 'loading' | 'loaded' | 'error';

/** Profile sayfası ve navbar tarafından tüketilecek feature state alanlarıdır. */
export interface ProfileState {
  readonly status: ProfileStatus;
  readonly profile: Profile | null;
  readonly error: string | null;
}

/** Profile endpointi çağrılmadan önce kullanılan güvenli başlangıç state'idir. */
export const initialProfileState: ProfileState = {
  status: 'idle',
  profile: null,
  error: null,
};
