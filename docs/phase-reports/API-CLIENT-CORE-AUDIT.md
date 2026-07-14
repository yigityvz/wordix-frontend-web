# Yeniden Kullanılabilir API Client Core — Mimari Audit

Bu rapor, Wordix feature API servislerindeki tekrarları ve daha sonra bağımsız GitHub repository'sine çıkarılacak Angular API client kütüphanesinin sınırlarını belirler.

## Faz

Yeniden kullanılabilir API client core için davranış değiştirmeyen mimari audit.

## Yapılan iş

- Canlı Swagger `http://localhost:5000/swagger/v1/swagger.json` üzerinden doğrulandı.
- Yedi feature API servisi ve bunların testleri incelendi.
- Core config, response mapper, authentication ve error interceptor sorumlulukları karşılaştırıldı.
- Mevcut servislerde 15 GET, 10 POST, 1 PUT ve 3 DELETE olmak üzere 29 doğrudan HTTP çağrısı bulundu.
- Yedi servisin tamamında `HttpClient` injection, API base URL normalizasyonu ve `ApiResponse<T>` açma davranışının tekrarlandığı doğrulandı.
- Genel kütüphane ile Wordix'e özel adaptörün sorumluluk sınırı belirlendi.

## Mevcut sorun

Her feature servisi aynı altyapı hazırlığını kendi içinde yapıyor. Bu durum URL birleştirme, request seçenekleri veya ortak HTTP davranışı değiştiğinde birden fazla servisin ayrı ayrı değiştirilmesini gerektiriyor. Statistics ve admin servisleri kendi private GET helperlarını oluşturmaya başlamış; bu da ortak altyapı eksikliğinin feature içinde farklı çözümler üretmesine yol açıyor.

## Kararlaştırılan mimari

Yapı iki katmanlı olacaktır:

```text
Yayımlanabilir Angular API Client Core
  BaseApiService
  API client config/token
  URL birleştirme
  Typed GET/POST/PUT/PATCH/DELETE
  Query ve request option tipleri

Wordix HTTP Adaptörü
  WordixApiService extends BaseApiService
  ApiResponse<T> unwrap
  Wordix AppConfig bağlantısı

Feature API Servisleri
  ProfileApiService extends WordixApiService
  LookupApiService extends WordixApiService
  DictionaryApiService extends WordixApiService
  DeckApiService extends WordixApiService
  QuizApiService extends WordixApiService
  StatisticsApiService extends WordixApiService
  AdminAnalyticsApiService extends WordixApiService
```

Feature servisleri yalnızca kendi endpointlerini, request DTO'larını ve response DTO'larını bilecektir. Genel HTTP metotları `protected` tutulacak; componentlerin veya featureların domain endpointini atlayarak rastgele URL çağırması engellenecektir.

## Genel kütüphanede bulunacaklar

- Injection token üzerinden verilen `baseUrl` yapılandırması.
- Slash hatası üretmeyen merkezi URL birleştirme.
- Typed `get`, `post`, `put`, `patch` ve `delete` metotları.
- Angular `HttpParams`, header, context ve gerekli response seçeneklerini taşıyabilen küçük request option contractları.
- Raw response payloadını döndüren ve belirli bir backend response zarfına bağımlı olmayan davranış.
- URL, HTTP verb, body, params ve options davranışlarını doğrulayan bağımsız unit testler.
- Public API exportları ve başka projede kullanım dokümantasyonu.

## Wordix uygulamasında kalacaklar

- `ApiResponse<T>`, `ErrorResponse`, `PagedResult<T>` ve Wordix response unwrap davranışı.
- Keycloak token alma ve `Authorization` interceptorı.
- Wordix API sınırı/origin kontrolü.
- `ApiError` modeli ve Wordix hata eşlemesi.
- Environment ve `AppConfigService` bağlantısı.
- Feature endpointleri, DTO'lar, mapperlar, facadeler ve NgRx state.

Bu ayrım sayesinde kütüphane Keycloak, Wordix rolleri, ownership kuralları veya Wordix DTO'ları olmadan başka Angular uygulamalarında kullanılabilir.

## İlk uygulama fazının hedef dosyaları

