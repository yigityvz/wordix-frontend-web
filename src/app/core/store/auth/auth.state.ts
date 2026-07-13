/** Bu dosya, root auth store diliminin kalıcı state sözleşmesini tanımlar. */
import { AuthStatus, AuthUser } from '../../auth/auth.models';

/** Authentication lifecycle boyunca UI'ın okuyacağı state alanlarıdır. */
export interface AuthState {
  readonly status: AuthStatus;
  readonly user: AuthUser | null;
  readonly error: string | null;
}

/** Uygulama başlamadan önce kullanılan güvenli auth state değeridir. */
export const initialAuthState: AuthState = {
  status: 'idle',
  user: null,
  error: null,
};
