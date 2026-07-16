/** Bu dosya, resmi Keycloak JS adapter ile Authorization Code + PKCE oturum yaşam döngüsünü yönetir. */
import { DOCUMENT } from '@angular/common';
import { inject, Injectable, InjectionToken } from '@angular/core';
import Keycloak from 'keycloak-js';
import { Observable, Subject } from 'rxjs';

import { AppConfigService } from '../config/app-config.service';
import { AuthNavigationService } from './auth-navigation.service';
import { AuthUser, WordixRole, WORDIX_ROLES } from './auth.models';

/** Testlerde adapter'ı değiştirebilmek ve client üretimini tek noktada tutmak için kullanılan DI tokenıdır. */
export const KEYCLOAK_CLIENT = new InjectionToken<Keycloak>('KEYCLOAK_CLIENT', {
  providedIn: 'root',
  factory: () => {
    // Public Keycloak bağlantı bilgilerini aktif environment configinden okur.
    const config = inject(AppConfigService).keycloak;

    // Browser içinde secret taşımayan public Keycloak adapter örneğini oluşturur.
    return new Keycloak({
      url: config.url,
      realm: config.realm,
      clientId: config.clientId,
    });
  },
});

/** Keycloak adapter ayrıntılarını store, interceptor ve UI katmanından izole eder. */
@Injectable({ providedIn: 'root' })
export class KeycloakService {
  /** Resmi Keycloak adapter örneğini DI üzerinden alır. */
  private readonly client = inject(KEYCLOAK_CLIENT);

  /** Deploy base href değerine uygun redirect adresini üretmek için browser documentini kullanır. */
  private readonly document = inject(DOCUMENT);

  /** Login öncesindeki güvenli uygulama içi dönüş adresini oturum boyunca korur. */
  private readonly authNavigationService = inject(AuthNavigationService);

  /** Adapter callbacklerinden gelen oturum değişimlerini NgRx effect katmanına taşır. */
  private readonly sessionChangesSubject = new Subject<AuthUser | null>();

  /** Birden fazla initializer çağrısının aynı Keycloak isteğini paylaşmasını sağlar. */
  private initialization: Promise<AuthUser | null> | null = null;

  /** Auth store'un adapter kaynaklı login, refresh ve logout değişimlerini dinlediği akıştır. */
  readonly sessionChanges$: Observable<AuthUser | null> = this.sessionChangesSubject.asObservable();

  /** Keycloak adapter'ı standard flow ve S256 PKCE ile bir kez başlatır. */
  initialize(): Promise<AuthUser | null> {
    // Angular initializer veya test tekrar çağırırsa devam eden sonucu yeniden kullanır.
    if (this.initialization) {
      return this.initialization;
    }

    // Başarısız başlangıçtan sonra kontrollü yeniden denemeye izin verir.
    this.initialization = this.initializeClient().catch((error: unknown) => {
      this.initialization = null;
      throw error;
    });

    return this.initialization;
  }

  /** Kullanıcıyı tek Keycloak sign-in ekranına yönlendirir. */
  login(returnUrl: string | null = null): Promise<void> {
    this.authNavigationService.rememberReturnUrl(returnUrl);
    return this.client.login({ redirectUri: this.getAuthCallbackRedirectUri() });
  }

  /** Kullanıcıyı aynı public client üzerinden Keycloak registration akışına yönlendirir. */
  register(returnUrl: string | null = null): Promise<void> {
    this.authNavigationService.rememberReturnUrl(returnUrl);
    return this.client.register({ redirectUri: this.getAuthCallbackRedirectUri() });
  }

  /** Keycloak oturumunu sonlandırır ve kullanıcıyı uygulama giriş adresine döndürür. */
  logout(): Promise<void> {
    // Önceki login dönüş adresinin yeni oturumda yanlışlıkla kullanılmasını engeller.
    this.authNavigationService.rememberReturnUrl(null);

    // Keycloak clientta izinli olan auth callback adresi logout sonucunu güvenle karşılar.
    return this.client.logout({ redirectUri: this.getAuthCallbackRedirectUri() });
  }

