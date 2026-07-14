# API Client Core — Admin Analytics Geçişi

Bu rapor, Admin Analytics feature API servisinin query ve authorization davranışları korunarak genel API client library ile Wordix response adaptörü üzerinden inheritance yapısına taşınmasını kaydeder.

## Faz

`AdminAnalyticsApiService` içindeki beş admin GET operasyonunun kontrollü inheritance geçişi.

## Yapılan iş

- `AdminAnalyticsApiService`, `WordixApiService` üzerinden inheritance alacak şekilde geçirildi.
- Servisten doğrudan `HttpClient`, `AppConfigService`, base URL, `ApiResponse` ve response mapper tekrarları kaldırıldı.
- Dashboard, top searches, top saved, most wrong ve provider stats çağrıları merkezi `getData` metoduna bağlandı.
- `FromUtc`, `ToUtc` ve `Limit` query alan adları korundu.
- Undefined tarih ve limit değerlerini göndermeme davranışı korundu; sıfır limit değeri kaybedilmedi.
- Mevcut bearer interceptor, admin role guard ve route authorization yapısı değiştirilmedi.
- Admin Analytics test providerı `provideApiClient` ile güncellendi.
- Sıkışık tek satır servis tanımları işlev değiştirilmeden okunabilir bloklara ayrıldı.
- Bu geçişle feature API servislerindeki doğrudan `HttpClient` kullanımı tamamıyla kaldırıldı.

## Değişen dosyalar

- `src/app/features/admin-analytics/api/admin-analytics-api.service.ts`
- `src/app/features/admin-analytics/api/admin-analytics-api.service.spec.ts`

## Eklenen dosyalar

- `docs/phase-reports/API-CLIENT-CORE-ADMIN-ANALYTICS.md`

## Silinen dosyalar

- Yok.

## Çalıştırılan kontroller

- Canlı Swagger Admin Analytics endpoint ve query parametresi doğrulaması.
- Değişen Admin Analytics dosyaları için Prettier.
- Eski HTTP bağımlılığı, tüm feature servisleri ve library sınır taraması.
- Admin Analytics odak testi: `npm test -- --watch=false --include=src/app/features/admin-analytics/api/admin-analytics-api.service.spec.ts`
- `npm run test:api-core -- --watch=false`
- `npm test -- --watch=false`
- `npm run build`

## Build sonucu

- Angular API Client Core production package buildi başarılıdır.
- Wordix uygulama production buildi başarılıdır.
- Library -> application build sırası başarılıdır.

## Test sonucu

- Admin Analytics odak testi: 1 test dosyası, 3 senaryo ve 5 endpoint başarılıdır.
- Library: 2 test dosyası ve 8 test başarılıdır.
- Wordix uygulaması: 69 test dosyası ve 222 test başarılıdır.

## Backend endpoint doğrulaması

- `GET /api/admin/analytics/dashboard` -> `AdminDashboardAnalyticsResponseApiResponse`
- `GET /api/admin/analytics/top-searches` -> `TopSearchesAnalyticsResponseApiResponse`
- `GET /api/admin/analytics/top-saved` -> `TopSavedLearningItemsAnalyticsResponseApiResponse`
- `GET /api/admin/analytics/most-wrong` -> `MostWrongLearningItemsAnalyticsResponseApiResponse`
- `GET /api/admin/analytics/provider-stats` -> `ProviderStatsAnalyticsResponseApiResponse`
- Dashboard ve provider stats sorguları: `FromUtc`, `ToUtc`.
- Liste sorguları: `FromUtc`, `ToUtc`, `Limit`.
- Endpoint, request DTO veya response DTO değişikliği yapılmadı.

## Ürün kararları / deferred backlog değişikliği

- Değişiklik yok.

## Bu faz proje için neden önemli?

Admin Analytics geçişiyle Wordix feature API servislerinin tamamı aynı reusable HTTP temel sınıfını ve Wordix response adaptörünü kullanır hale geldi. Feature servisleri artık URL birleştirme, doğrudan `HttpClient` kullanımı ve response zarfı açma tekrarları yerine yalnızca kendi endpoint ve DTO sözleşmelerine odaklanıyor.

## Sıradaki faz

- API Client Core çalışmasının bağımsız GitHub repository/package hazırlığı planlanacak; repository oluşturma ve push işlemleri kullanıcı onayı olmadan yapılmayacak.

## Risk / dikkat edilmesi gerekenler

- Library ayrı repositoryye alınırken Angular peer dependency aralıkları ve package yayınlama stratejisi ayrıca belirlenmelidir.
- Wordix'e özel `WordixApiService` adaptörü uygulamada kalmalı; genel library içine taşınmamalıdır.
- GitHub'a aktarım öncesinde lisans, package adı ve yayın kapsamı kararlaştırılmalıdır.
