# F4C Faz Raporu — Auth ve Role Guard'ları

Bu rapor, protected kullanıcı ve admin route erişiminin gerçek Keycloak auth state ve realm rolleriyle sınırlandığını kaydeder.

Tarih: 2026-07-13

## Yapılan iş

- Functional auth guard eklendi.
- Guard kararı verilmeden önce Keycloak initialization tamamlanması bekleniyor.
- Unauthenticated kullanıcı login girişine güvenli `returnUrl` ile yönlendiriliyor.
- Parametreli role guard ve canonical admin guard eklendi.
- Authenticated fakat yetkisiz kullanıcı `/forbidden` route'una yönlendiriliyor.
- Guard'ların ihtiyaç duyduğu observable state alanları auth facade üzerinden sunuldu.

## Bu faz proje için neden önemli?

User ve admin shell ayrımının yalnızca navigation görünümüne değil gerçek route authorization kontrolüne dayanmasını sağlar.

## Dosyalar

- `src/app/core/guards/auth.guard.ts`
- `src/app/core/guards/auth.guard.spec.ts`
- `src/app/core/guards/role.guard.ts`
- `src/app/core/guards/role.guard.spec.ts`
- `src/app/core/auth/auth.facade.ts`

## Doğrulama

- Production build başarılı.
- 16 test dosyasında 40 test geçti.
- Production dependency audit sonucu: 0 vulnerability.
- Sıradaki faz: F5A.