  /** F4B bearer interceptor için geçerli veya yenilenmiş access token sağlar. */
  async getAccessToken(minValidityInSeconds = 30): Promise<string | null> {
    // Oturum yoksa protected requeste token eklenmemesini sağlar.
    if (!this.client.authenticated) {
      return null;
    }

    try {
      // Süresi yaklaşan tokenı backend çağrısından önce Keycloak üzerinden yeniler.
      await this.client.updateToken(minValidityInSeconds);
      return this.client.token ?? null;
    } catch (error: unknown) {
      // Refresh başarısızsa eski tokenın tekrar kullanılmasını önler.
      this.client.clearToken();
      this.sessionChangesSubject.next(null);
      throw error;
    }
  }

  /** Adapter callbacklerini bağlayıp mevcut SSO oturumunu sessizce kontrol eder. */
  private async initializeClient(): Promise<AuthUser | null> {
    // Callbackler init çağrısından önce tanımlanarak erken lifecycle eventlerinin kaybolmasını engeller.
    this.bindClientEvents();

    // Implicit token akışı kullanılmadan Authorization Code ve S256 PKCE etkinleştirilir.
    const authenticated = await this.client.init({
      onLoad: 'check-sso',
      flow: 'standard',
      pkceMethod: 'S256',
    });

    return authenticated ? this.createAuthUser() : null;
  }

  /** Keycloak oturum eventlerini store'un tüketebileceği güvenli kullanıcı modeline dönüştürür. */
  private bindClientEvents(): void {
    // Başarılı login ve token refresh sonrasında güncel rol/claim görünümünü yayınlar.
    this.client.onAuthSuccess = () => this.sessionChangesSubject.next(this.createAuthUser());
    this.client.onAuthRefreshSuccess = () => this.sessionChangesSubject.next(this.createAuthUser());

    // Keycloak logout bildirimi geldiğinde auth state'in temizlenmesini sağlar.
    this.client.onAuthLogout = () => this.sessionChangesSubject.next(null);

    // Refresh hatasında geçersiz tokenları temizleyip oturumu kapalı duruma getirir.
    this.client.onAuthRefreshError = () => {
      this.client.clearToken();
      this.sessionChangesSubject.next(null);
    };

    // Token süresi dolduğunda kullanıcı etkileşimi beklemeden kontrollü refresh dener.
    this.client.onTokenExpired = () => {
      void this.refreshExpiredToken();
    };
  }

  /** Süresi dolmuş tokenı yeniler; başarısızsa adapter ve store oturumunu temizler. */
  private async refreshExpiredToken(): Promise<void> {
    try {
      // -1 değeri adapter'a tokenı koşulsuz yenilemesini söyler.
      await this.client.updateToken(-1);
      this.sessionChangesSubject.next(this.createAuthUser());
    } catch {
      // Yenilenemeyen tokenın API çağrılarında kullanılmasını engeller.
      this.client.clearToken();
      this.sessionChangesSubject.next(null);
    }
  }

  /** Token claimlerinden yalnızca UI için güvenli kullanıcı adı, e-posta ve Wordix rollerini çıkarır. */
  private createAuthUser(): AuthUser {
    const token = this.client.tokenParsed;
    const realmRoles = this.client.realmAccess?.roles ?? token?.realm_access?.roles ?? [];

    return {
      username: readNullableString(token?.['preferred_username']),
      email: readNullableString(token?.['email']),
      roles: realmRoles.filter(isWordixRole),
    };
  }

  /** Uygulamanın base href değerini koruyan güvenli login/logout dönüş adresini üretir. */
  private getApplicationRootRedirectUri(): string {
    return new URL('.', this.document.baseURI).toString();
  }

  /** Authorization Code + PKCE sonucunun işlendiği gerçek Angular callback adresini üretir. */
  private getAuthCallbackRedirectUri(): string {
    return new URL('auth/callback', this.getApplicationRootRedirectUri()).toString();
  }
}

/** Bilinmeyen token claim değerini güvenli nullable metne daraltır. */
function readNullableString(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

/** Realm rol metninin uygulamanın tanıdığı admin veya basic_user rolü olduğunu doğrular. */
function isWordixRole(role: string): role is WordixRole {
  return (WORDIX_ROLES as readonly string[]).includes(role);
}
