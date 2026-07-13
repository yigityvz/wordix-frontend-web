# F5B Faz Raporu — Authenticated Dashboard Shell

Bu rapor, basic_user dashboard route'unun gerçek auth/profile state ile user shell içinde açıldığını kaydeder.

Tarih: 2026-07-13

## Yapılan iş

- `/dashboard` route'u auth ve `basic_user` role guard ile korundu.
- Dashboard page user shell child outletine lazy bağlandı.
- Profile feature providerları dashboard route kapsamına eklendi.
- Loading, profile success, recoverable error/retry ve gerçek Keycloak logout durumları uygulandı.
- Kullanıcı adı, e-posta ve canonical roller güvenli profile modelinden gösteriliyor.
- User navigation yalnızca gerçekten çalışan Dashboard route'unu gösteriyor.
- Figma'daki fake streak, accuracy, review, dictionary ve recommendation verileri eklenmedi.

## Bu faz proje için neden önemli?

Authentication sonrası basic user için ilk gerçek protected uygulama yüzeyini kurar ve sonraki feature route'larının ekleneceği user shell sınırını etkinleştirir.

## Dosyalar

- `src/app/features/dashboard/*`
- `src/app/app.routes.ts`
- `src/app/core/layout/user-shell/user-shell.ts`

## Doğrulama

- Production build başarılı.
- 20 test dosyasında 47 test geçti.
- Production dependency audit sonucu: 0 vulnerability.
- Sıradaki faz: F6A.
