/**
 * AppConfigService'in aktif build environment ayarlarını eksiksiz ve secret olmadan sunduğunu test eder.
 * HTTP ve Keycloak fazlarının güveneceği merkezi configuration contractını korur.
 */
import { TestBed } from '@angular/core/testing';

import { AppConfigService } from './app-config.service';

describe('AppConfigService', () => {
  /** Production environment içindeki canonical public servis adreslerini döndürdüğünü doğrular. */
  it('aktif public environment ayarlarını typesafe olarak sunar', () => {
    // Root-provided service Angular dependency injection ortamından alınır.
    const service = TestBed.inject(AppConfigService);

    // API feature servislerinin kullanacağı canonical local API base URL doğrulanır.
    expect(service.apiBaseUrl).toBe('http://localhost:5000/api');

    // Keycloak entegrasyonunun kullanacağı realm ve public client kimliği doğrulanır.
    expect(service.keycloak.realm).toBe('wordix');
    expect(service.keycloak.clientId).toBe('wordix-web');
  });

  /** Public browser config contractında client secret bulunmadığını doğrular. */
  it('browser configuration içinde client secret taşımaz', () => {
    // Test edilen aktif config snapshotı merkezi service üzerinden okunur.
    const service = TestBed.inject(AppConfigService);

    // Public client olduğu için Keycloak config nesnesi secret alanı içermemelidir.
    expect('clientSecret' in service.keycloak).toBe(false);
  });
});
