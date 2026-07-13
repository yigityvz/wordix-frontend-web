# F5C — Keycloak Login/Register ve Auth Callback UI

## Tamamlananlar

- `/` route'una responsive Coastal Blues login/register ekranı eklendi.
- Credential formu eklenmedi; sign-in ve create-account aksiyonları doğrudan gerçek Keycloak akışına bağlandı.
- Keycloak login/register dönüş adresi `/auth/callback` olarak ayrıldı; logout dönüşü `/` olarak korundu.
- Güvenli internal `returnUrl` doğrulaması ve tek kullanımlık sessionStorage akışı eklendi. Harici, protocol-relative ve callback adresleri reddediliyor.
- Callback ekranı gerçek auth initialization sonrasında `GET /api/profile/me` state akışını çalıştırıyor.
- Backend profil rollerine göre `admin` öncelikli yönlendirme eklendi: admin `/admin/dashboard`, basic user `/dashboard`, tanınmayan rol `/forbidden`.
- Admin shell yalnızca var olan `/admin/dashboard` bağlantısını gösterecek şekilde temizlendi.
- F12 öncesi admin landing sayfası yalnızca gerçek profil ve logout bilgisiyle eklendi; fake analytics kullanılmadı.
- Login, callback, güvenli returnUrl, rol çözümleme ve Keycloak redirect davranışları testlerle kapsandı.

## Değişen dosya grupları

- `src/app/app.routes.ts`
- `src/app/core/auth/*`
- `src/app/core/store/auth/*`
- `src/app/core/layout/admin-shell/admin-shell.ts`
- `src/app/features/auth/*`
- `src/app/features/admin-analytics/*`
- `docs/phase-reports/F5C.md`

## Doğrulama

- `npm test -- --watch=false`: başarılı — 24 test dosyası, 60 test.
- `npm run build`: başarılı — production bundle 383.04 kB initial raw size.
- `npm audit --omit=dev`: başarılı — 0 vulnerability.
- Kaynak taraması: credential input, demo/coming-soon işareti ve ölü admin navigation bağlantısı bulunmadı.
- Tarayıcı görsel doğrulaması Windows ortamındaki `AppData` erişim izni nedeniyle başlatılamadı; bu kontrol başarılı olarak işaretlenmedi.

## Çalıştırma ön koşulu

Keycloak `wordix-web` client ayarlarında `http://localhost:4200/auth/callback` adresi valid redirect URI olarak izinli olmalıdır. Registration aksiyonu için realm user registration özelliği açık olmalıdır.

## Sonraki faz

Onay sonrasında mevcut ana plana göre F6A — Lookup API + Models.
