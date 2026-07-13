/** Bu dosya, Keycloak dönüşünde kullanılacak yalnızca uygulama içi güvenli adresi sessionStorage içinde yönetir. */
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

/** Auth yönlendirme bilgisinin yalnızca mevcut browser oturumu boyunca saklandığı anahtardır. */
const AUTH_RETURN_URL_STORAGE_KEY = 'wordix-auth-return-url';

/** Açık yönlendirme saldırılarını engelleyen auth dönüş adresi servisidir. */
@Injectable({ providedIn: 'root' })
export class AuthNavigationService {
  /** URL doğrulaması ve sessionStorage erişimi için browser documentini kullanır. */
  private readonly document = inject(DOCUMENT);

  /** Server-side çalışma durumunda browser API kullanımını engeller. */
  private readonly platformId = inject(PLATFORM_ID);

  /** Güvenli bir uygulama içi adresi sonraki Keycloak dönüşü için saklar. */
  rememberReturnUrl(returnUrl: string | null): void {
    const safeReturnUrl = this.validateReturnUrl(returnUrl);
    const storage = this.getSessionStorage();

    // Geçersiz veya boş adreslerin önceki oturum yönlendirmesini yanlışlıkla kullanmasını engeller.
    if (!safeReturnUrl) {
      storage?.removeItem(AUTH_RETURN_URL_STORAGE_KEY);
      return;
    }

    storage?.setItem(AUTH_RETURN_URL_STORAGE_KEY, safeReturnUrl);
  }

  /** Saklanan güvenli adresi tek kullanım için okuyup storage alanından kaldırır. */
  consumeReturnUrl(): string | null {
    const storage = this.getSessionStorage();
    const storedReturnUrl = storage?.getItem(AUTH_RETURN_URL_STORAGE_KEY) ?? null;

    storage?.removeItem(AUTH_RETURN_URL_STORAGE_KEY);
    return this.validateReturnUrl(storedReturnUrl);
  }

  /** Verilen adresin aynı origin içinde ve auth sistem sayfaları dışında kaldığını doğrular. */
  validateReturnUrl(returnUrl: string | null): string | null {
    if (!returnUrl || !returnUrl.startsWith('/') || returnUrl.startsWith('//')) {
      return null;
    }

    try {
      const applicationRoot = new URL('.', this.document.baseURI);
      const resolvedUrl = new URL(returnUrl, applicationRoot);

      // Sadece aynı origin ve uygulama base path altındaki route'lara dönüşe izin verir.
      if (
        resolvedUrl.origin !== applicationRoot.origin ||
        !resolvedUrl.pathname.startsWith(applicationRoot.pathname)
      ) {
        return null;
      }

      const relativeUrl = `${resolvedUrl.pathname}${resolvedUrl.search}${resolvedUrl.hash}`;
      const callbackPath = new URL('auth/callback', applicationRoot).pathname;

      // Login ve callback sayfalarına tekrar dönüş sonsuz yönlendirme oluşturabileceği için reddedilir.
      if (
        resolvedUrl.pathname === applicationRoot.pathname ||
        resolvedUrl.pathname === callbackPath
      ) {
        return null;
      }

      return relativeUrl;
    } catch {
      return null;
    }
  }

  /** Browser storage kapalıysa auth akışını bozmadan null döndüren güvenli erişim sağlar. */
  private getSessionStorage(): Storage | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    try {
      return this.document.defaultView?.sessionStorage ?? null;
    } catch {
      return null;
    }
  }
}
