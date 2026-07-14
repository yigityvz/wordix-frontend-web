/** Bu dosya, lookup feature'ın gerçek `POST /api/lookups` HTTP entegrasyonunu yönetir. */
import { Injectable } from '@angular/core';
import { WordixApiService } from '@core/http/wordix-api.service';
import { Observable } from 'rxjs';

import { LookupResponseDto } from '../models/lookup-api.models';
import { LookupRequest } from '../models/lookup-request.model';

/** Lookup endpointini componentlerden ve state ayrıntılarından izole eden feature API servisidir. */
@Injectable()
export class LookupApiService extends WordixApiService {
  /** Kullanıcı metnini gerçek backend lookup endpointine gönderip response payloadını unwrap eder. */
  lookup(request: LookupRequest): Observable<LookupResponseDto> {
    // HTTP ve Wordix response zarfı ayrıntılarını inheritance alınan merkezi adaptöre bırakır.
    return this.postData<LookupRequest, LookupResponseDto>('lookups', request);
  }
}
