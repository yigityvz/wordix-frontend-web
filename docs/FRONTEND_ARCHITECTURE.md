# Wordix Frontend Architecture

Durum: F0B architectural baseline
Tarih: 2026-07-10

## Hedef

Wordix frontend; canlı backend sözleşmesine bağlı, Keycloak ile güvenli, feature bazlı ve production'a taşınabilir bir Angular uygulaması olacaktır.

Temel teknoloji kararları:

```text
Angular standalone APIs
TypeScript strict mode
Angular Router
Tailwind CSS
NgRx Store + Effects + Router Store
Keycloak Authorization Code + PKCE
```

Kesin paket sürümleri F1A sırasında güncel Angular uyumluluğu doğrulanarak seçilir.

## Mimari ilkeler

- Backend Swagger/OpenAPI davranışın gerçek kaynağıdır.
- Component doğrudan HTTP çağırmaz.
- Page component facade ile konuşur.
- Effect API çağrısını ve yan etkileri yönetir.
- Reducer yalnızca immutable state değiştirir.
- Mapper backend DTO'sunu UI view modeline dönüştürür.
- Feature iç detayları başka feature tarafından import edilmez.
- User ve admin aynı primitive tasarım sistemini kullanır; shell, navigation ve business page katmanları ayrıdır.
- Mock mutation, fake başarı ve demo navigation production koduna girmez.

## Hedef klasör yapısı

```text
src/
  app/
    core/
      auth/
      config/
      errors/
      guards/
      http/
      interceptors/
      layout/
        user-shell/
        admin-shell/
        user-navigation/
        admin-navigation/
        topbar/
        mobile-nav/
      logging/
      store/
      theme/
    shared/
      components/
      directives/
      models/
      pipes/
      utils/
    features/
      auth/
      dashboard/
      lookup/
      dictionary/
      decks/
      quizzes/
      statistics/
      admin-analytics/
      profile/
      preferences/
    app.config.ts
    app.routes.ts
  environments/
```

## Dependency kuralları

```text
core     -> shared olabilir; feature import edemez
shared   -> core veya feature import edemez
feature  -> core ve shared import edebilir
featureA -> featureB internal dosyalarını import edemez
```

Featurelar arası bilgi paylaşımı için route parametresi, shared contract veya açık facade abstraction kullanılır. Barrel dosyaları yalnızca bilinçli public API tanımlarında açılır.

## Feature standardı

Stateful featurelar aşağıdaki yapıyı izler:

```text
features/<feature>/
  api/<feature>-api.service.ts
  components/
  facades/<feature>.facade.ts
  mappers/<feature>.mapper.ts
  models/<feature>.models.ts
  pages/
  store/
    <feature>.actions.ts
    <feature>.effects.ts
    <feature>.reducer.ts
    <feature>.selectors.ts
    <feature>.state.ts
  <feature>.routes.ts
```

Stateless veya yalnızca route composition yapan feature için zorunlu olmayan store dosyaları açılmaz.

## Data flow

```text
User interaction
  -> Page component
  -> Feature facade
  -> NgRx action
  -> Effect
  -> Feature API service
  -> Wordix API
  -> DTO mapper
  -> Success/failure action
  -> Reducer/selectors
  -> View model
```

Backend mutation başarılı olmadan UI state kalıcı olarak başarılı gösterilmez. Optimistic update yalnızca endpoint semantiği ve rollback davranışı açıkça doğrulanırsa kullanılabilir.

## NgRx sınırları

Root store:

```text
auth
router
ui
```

Feature storelar:

```text
profile
lookup
dictionary
decks
quizzes
statistics
adminAnalytics
```

Theme tercihi küçük ve browser-local bir state olduğu için theme service/facade tarafından yönetilebilir. Dashboard, statistics ve dictionary selector/facade sonuçlarını bir view modelde birleştirir; gereksiz ayrı store açmaz.

## Authentication mimarisi

1. `/` üzerinde Wordix authentication giriş yüzeyi gösterilir.
2. Sign in Keycloak login akışını başlatır.
3. Create account Keycloak registration akışını başlatır.
4. `/auth/callback` Authorization Code + PKCE akışını tamamlar.
5. `GET /api/profile/me` çağrılır.
6. Roller okunur ve yönlendirme yapılır:
   - `admin` -> `/admin/dashboard`
   - `basic_user` -> `/dashboard`
7. İki rol birlikteyse admin önceliklidir.

Kurallar:

- Token manuel üretilmez.
- Token localStorage'a açık metin uygulama statei olarak yazılmaz.
- API requestlerine bearer token interceptor tarafından eklenir.
- `keycloakUserId` UI'da gösterilmez ve ownership parametresi olarak gönderilmez.
- Admin ve user arasında role/demo switcher bulunmaz.

## Route ve shell ayrımı

Public/auth routes:

```text
/
/auth/callback
/unauthorized
/forbidden
/not-found
/server-error
```

User shell:

```text
/dashboard
/lookup
/dictionary
/dictionary/:userLearningItemId
/decks
/decks/:deckId
/quizzes/start
/quizzes/:quizSessionId/play
/quizzes/:quizSessionId/summary
/statistics
/profile
/settings
```

Admin shell:

```text
/admin/dashboard
/admin/analytics/top-lookups
/admin/analytics/most-saved
/admin/analytics/quiz-insights
/admin/analytics/provider
```

Admin shell user bottom navigation veya user global lookup içermez. Backend endpointi olmayan admin ekranları route tablosuna eklenmez.

## HTTP katmanı

Core HTTP katmanı şu ortak response kavramlarını yönetir:

```text
ApiResponse<T>
ErrorResponse
ValidationError
PagedResult<T>
```

Interceptor sorumlulukları:

- Bearer token ekleme
- 401 session/login akışı
- 403 forbidden state
- Validation error normalization
- Network/server error normalization
- Correlation/error bilgisinin güvenli loglanması

Feature API servisleri yalnızca kendi endpoint grubunu bilir. Tek bir devasa `WordixApiService` oluşturulmaz.

## Theme mimarisi

```ts
type WordixTheme = 'light' | 'dark' | 'system';
```

- Tercih `wordix-theme` anahtarıyla localStorage'da saklanır.
- Varsayılan tercih `system` olur.
- `system`, `prefers-color-scheme` değişikliklerini dinler.
- Uygulanan görünüm `html.dark` classıyla kontrol edilir.
- Componentler Coastal Blues semantic tokenlarını kullanır; hard-coded tema rengi kullanmaz.

## UI state standardı

Her veri ekranı şu durumları açıkça destekler:

```text
initial
loading/skeleton
success
empty
validation error
recoverable API error
forbidden/not found
mutation pending/disabled
```

Backend desteği bulunmayan aksiyon UI'ya eklenmez. Coming Soon veya sahte disabled buton kullanılmaz; özellik `DEFERRED_FEATURES.md` içinde takip edilir.

## Testing sınırları

- Unit: mapper, reducer, selector, facade orchestration ve validation
- Component: kritik form ve interactive state
- Integration: effect + API error mapping
- E2E smoke: login redirect, profile, lookup, dictionary save, deck create/item, quiz ve summary

Test stratejisi ilgili uygulama fazında, gerçek kurulan Angular araç zincirine göre kesinleştirilir.
