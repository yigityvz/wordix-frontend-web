/** Bu dosya, credential toplamadan gerÃ§ek Keycloak sign-in ve registration akÄ±ÅŸlarÄ±nÄ± baÅŸlatan giriÅŸ sayfasÄ±dÄ±r. */
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthFacade } from '@core/auth/auth.facade';
import { ThemeFacade } from '@core/theme/theme.facade';
import { WordixTheme } from '@core/theme/theme.models';
import { Button } from '@shared/components/button/button';
import { ThemeToggle } from '@shared/components/theme-toggle/theme-toggle';

/** Wordix API'ye kullanÄ±cÄ± adÄ± veya parola gÃ¶ndermeyen tek public auth giriÅŸ yÃ¼zeyidir. */
@Component({
  selector: 'wx-login-page',
  imports: [Button, ThemeToggle],
  templateUrl: './login-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  /** Sign-in, registration ve mevcut session state'ini auth altyapÄ±sÄ±na baÄŸlar. */
  private readonly authFacade = inject(AuthFacade);

  /** Login sonrasÄ± guard tarafÄ±ndan iletilen iÃ§ route bilgisini okur. */
  private readonly route = inject(ActivatedRoute);

  /** AÃ§Ä±k bir Keycloak oturumu varsa callback Ã§Ã¶zÃ¼m ekranÄ±na taÅŸÄ±r. */
  private readonly router = inject(Router);

  /** Light, dark ve system tercihini mevcut tema altyapÄ±sÄ±na baÄŸlar. */
  private readonly themeFacade = inject(ThemeFacade);

  /** GiriÅŸ butonlarÄ±nÄ±n auth initialization boyunca devre dÄ±ÅŸÄ± kalmasÄ±nÄ± saÄŸlayan status signalidir. */
  protected readonly authStatus = this.authFacade.status;

  /** GerÃ§ek Keycloak yÃ¶nlendirme veya initialization hatasÄ±nÄ± kullanÄ±cÄ±ya sunar. */
  protected readonly authError = this.authFacade.error;

  /** Tema seÃ§icinin gÃ¼ncel tercihini template'e sunar. */
  protected readonly theme = this.themeFacade.theme;

  /** System tercihinin çözüldüğü görünümü tema ikonuna sunar. */
  protected readonly resolvedTheme = this.themeFacade.resolvedTheme;

  /** Guard query parametresindeki dÃ¶nÃ¼ÅŸ adresini Keycloak akÄ±ÅŸÄ±na iletir. */
  private readonly returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

  /** Mevcut oturumla root route aÃ§Ä±ldÄ±ÄŸÄ±nda rol/profile Ã§Ã¶zÃ¼mÃ¼nÃ¼ callback sayfasÄ±nda tamamlar. */
  private readonly authenticatedRedirect = effect(() => {
    if (this.authFacade.isAuthenticated()) {
      void this.router.navigateByUrl('/auth/callback');
    }
  });

  /** KullanÄ±cÄ±yÄ± Authorization Code + S256 PKCE kullanan gerÃ§ek Keycloak login ekranÄ±na gÃ¶nderir. */
  protected signIn(): void {
    this.authFacade.login(this.returnUrl);
  }

  /** KullanÄ±cÄ±yÄ± aynÄ± public client Ã¼zerindeki gerÃ§ek Keycloak registration ekranÄ±na gÃ¶nderir. */
  protected createAccount(): void {
    this.authFacade.register(this.returnUrl);
  }

  /** Auth servisinin geÃ§ici initialization hatasÄ±ndan sonra gerÃ§ek SSO kontrolÃ¼nÃ¼ yeniden baÅŸlatÄ±r. */
  protected retryAuthentication(): void {
    this.authFacade.initialize();
  }

  /** KullanÄ±cÄ±nÄ±n light, dark veya system tercihini kalÄ±cÄ± tema servisine iletir. */
  protected setTheme(theme: WordixTheme): void {
    this.themeFacade.setTheme(theme);
  }
}

