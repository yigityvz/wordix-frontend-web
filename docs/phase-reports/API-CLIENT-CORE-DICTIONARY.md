# API Client Core — Dictionary Geçişi

Bu rapor, Dictionary feature API servisinin genel API client library ve Wordix response adaptörü üzerinden inheritance yapısına taşınmasını kaydeder.

## Faz

`DictionaryApiService` GET, POST, PUT ve DELETE operasyonlarının kontrollü inheritance geçişi.

## Yapılan iş

- `DictionaryApiService`, `WordixApiService` üzerinden inheritance alacak şekilde geçirildi.
- Servisten doğrudan `HttpClient`, `AppConfigService`, base URL, `ApiResponse` ve response mapper tekrarları kaldırıldı.
- Dictionary liste ve detay sorguları merkezi `getData` metoduna bağlandı.
- Kelime ve cümle kaydetme işlemleri merkezi `postData` metoduna bağlandı.
- Not listeleme, oluşturma, güncelleme ve silme akışları merkezi GET, POST, PUT ve DELETE metotlarına bağlandı.
- Flag listeleme, ekleme ve silme akışları merkezi GET, POST ve DELETE metotlarına bağlandı.
- Route ID ve flag type encoding davranışları korundu.
- Request gövdelerine kullanıcı veya ownership alanı eklenmedi.
- Dictionary test providerı gerçek inheritance zincirini kullanmak üzere `provideApiClient` ile güncellendi.
- Mevcut test senaryoları değiştirilmeden yeni altyapı üzerinde başarılı oldu.

## Değişen dosyalar

- `src/app/features/dictionary/api/dictionary-api.service.ts`
- `src/app/features/dictionary/api/dictionary-api.service.spec.ts`

## Eklenen dosyalar

- `docs/phase-reports/API-CLIENT-CORE-DICTIONARY.md`

## Silinen dosyalar

- Yok.

## Çalıştırılan kontroller

- Canlı Swagger üzerinden Dictionary, Notes ve Flags endpoint doğrulaması.
- Değişen Dictionary dosyaları için Prettier.
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
- Dictionary servisinin liste, detay, kaydetme, not ve flag senaryoları inheritance yapısı üzerinde başarılıdır.

## Backend endpoint doğrulaması

- `GET /api/user-dictionary` -> `GetMyDictionaryResponseApiResponse`
- `GET /api/user-dictionary/{id}` -> `UserDictionaryItemResponseApiResponse`
- `POST /api/user-dictionary` -> `SaveLearningItemResponseApiResponse`
- `POST /api/user-dictionary/sentences` -> `SaveSentenceToDictionaryResponseApiResponse`
- `GET /api/user-dictionary/{userLearningItemId}/notes` -> `GetUserLearningNotesResponseApiResponse`
- `POST /api/user-dictionary/{userLearningItemId}/notes` -> `UserLearningNoteResponseApiResponse`
- `PUT /api/user-dictionary/notes/{noteId}` -> `UserLearningNoteResponseApiResponse`
- `DELETE /api/user-dictionary/notes/{noteId}` -> `UserLearningNoteResponseApiResponse`
- `GET /api/user-dictionary/{userLearningItemId}/flags` -> `GetUserLearningFlagsResponseApiResponse`
- `POST /api/user-dictionary/{userLearningItemId}/flags` -> `UserLearningFlagResponseApiResponse`
- `DELETE /api/user-dictionary/{userLearningItemId}/flags/{flagType}` -> `UserLearningFlagResponseApiResponse`
- Endpoint, request DTO veya response DTO değişikliği yapılmadı.

## Ürün kararları / deferred backlog değişikliği

- Değişiklik yok.

## Bu faz proje için neden önemli?

Dictionary geçişi, ortak altyapının aynı feature içinde collection/detail sorgularını ve GET, POST, PUT, DELETE mutation akışlarını birlikte yönetebildiğini doğruladı. Böylece API client library yalnızca basit servislerde değil, projenin en geniş kullanıcı mutation yüzeylerinden birinde de doğrulanmış oldu.

## Sıradaki faz

- `StatisticsApiService` sorgu parametrelerini koruyarak genel API client inheritance yapısına geçirilecek.

## Risk / dikkat edilmesi gerekenler

- Statistics servisindeki opsiyonel sorgu parametreleri backend sözleşmesiyle birebir korunmalıdır.
- Doğrudan `HttpClient` kullanan feature API servisi sayısı ikiye düşmüştür.
- Genel library Wordix, Keycloak ve feature DTO bağımlılıklarından bağımsız kalmaya devam etmelidir.