İlk uygulama fazında Angular workspace altında bağımsız bir library projesi açılması planlanır:

```text
projects/angular-api-client-core/
  src/lib/config/
  src/lib/models/
  src/lib/services/base-api.service.ts
  src/lib/services/base-api.service.spec.ts
  src/public-api.ts
```

Kesin dosya adları library scaffold üretildikten sonra Angular 21'in oluşturduğu yapıya göre doğrulanacaktır. İlk uygulama fazında Wordix feature servisleri henüz topluca taşınmayacaktır.

## Geçiş sırası

1. Bağımsız library scaffold ve core unit testleri.
2. Wordix response adaptörü.
3. En küçük servis olan `ProfileApiService` ile pilot geçiş.
4. Pilot build/test doğrulamasından sonra diğer feature servislerinin küçük fazlarla taşınması.
5. Tüm feature geçişlerinden sonra Wordix importu bulunmadığını doğrulayan bağımsız library build/test.
6. README, package metadata ve yayın hazırlığı.
7. Ayrı GitHub repository'sine çıkarma ve bağımsız paket yaşam döngüsü.

## Kabul kriteri sonucu

- Swagger erişilebilir ve 36 path altında 41 HTTP operation bulundu.
- Mevcut endpoint veya DTO davranışı değiştirilmedi.
- Kütüphane ile Wordix adaptörü arasındaki sınır belirlendi.
- Inheritance gereksinimi `FeatureApiService -> WordixApiService -> BaseApiService` zinciriyle karşılandı.
- Ayrı GitHub repository'sine çıkarılabilirlik tasarımın zorunlu kabul kriteri olarak kaydedildi.

## Değişen dosyalar

- Yok.

## Eklenen dosyalar

- `docs/phase-reports/API-CLIENT-CORE-AUDIT.md`

## Silinen dosyalar

- Yok.

## Çalıştırılan komutlar

- Canlı Swagger erişim ve endpoint taraması.
- Feature API servisleri ve core HTTP altyapısı için kaynak taraması.
- Mevcut servis testleri ve Angular workspace yapılandırması incelemesi.
- Tekrarlanan HTTP kullanım sayımı.
- `npx prettier --check docs/phase-reports/API-CLIENT-CORE-AUDIT.md`
- `npm test -- --watch=false`
- `npm run build`

## Build sonucu

- Production build başarılıdır.
- Çıktı `dist/wordix-frontend-web` altında oluşturulmuştur.

## Test sonucu

- 68 test dosyası başarılıdır.
- 217 test başarılıdır.
- Audit raporu Prettier kontrolünden geçmiştir.

## Backend endpoint doğrulaması

- Swagger HTTP 200 ile erişildi.
- `Wordix API v1` altında 36 path ve 41 operation doğrulandı.
- Base API tasarımı endpoint adı veya DTO varsayımı eklemez.

## Ürün kararları / deferred backlog değişikliği

- Değişiklik yok.

## Bu faz proje için neden önemli?

Bu ayrım, mentorun istediği inheritance yapısını Wordix'e kilitli bir yardımcı sınıf yerine gerçekten yeniden kullanılabilir bir Angular altyapısına dönüştürür. Önce library sınırının belirlenmesi, feature geçişlerinde davranış kaybı yaşanmasını ve daha sonra GitHub'a çıkarılırken Wordix bağımlılıklarının temizlenmesi için ikinci bir yeniden yazım yapılmasını önler.

## Sıradaki faz

- Angular API Client Core library scaffold, config contractı, `BaseApiService` ve bağımsız unit testleri.

## Risk / dikkat edilmesi gerekenler

- Genel base sınıf Wordix `ApiResponse<T>` zarfını doğrudan bilirse başka backendlerde kullanılamaz; unwrap davranışı adaptörde kalmalıdır.
- Keycloak veya authentication davranışı kütüphaneye gömülmemelidir; consumer interceptor sağlamalıdır.
- İlk fazda bütün servisleri aynı anda taşımak regresyon alanını büyütür; pilot geçiş zorunludur.
- Binary/blob, progress event ve tam `HttpResponse` gibi ileri seçenekler gerçek ihtiyaç oluşmadan ilk sürüme eklenmemelidir.
