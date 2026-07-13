/** Bu dosya, Wordix rolü bulunmayan authenticated hesaplar için güvenli erişim reddi sayfasıdır. */
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthFacade } from '@core/auth/auth.facade';
import { Button } from '@shared/components/button/button';
import { Card } from '@shared/components/card/card';

/** Yetkisiz kullanıcıya ölü navigasyon sunmadan gerçek Keycloak logout aksiyonu sağlar. */
@Component({
  selector: 'wx-forbidden-page',
  imports: [Button, Card],
  templateUrl: './forbidden-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForbiddenPage {
  /** Mevcut yetkisiz Keycloak oturumunu güvenli biçimde sonlandırır. */
  private readonly authFacade = inject(AuthFacade);

  /** Kullanıcıyı gerçek Keycloak logout akışına gönderir. */
  protected signOut(): void {
    this.authFacade.logout();
  }
}
