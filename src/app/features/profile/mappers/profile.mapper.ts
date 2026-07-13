/** Bu dosya, backend profile DTO'sunu hassas kimlik alanı içermeyen UI modeline dönüştürür. */
import { WordixRole, WORDIX_ROLES } from '@core/auth/auth.models';

import { CurrentUserInfoResponseDto } from '../models/profile-api.models';
import { Profile } from '../models/profile.models';

/** Backend responseundan yalnızca UI için güvenli profile alanlarını seçer. */
export function mapProfile(dto: CurrentUserInfoResponseDto): Profile {
  return {
    isAuthenticated: dto.isAuthenticated,
    email: dto.email,
    username: dto.username,
    // Keycloak altyapı rollerinin UI ve role badge alanlarına taşınmasını engeller.
    roles: (dto.roles ?? []).filter(isWordixRole),
  };
}

/** Backend rol metninin uygulamanın tanıdığı admin veya basic_user rolü olduğunu doğrular. */
function isWordixRole(role: string): role is WordixRole {
  return (WORDIX_ROLES as readonly string[]).includes(role);
}
