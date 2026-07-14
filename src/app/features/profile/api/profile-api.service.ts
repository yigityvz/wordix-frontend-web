/** Bu dosya, profile feature'ın gerçek `/api/profile/me` HTTP entegrasyonunu yönetir. */
import { Injectable } from '@angular/core';
import { WordixApiService } from '@core/http/wordix-api.service';
import { Observable } from 'rxjs';

import { CurrentUserInfoResponseDto } from '../models/profile-api.models';

/** Profile endpointini feature dışına HTTP ayrıntısı sızdırmadan çağırır. */
@Injectable()
export class ProfileApiService extends WordixApiService {
  /** Bearer interceptor ile korunan current-user endpointinden profile DTO'sunu getirir. */
  getMe(): Observable<CurrentUserInfoResponseDto> {
    // HTTP, base URL ve response zarfı ayrıntılarını inheritance alınan Wordix adaptörüne bırakır.
    return this.getData<CurrentUserInfoResponseDto>('profile/me');
  }
}
