/** Bu dosya, lookup feature'ın gerçek `POST /api/lookups` HTTP entegrasyonunu yönetir. */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppConfigService } from '@core/config/app-config.service';
import { unwrapApiResponse } from '@core/http/api-response.mapper';
import { ApiResponse } from '@core/http/models/api-response.model';
import { map, Observable } from 'rxjs';

import { LookupResponseDto } from '../models/lookup-api.models';
import { LookupRequest } from '../models/lookup-request.model';

/** Lookup endpointini componentlerden ve state ayrıntılarından izole eden feature API servisidir. */
@Injectable()
export class LookupApiService {
  /** Interceptor zincirini kullanan Angular HTTP client üzerinden protected request gönderir. */
  private readonly httpClient = inject(HttpClient);

  /** Environment bazlı Wordix API adresini merkezi config servisinden okur. */
  private readonly apiBaseUrl = inject(AppConfigService).apiBaseUrl.replace(/\/+$/, '');

  /** Kullanıcı metnini gerçek backend lookup endpointine gönderip response payloadını unwrap eder. */
  lookup(request: LookupRequest): Observable<LookupResponseDto> {
    return this.httpClient
      .post<ApiResponse<LookupResponseDto>>(`${this.apiBaseUrl}/lookups`, request)
      .pipe(map(unwrapApiResponse));
  }
}
