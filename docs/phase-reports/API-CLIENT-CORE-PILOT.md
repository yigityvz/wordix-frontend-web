# API Client Core — Wordix Profile Pilot Geçişi

Bu rapor, genel Angular API Client Core library'nin Wordix response adaptörü üzerinden ilk gerçek feature servisine bağlandığı pilot geçişi kaydeder.

## Faz

Wordix `ApiResponse<T>` adaptörü ve `ProfileApiService` pilot inheritance entegrasyonu.

## Yapılan iş

- Genel library ile Wordix response sözleşmesi arasına `WordixApiService` adaptörü eklendi.
- Adaptör `GET`, `POST`, `PUT`, `PATCH` ve `DELETE` çağrılarında `ApiResponse<T>` zarfını merkezi mapper ile açacak şekilde hazırlandı.
- Başarılı GET/POST zarfı ve HTTP 2xx içinde başarısız işaretlenen response davranışı için adaptör testleri eklendi.
- `provideApiClient`, aktif environment içindeki gerçek Wordix API base URL değeriyle uygulama bootstrapına bağlandı.
- `ProfileApiService`, `WordixApiService` üzerinden inheritance alacak şekilde geçirildi.
- Profile servisten doğrudan `HttpClient`, `AppConfigService`, URL birleştirme, `ApiResponse` ve RxJS response mapper tekrarları kaldırıldı.
- Profile endpoint URL'si ve public `getMe()` response contractı değiştirilmedi.
- Temiz workspace kullanımında library çıktısının uygulamadan önce oluşması için `prestart`, `prebuild`, `prewatch` ve `pretest` scriptleri eklendi.
- Diğer altı feature API servisine dokunulmadı.

## Inheritance sonucu

```text
ProfileApiService
  -> WordixApiService
    -> BaseApiService
      -> Angular HttpClient
```

`ProfileApiService` artık yalnızca `profile/me` endpointini ve dönen DTO tipini bilir. Base URL, HTTP request gönderimi ve Wordix response zarfı üst katmanlarda merkezi yönetilir.

## Değişen dosyalar

- `src/app/app.config.ts`
- `src/app/features/profile/api/profile-api.service.ts`
- `src/app/features/profile/api/profile-api.service.spec.ts`
- `package.json`

## Eklenen dosyalar

- `src/app/core/http/wordix-api.service.ts`
- `src/app/core/http/wordix-api.service.spec.ts`
- `docs/phase-reports/API-CLIENT-CORE-PILOT.md`

## Silinen dosyalar

- Yok.

## Çalıştırılan komutlar

- Canlı Swagger profile endpoint doğrulaması.
- Pilot dosyalar için Prettier.
- Library uygulama bağımlılığı sınır taraması.
- `npm run test:api-core -- --watch=false`
- `npm test -- --watch=false`
- `npm run build`

## Build sonucu

- Angular API Client Core production package buildi başarılıdır.
- Wordix uygulama production buildi başarılıdır.
- `prebuild` ile library -> application build sırası doğrulandı.

## Test sonucu

- Library: 2 test dosyası ve 8 test başarılıdır.
- Wordix uygulaması: 69 test dosyası ve 220 test başarılıdır.
- Yeni Wordix adaptörünün 3 testi başarılıdır.
- Mevcut profile endpoint testi inheritance yapısı üzerinde başarılıdır.

## Backend endpoint doğrulaması

- Swagger `GET /api/profile/me` endpointini doğruladı.
- Başarılı response `CurrentUserInfoResponseApiResponse` zarfıdır.
- 401 ve 500 cevapları `ErrorResponse` sözleşmesini kullanır.
- Route, request veya response DTO değişikliği yapılmadı.

## Ürün kararları / deferred backlog değişikliği

- Değişiklik yok.

## Bu faz proje için neden önemli?

Pilot geçiş, library tasarımının yalnızca teorik olmadığını ve mevcut Wordix authentication/interceptor/response akışıyla gerçek bir feature üzerinde çalıştığını kanıtladı. Küçük bir servisle yapılan bu doğrulama, kalan servisler taşınmadan önce inheritance zincirindeki DI, build sırası ve response unwrap risklerini kapattı.

## Sıradaki faz

- Küçük servisler olan `LookupApiService` ve `QuizApiService` için kontrollü inheritance geçişi.

## Risk / dikkat edilmesi gerekenler

- Lookup ve quiz servisleri POST body ve null body senaryoları içerdiği için bir sonraki geçiş adapterın POST contractını gerçek endpointlerle doğrulayacaktır.
- Dictionary servisi daha geniş mutation yüzeyine sahip olduğundan küçük servisler doğrulanmadan taşınmamalıdır.
- Genel library Wordix response, Keycloak ve feature DTO bağımlılıklarından bağımsız kalmaya devam etmelidir.
