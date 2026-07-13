/** Bu dosya, `/api/profile/me` endpointinin canlı Swagger response DTO sözleşmesini tanımlar. */

/** Backend transport modelidir; keycloakUserId yalnızca response uyumluluğu için burada tutulur. */
export interface CurrentUserInfoResponseDto {
  readonly isAuthenticated: boolean;
  readonly keycloakUserId: string | null;
  readonly email: string | null;
  readonly username: string | null;
  readonly roles: readonly string[] | null;
}
