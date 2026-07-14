# API Client Core — Deck Geçişi

Bu rapor, Deck feature API servisinin genel library ve Wordix response adaptörü üzerinden inheritance yapısına taşınmasını kaydeder.

## Faz

`DeckApiService` GET, POST ve DELETE operasyonlarının kontrollü inheritance geçişi.

## Yapılan iş

- `DeckApiService`, `WordixApiService` üzerinden inheritance alacak şekilde geçirildi.
- Servisten doğrudan `HttpClient`, `AppConfigService`, base URL, `ApiResponse` ve response mapper tekrarları kaldırıldı.
- Authenticated kullanıcı deck listesi merkezi `getData` metoduna bağlandı.
- Deck detail route ID encoding davranışı korunarak merkezi `getData` metoduna bağlandı.
- Deck create ve item add requestleri merkezi `postData` metoduna bağlandı.
- Deck item remove operasyonu merkezi `deleteData` metoduna bağlandı.
- Remove requestinin body göndermeyen DELETE davranışı korundu.
- Deck test providerı gerçek inheritance zincirini kullanmak üzere `provideApiClient` ile güncellendi.
- Mevcut beş deck endpoint testi değiştirilmeden yeni altyapı üzerinde başarılı oldu.

## Değişen dosyalar

- `src/app/features/decks/api/deck-api.service.ts`
- `src/app/features/decks/api/deck-api.service.spec.ts`

## Eklenen dosyalar

- `docs/phase-reports/API-CLIENT-CORE-DECK.md`

## Silinen dosyalar

- Yok.

## Çalıştırılan komutlar

- Canlı Swagger deck endpoint doğrulaması.
- Değişen deck dosyaları için Prettier.
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
- Deck API servisinin beş endpoint testi inheritance yapısı üzerinde başarılıdır.

## Backend endpoint doğrulaması

- `GET /api/decks` -> `GetMyDecksResponseApiResponse`
- `GET /api/decks/{id}` -> `DeckDetailResponseApiResponse`
- `POST /api/decks` -> `CreateDeckResponseApiResponse`
- `POST /api/decks/{deckId}/items` -> `AddItemToDeckResponseApiResponse`
- `DELETE /api/decks/{deckId}/items/{userLearningItemId}` -> `RemoveItemFromDeckResponseApiResponse`
- Endpoint, request DTO veya response DTO değişikliği yapılmadı.

## Ürün kararları / deferred backlog değişikliği

- Değişiklik yok.

## Bu faz proje için neden önemli?

Deck geçişi, ortak altyapının collection/detail GET, typed mutation POST ve body içermeyen DELETE akışlarını aynı feature içinde birlikte yönetebildiğini doğruladı. Böylece daha geniş Dictionary mutation yüzeyine geçmeden önce DELETE response unwrap ve nested route davranışları production contractıyla güvence altına alındı.

## Sıradaki faz

- `DictionaryApiService` için GET, POST, PUT ve DELETE operasyonlarını kapsayan bağımsız inheritance geçişi.

## Risk / dikkat edilmesi gerekenler

- Dictionary servisi not ve flag operasyonlarıyla geniş bir mutation yüzeyine sahiptir; tek başına ayrı fazda taşınmalıdır.
- Doğrudan `HttpClient` kullanan feature API servisi sayısı üçe düşmüştür.
- Genel library Wordix, Keycloak ve feature DTO bağımlılıklarından bağımsız kalmaya devam etmelidir.
