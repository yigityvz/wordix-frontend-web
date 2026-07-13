/** Bu dosya, profile ekranı ve state tarafından tüketilecek güvenli kullanıcı modelini tanımlar. */
import { WordixRole } from '@core/auth/auth.models';

/** Keycloak ID veya token taşımayan profile görünüm modelidir. */
export interface Profile {
  readonly isAuthenticated: boolean;
  readonly email: string | null;
  readonly username: string | null;
  readonly roles: readonly WordixRole[];
}
