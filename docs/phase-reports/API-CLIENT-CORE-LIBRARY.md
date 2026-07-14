# Angular API Client Core — Library Temeli

Bu rapor, Wordix workspace içinde oluşturulan ve daha sonra bağımsız GitHub repository'sine çıkarılacak genel Angular API client library temelini kaydeder.

## Faz

Angular API Client Core library scaffold, config contractı, `BaseApiService` ve bağımsız unit testleri.

## Yapılan iş

- Angular CLI ile `angular-api-client-core` adlı bağımsız library projesi oluşturuldu.
- Consumer uygulamanın API base URL değerini injection token üzerinden sağlayan config contractı eklendi.
- Standalone Angular bootstrap akışı için `provideApiClient` provider helperı eklendi.
- Typed query parametresi, header, HTTP context, timeout, credential ve transfer cache seçenekleri tanımlandı.
- `BaseApiService` altında protected `GET`, `POST`, `PUT`, `PATCH` ve `DELETE` metotları oluşturuldu.
- Base URL slash normalizasyonu, absolute URL reddi ve parent path traversal koruması eklendi.
- Kütüphanenin public API exportları sınırlandırıldı.
- Genel kullanım örneği ve workspace komutları library README dosyasına yazıldı.
- Çoklu proje workspace'i nedeniyle mevcut uygulama `start`, `build`, `watch` ve `test` scriptleri açık proje adı kullanacak şekilde güvenli hale getirildi.
- Library kaynaklarında Wordix, Keycloak, uygulama aliası veya Wordix `ApiResponse` bağımlılığı bulunmadığı otomatik taramayla doğrulandı.

## Değişen dosyalar

- `angular.json`
- `package.json`
- `package-lock.json`
- `tsconfig.json`

## Eklenen dosyalar

- `projects/angular-api-client-core/ng-package.json`
- `projects/angular-api-client-core/package.json`
- `projects/angular-api-client-core/README.md`
- `projects/angular-api-client-core/tsconfig.lib.json`
- `projects/angular-api-client-core/tsconfig.lib.prod.json`
- `projects/angular-api-client-core/tsconfig.spec.json`
- `projects/angular-api-client-core/src/public-api.ts`
- `projects/angular-api-client-core/src/lib/config/api-client-config.model.ts`
- `projects/angular-api-client-core/src/lib/config/api-client-config.token.ts`
- `projects/angular-api-client-core/src/lib/config/provide-api-client.ts`
- `projects/angular-api-client-core/src/lib/config/provide-api-client.spec.ts`
- `projects/angular-api-client-core/src/lib/models/api-request-options.model.ts`
- `projects/angular-api-client-core/src/lib/services/base-api.service.ts`
- `projects/angular-api-client-core/src/lib/services/base-api.service.spec.ts`
- `docs/phase-reports/API-CLIENT-CORE-LIBRARY.md`

## Silinen dosyalar

- Angular CLI'nin library için oluşturduğu kullanılmayan örnek component ve örnek component testi kaldırıldı.

## Çalıştırılan komutlar

- Canlı Swagger erişim kontrolü.
- `ng generate library angular-api-client-core --standalone --test-runner=vitest`
- `npm install`
- Library kaynakları için Prettier.
- Library içinde uygulamaya özel bağımlılık taraması.
- `npm run test:api-core -- --watch=false`
- `npm run build:api-core`
- `npm test -- --watch=false`
- `npm run build`
- `npm audit --omit=dev`

## Build sonucu

- Angular API Client Core production package buildi başarılıdır.
- Library çıktısı `dist/angular-api-client-core` altında oluşturulmuştur.
- Wordix uygulama production buildi başarılıdır.
- Uygulama çıktısı `dist/wordix-frontend-web` altında oluşturulmuştur.

## Test sonucu

- Library: 2 test dosyası ve 8 test başarılıdır.
- Wordix uygulaması: 68 test dosyası ve 217 test başarılıdır.
- Production bağımlılık audit sonucu 0 vulnerability'dir.

## Backend endpoint doğrulaması

- Swagger `http://localhost:5000/swagger/v1/swagger.json` adresinden erişilebilir durumdadır.
- `Wordix API v1` altında 36 path doğrulandı.
- Bu faz endpoint veya DTO davranışı değiştirmedi.

## Ürün kararları / deferred backlog değişikliği

- Değişiklik yok.

## Bu faz proje için neden önemli?

HTTP verbleri, URL güvenliği ve ortak request seçenekleri artık feature servislerinin tekrar ettiği Wordix kodu olmaktan çıktı ve bağımsız derlenebilen bir Angular library contractına dönüştü. Kütüphanenin uygulamaya özel import içermemesi, pilot entegrasyon tamamlandıktan sonra kodu yeniden yazmadan ayrı GitHub repository'sine ve ileride package dağıtımına taşımayı mümkün kılar.

## Sıradaki faz

- Wordix'e özel `WordixApiService` response adaptörü ve yalnızca `ProfileApiService` için pilot inheritance geçişi.

## Risk / dikkat edilmesi gerekenler

- Feature servisleri henüz library'yi kullanmıyor; gerçek uygulama entegrasyonu pilot fazda başlayacaktır.
- `ApiResponse<T>` unwrap, Keycloak ve hata eşleme davranışları bilinçli olarak genel library dışında tutulmuştur.
- `npm install` development dependency ağında bir düşük seviye uyarı bildirdi; production bağımlılık audit sonucu temizdir.
- Blob, progress event stream ve tam `HttpResponse` desteği gerçek ihtiyaç oluşana kadar ilk public contracta eklenmemiştir.
