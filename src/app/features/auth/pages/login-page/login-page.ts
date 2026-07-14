/**
 * Bu dosya, credential toplamadan gerçek Keycloak sign-in ve registration akışlarını
 * başlatan giriş sayfasıdır.
 */
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthFacade } from '@core/auth/auth.facade';
import { ThemeFacade } from '@core/theme/theme.facade';
import { WordixTheme } from '@core/theme/theme.models';
import { Button } from '@shared/components/button/button';
import { ThemeToggle } from '@shared/components/theme-toggle/theme-toggle';

/** Wordix API'ye kullanıcı adı veya parola göndermeyen tek public auth giriş yüzeyidir. */
@Component({
  selector: 'wx-login-page',
  imports: [Button, ThemeToggle],
  templateUrl: './login-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  /** Sign-in, registration ve mevcut session state'ini auth altyapısına bağlar. */
  private readonly authFacade = inject(AuthFacade);

  /** Login sonrası guard tarafından iletilen iç route bilgisini okur. */
  private readonly route = inject(ActivatedRoute);

  /** Açık bir Keycloak oturumu varsa callback çözüm ekranına taşır. */
  private readonly router = inject(Router);

  /** Light, dark ve system tercihini mevcut tema altyapısına bağlar. */
  private readonly themeFacade = inject(ThemeFacade);

  /** Giriş butonlarının auth initialization boyunca devre dışı kalmasını sağlayan status signalidir. */
  protected readonly authStatus = this.authFacade.status;

  /** Gerçek Keycloak yönlendirme veya initialization hatasını kullanıcıya sunar. */
  protected readonly authError = this.authFacade.error;

  /** Tema seçicinin güncel tercihini template'e sunar. */
  protected readonly theme = this.themeFacade.theme;

  /** System tercihinin çözüldüğü görünümü tema ikonuna sunar. */
  protected readonly resolvedTheme = this.themeFacade.resolvedTheme;

  /** Guard query parametresindeki dönüş adresini Keycloak akışına iletir. */
  private readonly returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

  /** Mevcut oturumla root route açıldığında rol/profile çözümünü callback sayfasında tamamlar. */
  private readonly authenticatedRedirect = effect(() => {
    if (this.authFacade.isAuthenticated()) {
      void this.router.navigateByUrl('/auth/callback');
    }
  });

  /** Kullanıcıyı Authorization Code + S256 PKCE kullanan gerçek Keycloak login ekranına gönderir. */
  protected signIn(): void {
    this.authFacade.login(this.returnUrl);
  }

  /** Kullanıcıyı aynı public client üzerindeki gerçek Keycloak registration ekranına gönderir. */
  protected createAccount(): void {
    this.authFacade.register(this.returnUrl);
  }

  /** Auth servisinin geçici initialization hatasından sonra gerçek SSO kontrolünü yeniden başlatır. */
  protected retryAuthentication(): void {
    this.authFacade.initialize();
  }

  /** Kullanıcının light, dark veya system tercihini kalıcı tema servisine iletir. */
  protected setTheme(theme: WordixTheme): void {
    this.themeFacade.setTheme(theme);
  }
}
