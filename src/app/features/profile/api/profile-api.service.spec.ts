/** Bu dosya, profile API service'in doğru endpointi ve ortak response zarfını kullandığını doğrular. */
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AppConfigService } from '@core/config/app-config.service';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ProfileApiService } from './profile-api.service';

// Gerçek route ve ApiResponse unwrap davranışını Angular HTTP test backend'iyle sınar.
describe('ProfileApiService', () => {
  /** Her testte bekleyen HTTP requestlerini yönetecek controllerı tutar. */
  let httpTestingController: HttpTestingController;

  /** Profile service ve local API base URL providerlarını bağımsız test containerına kaydeder. */
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ProfileApiService,
        {
          provide: AppConfigService,
          useValue: { apiBaseUrl: 'http://localhost:5000/api/' },
        },
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
  });

  /** Test sonunda karşılanmamış veya beklenmeyen HTTP requesti bulunmadığını doğrular. */
  afterEach(() => {
    httpTestingController.verify();
  });

  // `/api/profile/me` GET responseundaki data payloadının service consumerına döndüğünü doğrular.
  it('loads and unwraps the current profile response', async () => {
    const result = firstValueFrom(TestBed.inject(ProfileApiService).getMe());
    const request = httpTestingController.expectOne('http://localhost:5000/api/profile/me');

    expect(request.request.method).toBe('GET');
    request.flush({
      success: true,
      message: null,
      data: {
        isAuthenticated: true,
        keycloakUserId: 'transport-only-id',
        email: 'user@wordix.test',
        username: 'wordix-user',
        roles: ['basic_user'],
      },
      timestamp: '2026-07-13T08:00:00Z',
    });

    await expect(result).resolves.toMatchObject({
      keycloakUserId: 'transport-only-id',
      username: 'wordix-user',
    });
  });
});
