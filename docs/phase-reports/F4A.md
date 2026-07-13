# F4A Faz Raporu — Keycloak Authentication Client ve Auth Store

Bu rapor, Wordix frontend'in gerçek Keycloak oturum altyapısının kurulduğunu kaydeder.

Tarih: 2026-07-13

## Yapılan iş

- Resmi `keycloak-js` 26.2.4 adapter eklendi.
- Production audit bulguları nedeniyle Angular runtime `21.2.18`, build/CLI `21.2.19` güvenli sürümlerine hizalandı.
- Standard Authorization Code akışı, S256 PKCE ve `check-sso` initialization yapılandırıldı.
- Login, registration, logout, token refresh ve session event yönetimi eklendi.
- Token/Keycloak ID taşımayan güvenli `AuthUser` modeli oluşturuldu.
- Root auth actions, state, reducer, selectors, effects ve facade eklendi.
- Auth initialization Angular bootstrap ve root NgRx store'a bağlandı.
- Yerel Keycloak discovery endpointinde authorization code ve S256 desteği doğrulandı.

## Bu faz proje için neden önemli?

Login ekranı, bearer interceptor ve role guard fazlarının demo davranışı olmadan gerçek Keycloak oturumuna dayanmasını sağlar.

## Dosyalar

- `package.json`
- `package-lock.json`
- `src/app/core/auth/*`
- `src/app/core/store/auth/*`
- `src/app/core/store/root-store.providers.ts`
- `src/app/app.config.ts`

## Doğrulama

- Production build başarılı.
- 13 test dosyasında 31 test geçti.
- Production dependency audit sonucu: 0 vulnerability.
- Keycloak issuer: `http://localhost:8080/realms/wordix`.
- Sıradaki faz: F4B.
