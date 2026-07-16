/** Bu dosya, Keycloak callback sonucunu gerçek profile endpointi ve rol yönlendirmesiyle tamamlar. */
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFacade } from '@core/auth/auth.facade';
import { AuthNavigationService } from '@core/auth/auth-navigation.service';
import { Button } from '@shared/components/button/button';
import { Card } from '@shared/components/card/card';
import { ErrorState } from '@shared/components/error-state/error-state';
import { Spinner } from '@shared/components/spinner/spinner';

import { ProfileFacade } from '../../../profile/facades/profile.facade';
import { resolvePostLoginRoute } from '../../auth-route.resolver';

/** Fake timer kullanmadan auth initialization ve `/api/profile/me` lifecycle'ını izleyen callback sayfasıdır. */
@Component({
  selector: 'wx-auth-callback-page',
  imports: [Button, Card, ErrorState, Spinner],
  templateUrl: './auth-callback-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthCallbackPage {
  /** Keycloak callback sonucunu ve initialization durumunu okur. */
  private readonly authFacade = inject(AuthFacade);

  /** Backend profilini gerçek endpoint üzerinden yükler. */
  private readonly profileFacade = inject(ProfileFacade);

  /** Tek kullanımlık güvenli returnUrl bilgisini callback sonunda tüketir. */
  private readonly authNavigationService = inject(AuthNavigationService);

  /** Çözülen role göre kullanıcının gerçek uygulama alanına geçmesini sağlar. */
  private readonly router = inject(Router);

  /** Aynı reactive effect çalışmasında profile isteğinin tekrar dispatch edilmesini engeller. */
  private profileLoadRequested = false;

  /** Başarılı role redirect işleminin yalnızca bir kez yapılmasını sağlar. */
  private navigationCompleted = false;

  /** Template'in Keycloak lifecycle durumunu göstermesini sağlar. */
  protected readonly authStatus = this.authFacade.status;

  /** Initialization veya redirect hatasını kullanıcıya güvenli metinle sunar. */
  protected readonly authError = this.authFacade.error;

  /** Gerçek profile request hatasını retry görünümüne bağlar. */
  protected readonly profileError = this.profileFacade.error;

  /** Auth tamamlandığında profili yükler ve backend rollerinden hedef route'u çözer. */
  private readonly callbackFlow = effect(() => {
    // Keycloak kontrolü tamamlanmadan login veya logout sonucu hakkında karar verilmez.
    if (!this.authFacade.isInitialized()) {
      return;
    }

    // Logout callbacki oturum üretmediyse kullanıcı bekletilmeden public girişe döndürülür.
    if (!this.authFacade.isAuthenticated()) {
      if (!this.navigationCompleted) {
        this.navigationCompleted = true;
        this.authNavigationService.consumeReturnUrl();
        void this.router.navigateByUrl('/');
      }

      return;
    }

    const profileStatus = this.profileFacade.status();
    const profile = this.profileFacade.profile();

    // Profile endpointi yalnızca auth doğrulandıktan sonra bir kez çağrılır.
    if (profileStatus === 'idle' && !this.profileLoadRequested) {
      this.profileLoadRequested = true;
      this.profileFacade.load();
      return;
    }

    // Backend rolü hazır olduğunda admin öncelikli canonical yönlendirme uygulanır.
    if (profileStatus === 'loaded' && profile && !this.navigationCompleted) {
      this.navigationCompleted = true;
      const returnUrl = this.authNavigationService.consumeReturnUrl();
      void this.router.navigateByUrl(resolvePostLoginRoute(profile.roles, returnUrl));
    }
  });

  /** Geçici Keycloak bağlantı hatasında gerçek initialization işlemini yeniden başlatır. */
  protected retryAuthentication(): void {
    this.authFacade.initialize();
  }

  /** Başarısız profile isteğini gerçek `/api/profile/me` endpointine yeniden gönderir. */
  protected retryProfile(): void {
    this.profileLoadRequested = true;
    this.profileFacade.load();
  }

  /** Callback oturum üretmediyse kullanıcıyı tekrar public giriş yüzeyine taşır. */
  protected goToLogin(): void {
    void this.router.navigateByUrl('/');
  }
}
