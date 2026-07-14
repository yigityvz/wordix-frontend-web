# API Client Core — Lookup ve Quiz Geçişi

Bu rapor, Lookup ve Quiz feature API servislerinin genel library ile Wordix response adaptörü üzerinden inheritance yapısına taşınmasını kaydeder.

## Faz

`LookupApiService` ve `QuizApiService` kontrollü inheritance geçişi.

## Yapılan iş

- `LookupApiService`, `WordixApiService` üzerinden inheritance alacak şekilde geçirildi.
- Lookup servisinden doğrudan `HttpClient`, `AppConfigService`, base URL, `ApiResponse` ve response mapper tekrarları kaldırıldı.
- `POST /api/lookups` request body ve response DTO contractı korundu.
- `QuizApiService`, `WordixApiService` üzerinden inheritance alacak şekilde geçirildi.
- Quiz servisinden doğrudan HTTP ve response zarfı tekrarları kaldırıldı.
- Quiz start, answer submit, summary ve recommendation save operasyonları merkezi `postData`/`getData` metotlarına bağlandı.
- Quiz route kimliklerinin `encodeURIComponent` güvenliği korundu.
- Recommendation save endpointinin Swagger ile uyumlu null POST body davranışı korundu.
- Lookup ve Quiz unit testleri `provideApiClient` ile gerçek inheritance zincirini sınayacak şekilde güncellendi.
- Diğer dört feature API servisine dokunulmadı.

## Değişen dosyalar

- `src/app/features/lookup/api/lookup-api.service.ts`
- `src/app/features/lookup/api/lookup-api.service.spec.ts`
- `src/app/features/quizzes/api/quiz-api.service.ts`
- `src/app/features/quizzes/api/quiz-api.service.spec.ts`

## Eklenen dosyalar

- `docs/phase-reports/API-CLIENT-CORE-LOOKUP-QUIZ.md`

## Silinen dosyalar

- Yok.

## Çalıştırılan komutlar

- Canlı Swagger lookup ve quiz endpoint doğrulaması.
- Değişen servisler için Prettier kontrolü.
- Eski HTTP bağımlılığı ve library sınır taraması.
- `npm run test:api-core -- --watch=false`
- `npm test -- --watch=false`
- `npm run build`

## Build sonucu

- Angular API Client Core production package buildi başarılıdır.
- Wordix uygulama production buildi başarılıdır.
- Library -> application build sırası başarılıdır.

## Test sonucu

- Library: 2 test dosyası ve 8 test başarılıdır.
- Wordix uygulaması: 69 test dosyası ve 220 test başarılıdır.
- Mevcut Lookup ve Quiz API testlerinin tamamı inheritance yapısı üzerinde başarılıdır.

## Backend endpoint doğrulaması

- `POST /api/lookups` -> `LookupResponseApiResponse`
- `POST /api/quizzes` -> `StartQuizResponseApiResponse`
- `POST /api/quizzes/{quizSessionId}/answers` -> `SubmitQuizAnswerResponseApiResponse`
- `GET /api/quizzes/{quizSessionId}/summary` -> `QuizSummaryResponseApiResponse`
- `POST /api/quizzes/recommendations/{quizRecommendationItemId}/save-to-dictionary` -> `SaveRecommendedItemToDictionaryResponseApiResponse`
- Endpoint, request DTO veya response DTO değişikliği yapılmadı.

## Ürün kararları / deferred backlog değişikliği

- Değişiklik yok.

## Bu faz proje için neden önemli?

Pilot profile GET çağrısından sonra gerçek POST body, route parametresi, null body ve backend hesaplamalı quiz response akışları da ortak inheritance altyapısı üzerinde doğrulandı. Böylece library ve Wordix adaptörünün yalnızca basit GET servisleri için değil, farklı request biçimleri kullanan production featureları için de uygun olduğu kanıtlandı.

## Sıradaki faz

- `DeckApiService` için GET, POST ve DELETE operasyonlarını kapsayan kontrollü inheritance geçişi.

## Risk / dikkat edilmesi gerekenler

- Dictionary, Statistics ve Admin Analytics servisleri daha geniş mutation veya query parametresi yüzeyine sahiptir; ayrı küçük fazlarda taşınmalıdır.
- Doğrudan `HttpClient` kullanan feature API servisi sayısı dört olarak kalmıştır.
- Genel library Wordix, Keycloak ve feature DTO bağımlılıklarından bağımsız kalmaya devam etmelidir.
