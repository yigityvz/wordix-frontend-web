/** Bu dosya, profile feature'ın gerçek `/api/profile/me` HTTP entegrasyonunu yönetir. */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppConfigService } from '@core/config/app-config.service';
import { unwrapApiResponse } from '@core/http/api-response.mapper';
import { ApiResponse } from '@core/http/models/api-response.model';
import { map, Observable } from 'rxjs';

import { CurrentUserInfoResponseDto } from '../models/profile-api.models';

/** Profile endpointini feature dışına HTTP ayrıntısı sızdırmadan çağırır. */
@Injectable()
export class ProfileApiService {
  /** Angular HTTP client üzerinden interceptor zincirini kullanan requestleri gönderir. */
  private readonly httpClient = inject(HttpClient);

  /** Environment bazlı Wordix API adresini merkezi config servisinden okur. */
  private readonly apiBaseUrl = inject(AppConfigService).apiBaseUrl.replace(/\/+$/, '');

  /** Bearer interceptor ile korunan current-user endpointinden profile DTO'sunu getirir. */
  getMe(): Observable<CurrentUserInfoResponseDto> {
    return this.httpClient
      .get<ApiResponse<CurrentUserInfoResponseDto>>(`${this.apiBaseUrl}/profile/me`)
      .pipe(map(unwrapApiResponse));
  }
}
