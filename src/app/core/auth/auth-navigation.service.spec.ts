/** Bu dosya, auth dönüş adresinin yalnızca güvenli uygulama içi route'lar için saklandığını doğrular. */
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { AuthNavigationService } from './auth-navigation.service';

/** Açık yönlendirme koruması ve tek kullanımlık storage davranışını sınar. */
describe('AuthNavigationService', () => {
  /** Her test için temiz sessionStorage ve yeni service örneği hazırlar. */
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({});
  });

  /** Uygulama içi route'un saklanıp yalnızca bir kez tüketildiğini doğrular. */
  it('stores and consumes a safe internal return URL once', () => {
    const service = TestBed.inject(AuthNavigationService);
    service.rememberReturnUrl('/dictionary?filter=favorite');

    expect(service.consumeReturnUrl()).toBe('/dictionary?filter=favorite');
    expect(service.consumeReturnUrl()).toBeNull();
  });

  /** Harici ve protocol-relative adreslerin storage alanına giremediğini doğrular. */
  it('rejects unsafe external return URLs', () => {
    const service = TestBed.inject(AuthNavigationService);

    expect(service.validateReturnUrl('https://example.test/steal')).toBeNull();
    expect(service.validateReturnUrl('//example.test/steal')).toBeNull();
  });

  /** Callback route'una tekrar dönüşün yönlendirme döngüsü oluşturmasını engeller. */
  it('rejects the authentication callback route', () => {
    const service = TestBed.inject(AuthNavigationService);

    expect(service.validateReturnUrl('/auth/callback')).toBeNull();
  });
});
