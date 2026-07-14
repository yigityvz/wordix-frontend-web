# API Client Core — Statistics Geçişi

Bu rapor, Statistics feature API servisinin sorgu parametreleri korunarak genel API client library ve Wordix response adaptörü üzerinden inheritance yapısına taşınmasını kaydeder.

## Faz

`StatisticsApiService` içindeki beş GET operasyonunun kontrollü inheritance geçişi.

## Yapılan iş

- `StatisticsApiService`, `WordixApiService` üzerinden inheritance alacak şekilde geçirildi.
- Servisten doğrudan `HttpClient`, `AppConfigService`, base URL, `ApiResponse` ve response mapper tekrarları kaldırıldı.
- Learning summary, quiz statistics, difficult items, deck statistics ve confidence distribution çağrıları merkezi `getData` metoduna bağlandı.
- Quiz ve difficult-item sorgularının Swagger alan adları korundu.
- Undefined, null ve boş string query değerlerini göndermeme davranışı korundu.
- Requestlere kullanıcı veya ownership alanı eklenmedi.
- Statistics test providerı `provideApiClient` ile güncellendi.
- Daha önce doğrudan sınanmayan deck statistics ve confidence distribution senaryoları eklendi.

## Değişen dosyalar

- `src/app/features/statistics/api/statistics-api.service.ts`
- `src/app/features/statistics/api/statistics-api.service.spec.ts`

## Eklenen dosyalar

- `docs/phase-reports/API-CLIENT-CORE-STATISTICS.md`

## Silinen dosyalar

- Yok.

## Çalıştırılan kontroller

- Canlı Swagger Statistics endpoint ve query parametresi doğrulaması.
- Değişen Statistics dosyaları için Prettier.
- Eski HTTP bağımlılığı ve library sınır taraması.
- Statistics odak testi: `npm test -- --watch=false --include=src/app/features/statistics/api/statistics-api.service.spec.ts`
- `npm run test:api-core -- --watch=false`
- `npm test -- --watch=false`
- `npm run build`

## Build sonucu

- Angular API Client Core production package buildi başarılıdır.
- Wordix uygulama production buildi başarılıdır.
- Library -> application build sırası başarılıdır.

## Test sonucu

- Statistics odak testi: 1 test dosyası ve 5 test başarılıdır.
- Library: 2 test dosyası ve 8 test başarılıdır.
- Wordix uygulaması: 69 test dosyası ve 222 test başarılıdır.

## Backend endpoint doğrulaması

- `GET /api/user-statistics/learning-summary` -> `UserLearningSummaryResponseApiResponse`
- `GET /api/user-statistics/quizzes` -> `QuizStatisticsResponseApiResponse`
- `GET /api/user-statistics/difficult-items` -> `DifficultLearningItemResponsePagedResultApiResponse`
- `GET /api/user-statistics/decks` -> `DeckStatisticsResponseApiResponse`
- `GET /api/user-statistics/confidence-distribution` -> `ConfidenceScoreDistributionResponseApiResponse`
- Quiz sorgusu: `FromUtc`, `ToUtc`, `QuizType`, `QuizSourceType`, `QuizContentMode`, `DifficultyGroup`.
- Difficult items sorgusu: `PageNumber`, `PageSize`, `Source`, `SortBy`, `ItemType`, `LearningStatus`.
- Endpoint, request DTO veya response DTO değişikliği yapılmadı.

## Ürün kararları / deferred backlog değişikliği

- Değişiklik yok.

## Bu faz proje için neden önemli?

Statistics geçişi, ortak API client yapısının yalnızca basit GET çağrılarını değil, opsiyonel filtre ve pagination parametreleri taşıyan sorguları da backend sözleşmesini bozmadan yönetebildiğini doğruladı.

## Sıradaki faz

- Son doğrudan HTTP kullanan feature servisi olan `AdminAnalyticsApiService`, query parametreleri korunarak ortak API client inheritance yapısına geçirilecek.

## Risk / dikkat edilmesi gerekenler

- Admin Analytics endpointleri admin role guard ve mevcut authorization interceptor zincirini kullanmaya devam etmelidir.
- Genel library Wordix, Keycloak ve feature DTO bağımlılıklarından bağımsız kalmalıdır.
