# F4D — Logout Giriş Sayfası Yönlendirmesi

Bu rapor, Keycloak logout sonrasında oluşan geçersiz redirect hatasının giderilmesini
ve kullanıcının Wordix giriş sayfasına otomatik döndürülmesini kaydeder.

## Değişiklikler

- Logout isteğinin `post_logout_redirect_uri` değeri izinli Angular
  `/auth/callback` adresine taşındı.
- Önceki oturumdan kalan güvenli return URL bilgisi logout başlatılırken temizlendi.
- Callback routeu initialization sonunda oturum bulunmadığını algıladığında otomatik
  olarak `/` public giriş route'una yönlenecek şekilde güncellendi.
- Çalışan local Keycloak `wordix-web` clientına
  `post.logout.redirect.uris = http://localhost:4200/*` izni eklendi.
- Login ve authenticated callback davranışları korunurken logout senaryosu için test eklendi.

## Değişen dosyalar

- `src/app/core/auth/keycloak.service.ts`
- `src/app/core/auth/keycloak.service.spec.ts`
- `src/app/features/auth/pages/auth-callback-page/auth-callback-page.ts`
- `src/app/features/auth/pages/auth-callback-page/auth-callback-page.spec.ts`
- `docs/phase-reports/F4D-LOGOUT-REDIRECT.md`

## Doğrulama

- Swagger erişimi: başarılı (`HTTP 200`). Logout backend endpointi değil, Keycloak
  Authorization Code + PKCE oturum yaşam döngüsünün parçasıdır.
- `npm run format:check`: başarılı.
- Wordix testleri: 69 dosya, 223 test başarılı.
- Angular API Client Core build: başarılı.
- Wordix production build: başarılı.
- Browser doğrulaması: oturumsuz `/auth/callback` sonucu otomatik olarak
  `http://localhost:4200/` giriş sayfasına yönlendi.
- Keycloak logout endpoint doğrulaması: izinli callback için `HTTP 302` yönlendirmesi
  üretildi; `Invalid redirect uri` cevabı oluşmadı.
