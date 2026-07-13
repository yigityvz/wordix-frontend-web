/** Bu dosya, authentication katmanının UI ve store ile paylaştığı güvenli modelleri tanımlar. */

/** Wordix route yetkilendirmesinde tanınan realm rolleridir. */
export const WORDIX_ROLES = ['admin', 'basic_user'] as const;

/** Backend ve route kurallarında desteklenen Wordix rol birleşimidir. */
export type WordixRole = (typeof WORDIX_ROLES)[number];

/** Token içinden çıkarılan ve hassas kimlik/token alanı taşımayan kullanıcı görünümüdür. */
export interface AuthUser {
  readonly username: string | null;
  readonly email: string | null;
  readonly roles: readonly WordixRole[];
}

/** Authentication başlangıç ve oturum durumlarını store için sınırlar. */
export type AuthStatus = 'idle' | 'initializing' | 'authenticated' | 'unauthenticated' | 'error';
