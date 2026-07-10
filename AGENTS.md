# Wordix Frontend Web — Codex Master Plan / AGENTS.md

> Bu dosya `wordix-frontend-web` repository köküne **AGENTS.md** adıyla konulmalıdır. Codex bu dosyayı proje talimatı olarak okuyacak.

---

## 0. Codex için değişmeyen gerçekler

Bu frontend projesi backendden bağımsız değildir. Backend Wordix sisteminin gerçek API, authentication, authorization, ownership ve business rule kaynağıdır.

Codex şu sırayı izlemelidir:

1. Önce bu `AGENTS.md` dosyasını oku.
2. Backend Swagger/OpenAPI sözleşmesini kontrol et: `http://localhost:5000/swagger/v1/swagger.json`.
3. Endpoint route, request DTO ve response DTO isimlerinde varsayım yapma.
4. Plan ile backend kaynak kodu veya Swagger çelişirse **backend kaynak kodu / Swagger gerçek referanstır**.
5. Her fazı küçük adımlarla uygula; bir faz bitmeden sonraki faza geçme.
6. Her faz sonunda build/test çalıştır ve değişen dosyaları raporla.

---

## 1. Repository ve teknoloji bilgisi

Yeni frontend repository adı:

```text
wordix-frontend-web
```

Hedef teknoloji seti:

```text
Angular
Tailwind CSS
NgRx
Keycloak Authorization Code + PKCE
TypeScript strict mode
Feature-based Clean Frontend Architecture
Responsive web UI
```

Local/Docker backend adresleri:

```text
Backend API: http://localhost:5000
Swagger:     http://localhost:5000/swagger
Keycloak:    http://localhost:8080
Realm:       wordix
Client:      wordix-web
API Client:  wordix-api
```

Backend Docker servisleri:

```text
wordix-keycloak-db
wordix-keycloak
wordix-mssql
wordix-api
```

Frontend ileride Docker'a alınacaksa compose'a ayrıca `wordix-web` servisi eklenecektir.

---

## 2. Backend mimarisinden gelen kalıcı kurallar

### 2.1 Authentication

Backend authentication server değildir. Frontend login/register/session işlemlerini backend endpointiyle yapmayacak. Login Keycloak üzerinden yapılacak.

Akış:

```text
Kullanıcı Keycloak login ekranına gider.
Kullanıcı giriş yapar.
Frontend access token alır.
API çağrılarına Authorization: Bearer <access_token> ekler.
Backend tokenı doğrular.
```

Yasaklar:

```text
Frontend backend /login endpointi aramayacak.
Frontend backend /register endpointi aramayacak.
Frontend username/password değerini Wordix API'ye göndermeyecek.
Frontend tokenı elle üretmeyecek.
```

### 2.2 Ownership

Backend user-owned kayıtları `KeycloakUserId` ile sahiplenir. Frontend hiçbir request body, query veya route içinde kullanıcı id göndermeyecek.

Yasak alanlar:

```text
keycloakUserId
userId
userProfileId
ownerId
```

Bu değerler frontend formlarında asla kullanıcıdan alınmaz. Backend token içindeki `sub` claiminden kullanıcıyı kendisi çözer.

### 2.3 UserProfile yok

Backendde `UserProfile` kaldırılmıştır ve geri gelmeyecektir. Frontend hiçbir yerde şu kavramları kullanmayacak:

```text
UserProfile
UserProfileId
profile sync
profile create
```

`/api/profile/me` endpointi DB profili oluşturmaz; sadece token bilgisini döner.

### 2.4 API response standardı

Backend genel response yapısı şu kavramlarla çalışır:

```text
ApiResponse<T>
ErrorResponse
ValidationError
PagedResult<T>
```

Frontend HTTP katmanı bu response formatlarını merkezi yönetmelidir.

---

## 3. Frontend Clean Architecture hedefi

Frontend de backend gibi geliştirilebilir ama değiştirilemez bir sistem olmalıdır.

Bu şu anlama gelir:

```text
Yeni feature eklemek için mevcut feature'ları bozma.
Yeni ekran eklemek için shared/core yapıyı kirletme.
Yeni API endpointi için tek bir merkezi API route/service katmanı genişlet.
Yeni state için feature store ekle; global store'u şişirme.
Yeni component eklerken business logic'i component içine yığma.
```

Önerilen klasör yapısı:

```text
src/
  app/
    core/
      auth/
      config/
      constants/
      errors/
      guards/
      http/
      interceptors/
      layout/
      logging/
      models/
      services/
      store/
    shared/
      components/
      directives/
      pipes/
      models/
      utils/
    features/
      profile/
      lookup/
      dictionary/
      decks/
      quizzes/
      statistics/
      admin-analytics/
      preferences/
      dashboard/
    styles/
  environments/
```

### 3.1 Core kuralları

`core` sadece uygulama genelinde tekil olan altyapıları tutar:

```text
Keycloak integration
Auth service/facade
HTTP client base helpers
API error handler
HTTP interceptor
Auth guard
Role guard
Environment config
Root layout services
Global UI store
```

Kurallar:

```text
core feature import etmez.
feature core import edebilir.
core shared import edebilir.
core business ekran componenti içermez.
```

### 3.2 Shared kuralları

`shared` reusable ve business bağımsız parçalardır:

```text
Button, Input, Card, Modal, Spinner, EmptyState, ErrorState, ConfirmDialog, Badge, Pagination, ProgressBar, StatCard
```

Kurallar:

```text
shared core import etmez.
shared feature import etmez.
shared Wordix business logic bilmez.
shared componentler generic olmalıdır.
```

### 3.3 Feature standardı

Her backend modülü için frontend feature modülü açılır:

```text
features/<feature-name>/
  api/
  components/
  facades/
  mappers/
  models/
  pages/
  store/
  <feature-name>.routes.ts
```

Örnek:

```text
features/dictionary/
  api/dictionary-api.service.ts
  components/dictionary-card/
  components/save-to-dictionary-button/
  facades/dictionary.facade.ts
  mappers/dictionary.mapper.ts
  models/dictionary.models.ts
  pages/dictionary-list-page/
  pages/dictionary-detail-page/
  store/dictionary.actions.ts
  store/dictionary.reducer.ts
  store/dictionary.effects.ts
  store/dictionary.selectors.ts
  dictionary.routes.ts
```

Kurallar:

```text
Feature A, Feature B'nin internal dosyalarını import etmez.
Featurelar arası veri paylaşımı gerekiyorsa shared model, route param veya facade abstraction kullanılır.
Component API çağırmaz.
Page component facade ile konuşur.
Reusable dumb component sadece @Input/@Output kullanır.
```

---

## 4. NgRx standardı

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
preferences
```

Her stateful feature için:

```text
store/<feature>.actions.ts
store/<feature>.reducer.ts
store/<feature>.selectors.ts
store/<feature>.effects.ts
store/<feature>.state.ts
facades/<feature>.facade.ts
```

Sorumluluklar:

```text
Actions: user intent ve API lifecycle eventleri.
Effects: API çağrıları, navigation, toast side effectleri.
Reducer: sadece immutable state günceller.
Selectors: UI için türetilmiş state üretir.
Facade: componentlerin NgRx detayını bilmemesini sağlar.
```

---

## 5. HTTP / API client standardı

Environment örneği:

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:5000/api',
  keycloak: {
    url: 'http://localhost:8080',
    realm: 'wordix',
    clientId: 'wordix-web',
  },
};
```

Auth interceptor tüm protected API çağrılarına şunu ekler:

```http
Authorization: Bearer <access_token>
```

Error handling merkezi olmalıdır:

```text
401 -> login/session state
403 -> forbidden page/message
400 validation -> form error mapping
404 -> not found state
500 -> generic error message
```

Backend `ApiResponse<T>` dönüyorsa frontend API service bunu merkezi şekilde unwrap edebilir. Ama endpointlerin gerçek response biçimi önce Swagger ile doğrulanmalıdır.

---

## 6. Backend feature/endpoint grupları

Aşağıdaki liste başlangıç sözleşmesidir. Gerçek route isimleri Swagger ile doğrulanmalıdır.

### 6.1 Profile

```text
GET /api/profile/me
```

Kullanım:

```text
Login sonrası current user bilgisi.
Navbar user badge.
Profile info page.
Role display.
```

### 6.2 Lookup / Smart Search

```text
POST /api/lookups
```

Request:

```ts
{
  text: string;
  sourceLanguageCode: string;
  targetLanguageCode: string;
}
```

UI:

```text
Lookup search page
Result card
Meanings list
Provider/source badge
Save to dictionary button
Sentence save flow if result is sentence translation
```

### 6.3 User Dictionary

Swagger ile doğrulanacak endpoint grubu:

```text
POST /api/user-dictionary
GET /api/user-dictionary/me
GET /api/user-dictionary/{userLearningItemId}
POST /api/user-dictionary/sentences
```

UI:

```text
Dictionary list page
Dictionary detail page
Save item modal/button
Selected meaning display
Progress badge
Search/filter/sort UI
```

### 6.4 Notes

```text
GET /api/user-dictionary/{userLearningItemId}/notes
POST /api/user-dictionary/{userLearningItemId}/notes
PUT /api/user-dictionary/notes/{noteId}
DELETE /api/user-dictionary/notes/{noteId}
```

UI:

```text
Dictionary detail içinde notes panel
Create note form
Edit note modal
Delete confirm dialog
```

### 6.5 Flags

```text
GET /api/user-dictionary/{userLearningItemId}/flags
POST /api/user-dictionary/{userLearningItemId}/flags
DELETE /api/user-dictionary/{userLearningItemId}/flags/{flagType}
```

UI:

```text
Favorite toggle
Difficult toggle
Flag badges
```

### 6.6 Decks

```text
POST /api/decks
GET /api/decks
GET /api/decks/{deckId}
POST /api/decks/{deckId}/items
DELETE /api/decks/{deckId}/items/{userLearningItemId}
```

UI:

```text
Deck list page
Create deck modal
Deck detail page
Add dictionary item to deck
Remove item from deck
Deck quiz start button
```

### 6.7 Quizzes

```text
POST /api/quizzes/start
POST /api/quizzes/{quizSessionId}/answers
GET /api/quizzes/{quizSessionId}/summary
POST /api/quizzes/recommendations/{quizRecommendationItemId}/save
```

UI:

```text
Quiz setup page
Quiz active page
Multiple choice question component
Writing question component
Question progress indicator
Answer feedback
Quiz summary page
Recommended item save panel
```

### 6.8 User Statistics

```text
GET /api/user-statistics/learning-summary
GET /api/user-statistics/quizzes
GET /api/user-statistics/difficult-items
GET /api/user-statistics/decks
GET /api/user-statistics/confidence-distribution
```

UI:

```text
Dashboard summary cards
Quiz statistics charts
Difficult items list
Deck statistics cards
Confidence distribution chart
```

### 6.9 Admin Analytics

```text
GET /api/admin/analytics/...
```

UI:

```text
Admin dashboard
Top lookups
Most saved items
Import/provider stats
Admin-only route guard
```

---

## 7. Route planı

```text
/                         -> redirect /dashboard
/auth/callback
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
/statistics/difficult-items
/admin/analytics
/profile
/settings
```

Guard kuralları:

```text
Authenticated: dashboard, lookup, dictionary, decks, quizzes, statistics, profile, settings
Admin: admin analytics
```

---

## 8. SOLID frontend karşılığı

```text
Single Responsibility: Component UI, Facade state bridge, Effect API, Service HTTP, Mapper DTO -> ViewModel.
Open/Closed: Yeni quiz tipi mevcut componentleri bozmaz; yeni renderer eklenir.
Liskov: Test/Writing question componentleri ortak question contractına uyar.
Interface Segregation: Tek devasa WordixApiService yok; feature bazlı API service var.
Dependency Inversion: Component concrete HTTP service bilmez; facade kullanır.
```

---

## 9. Codex kullanım kuralları

İlk prompt:

```text
AGENTS.md dosyasını oku. Wordix frontend projesini bu plana göre kuracağız.
Sadece Faz F0A ile başla: repository başlangıç dokümanlarını, README iskeletini, .gitignore ve temel proje notlarını hazırla.
Kod üretmeden önce yapacağın dosya listesini göster.
Faz bitince hangi dosyaları değiştirdiğini, hangi komutları çalıştırmam gerektiğini ve sonraki fazı raporla.
```

Her faz prompt formatı:

```text
AGENTS.md dosyasına göre [FAZ KODU - FAZ ADI] aşamasındayız.
Sadece bu fazı uygula.
Bu faz dışında dosya değiştirme.
Backend contract için Swagger/OpenAPI ile çelişen bir şey görürsen önce raporla.
İş bitince:
- değişen dosyaları listele
- çalıştırmam gereken komutları söyle
- build/test sonucu beklenen çıktıyı söyle
- sonraki fazı söyle
```

Codex'e asla verilmemesi gerekenler:

```text
Gerçek .env içeriği
Gerçek access token
Gerçek refresh token
Gerçek database şifresi
Gerçek API key
```

ChatGPT'ye geri dönüş formatı:

```text
Frontend Faz F6B tamamlandı.
Codex şu dosyaları değiştirdi:
- ...
Komutlar:
- npm run build başarılı
- npm test başarılı/başarısız
Sorun:
- ...
Sıradaki faza geçelim mi?
```

---

# 10. Fazlara ayrılmış frontend iş planı

## F0 — Repository ve dokümantasyon

### F0A — GitHub repository oluştur

Hedef:

```text
wordix-frontend-web repo oluşturulur.
```

Adımlar:

```text
GitHub'da yeni repo aç: wordix-frontend-web
README.md ekle
AGENTS.md ekle
.gitignore ekle
Branch stratejisi belirle: main, develop, feature/*
```

Kabul kriteri:

```text
Repo GitHub'da görünür.
AGENTS.md repo kökünde vardır.
.env dosyası yoktur.
```

Commit:

```text
chore: initialize frontend repository
```

### F0B — Plan docs iskeleti

Dosyalar:

```text
docs/FRONTEND_ARCHITECTURE.md
docs/API_CONTRACT_SNAPSHOT.md
docs/DEVELOPMENT_NOTES.md
docs/CODEX_WORKFLOW.md
docs/UI_SCREEN_PLAN.md
```

Commit:

```text
docs: add frontend planning documents
```

## F1 — Angular + Tailwind + NgRx kurulumu

### F1A — Angular app

Hedef:

```text
Angular app, routing ve strict TypeScript ile oluşur.
```

Kabul kriteri:

```text
npm install
npm run start
npm run build
```

Commit:

```text
chore: create angular application
```

### F1B — Tailwind

Dosyalar:

```text
tailwind.config.*
src/styles.css
```

Commit:

```text
chore: configure tailwind
```

### F1C — NgRx root setup

Dosyalar:

```text
src/app/core/store
src/app/app.config.ts
```

Commit:

```text
chore: configure ngrx root store
```

## F2 — Clean Frontend Architecture iskeleti

### F2A — Core/shared/features klasörleri

Dosyalar:

```text
src/app/core
src/app/shared
src/app/features
```

Commit:

```text
chore: add frontend clean architecture folders
```

### F2B — Path alias

Alias:

```text
@core/*
@shared/*
@features/*
@env/*
```

Commit:

```text
chore: configure path aliases
```

### F2C — Layout shell

Dosyalar:

```text
core/layout/app-shell
core/layout/navbar
core/layout/sidebar
core/layout/mobile-nav
```

Commit:

```text
feat: add application shell layout
```

## F3 — Environment ve HTTP altyapısı

### F3A — Environment config

Dosyalar:

```text
src/environments/environment.ts
src/environments/environment.development.ts
core/config/app-config.model.ts
core/config/app-config.service.ts
```

Commit:

```text
chore: add frontend environment config
```

### F3B — API response modelleri

Dosyalar:

```text
core/http/models/api-response.model.ts
core/http/models/error-response.model.ts
core/http/models/paged-result.model.ts
core/http/api-response.mapper.ts
```

Commit:

```text
feat: add shared api response models
```

### F3C — HTTP error handling

Dosyalar:

```text
core/errors/api-error.model.ts
core/errors/api-error.mapper.ts
core/interceptors/api-error.interceptor.ts
```

Commit:

```text
feat: add api error handling
```

### F3D — Swagger contract snapshot

Hedef:

```text
Backend Swagger/OpenAPI okunur ve docs/API_CONTRACT_SNAPSHOT.md güncellenir.
```

Commit:

```text
docs: add backend api contract snapshot
```

## F4 — Keycloak Authentication

### F4A — Keycloak client

Dosyalar:

```text
core/auth/keycloak.service.ts
core/auth/auth.models.ts
core/auth/auth.facade.ts
core/store/auth
```

Commit:

```text
feat: integrate keycloak authentication
```

### F4B — Auth interceptor

Dosya:

```text
core/interceptors/auth-token.interceptor.ts
```

Commit:

```text
feat: attach bearer token to api requests
```

### F4C — Auth/role guards

Dosyalar:

```text
core/guards/auth.guard.ts
core/guards/role.guard.ts
```

Commit:

```text
feat: add auth and role guards
```

## F5 — Profile / Me ve dashboard

### F5A — Profile API + state

Feature:

```text
features/profile
```

Endpoint:

```text
GET /api/profile/me
```

Commit:

```text
feat: add profile me integration
```

### F5B — Dashboard shell

Feature:

```text
features/dashboard
```

Commit:

```text
feat: add authenticated dashboard shell
```

## F6 — Lookup / Smart Search

### F6A — Lookup API + models

Dosyalar:

```text
features/lookup/api/lookup-api.service.ts
features/lookup/models/lookup-request.model.ts
features/lookup/models/lookup-response.model.ts
features/lookup/mappers/lookup-view.mapper.ts
```

Commit:

```text
feat: add lookup api client
```

### F6B — Lookup NgRx state

Dosyalar:

```text
features/lookup/store/lookup.actions.ts
features/lookup/store/lookup.reducer.ts
features/lookup/store/lookup.effects.ts
features/lookup/store/lookup.selectors.ts
features/lookup/facades/lookup.facade.ts
```

Commit:

```text
feat: add lookup state management
```

### F6C — Lookup UI

Componentler:

```text
lookup-search-form
lookup-result-card
lookup-meaning-list
provider-badge
save-to-dictionary-button
```

Commit:

```text
feat: add lookup search page
```

## F7 — User Dictionary

### F7A — Dictionary API + models

Feature:

```text
features/dictionary
```

Commit:

```text
feat: add dictionary api client
```

### F7B — Dictionary state

Commit:

```text
feat: add dictionary state management
```

### F7C — Dictionary list UI

Componentler:

```text
dictionary-card
dictionary-filters
progress-badge
```

Commit:

```text
feat: add dictionary list page
```

### F7D — Save to dictionary flow

Kabul kriteri:

```text
Lookup sonucundan dictionary save yapılır.
Duplicate save hatası düzgün gösterilir.
Başarılı save sonrası dictionary state güncellenir.
```

Commit:

```text
feat: add save to dictionary flow
```

### F7E — Dictionary detail UI

Commit:

```text
feat: add dictionary detail page
```

## F8 — Notes ve Flags

### F8A — Notes

Kabul kriteri:

```text
Not oluşturma, listeleme, güncelleme, silme çalışır.
```

Commit:

```text
feat: add dictionary notes
```

### F8B — Flags

Kabul kriteri:

```text
Favorite/Difficult flag ekleme ve kaldırma çalışır.
Idempotent davranış UI'da sorun çıkarmaz.
```

Commit:

```text
feat: add dictionary flags
```

## F9 — Decks

### F9A — Deck API/state

Commit:

```text
feat: add deck api and state
```

### F9B — Deck list/detail UI

Commit:

```text
feat: add deck management pages
```

### F9C — Deck item management

Commit:

```text
feat: add deck item management
```

## F10 — Quizzes

### F10A — Quiz API + models

Commit:

```text
feat: add quiz api client
```

### F10B — Quiz state

Commit:

```text
feat: add quiz state management
```

### F10C — Quiz start screen

Form alanları:

```text
quizType
quizSourceType
quizContentMode
questionCount
deckId optional
includeSystemRecommendations
```

Commit:

```text
feat: add quiz start page
```

### F10D — Active quiz screen

Componentler:

```text
question-shell
multiple-choice-question
writing-question
question-progress
answer-feedback
```

Commit:

```text
feat: add active quiz play page
```

### F10E — Quiz summary screen

Commit:

```text
feat: add quiz summary page
```

### F10F — Recommended item save

Commit:

```text
feat: add recommended item save flow
```

## F11 — Statistics dashboard

### F11A — Statistics API/state

Commit:

```text
feat: add statistics api and state
```

### F11B — Statistics UI

Componentler:

```text
learning-summary-cards
quiz-statistics-panel
confidence-distribution-chart
difficult-items-table
deck-statistics-grid
```

Commit:

```text
feat: add user statistics dashboard
```

## F12 — Admin analytics

### F12A — Admin API/state

Commit:

```text
feat: add admin analytics api and state
```

### F12B — Admin UI

Commit:

```text
feat: add admin analytics dashboard
```

## F13 — UX hardening

İşler:

```text
Global loading strategy
Toast/snackbar
Error boundary components
Forbidden page
Unauthorized redirect
Not found page
Validation error display
Skeleton loaders
Empty states
```

Commit:

```text
feat: improve frontend ux states
```

## F14 — Responsive ve accessibility

İşler:

```text
Mobile nav
Responsive cards/tables
Keyboard navigation
ARIA labels
Focus styles
Contrast check
```

Commit:

```text
feat: improve responsive and accessibility support
```

## F15 — Tests

Minimum smoke flows:

```text
Login
Profile me
Lookup
Save dictionary
Deck create
Quiz start/answer/summary
```

Commit:

```text
test: add frontend tests
```

## F16 — Docker frontend

Dosyalar:

```text
Dockerfile
nginx.conf
.dockerignore
docker-compose frontend service
```

Servis adı:

```text
wordix-web
```

Commit:

```text
chore: dockerize frontend web
```

## F17 — Final documentation

Dosyalar:

```text
README.md
docs/AUTH_KEYCLOAK_FRONTEND.md
docs/API_CONTRACT_SNAPSHOT.md
docs/FRONTEND_ARCHITECTURE.md
docs/DEVELOPMENT_NOTES.md
docs/DEPLOYMENT_NOTES.md
```

Commit:

```text
docs: add frontend final documentation
```

---

## 11. Faz takip tablosu

| Faz | Durum | Kısa açıklama |
|---|---|---|
| F0 | Beklemede | Repo + docs |
| F1 | Beklemede | Angular + Tailwind + NgRx |
| F2 | Beklemede | Clean frontend architecture |
| F3 | Beklemede | HTTP + API contract |
| F4 | Beklemede | Keycloak auth |
| F5 | Beklemede | Profile + dashboard |
| F6 | Beklemede | Lookup |
| F7 | Beklemede | Dictionary |
| F8 | Beklemede | Notes/Flags |
| F9 | Beklemede | Decks |
| F10 | Beklemede | Quizzes |
| F11 | Beklemede | Statistics |
| F12 | Beklemede | Admin analytics |
| F13 | Beklemede | UX hardening |
| F14 | Beklemede | Responsive/a11y |
| F15 | Beklemede | Tests |
| F16 | Beklemede | Docker |
| F17 | Beklemede | Final docs |

---

## 12. Her faz sonunda zorunlu rapor

Codex her faz sonunda şunları raporlamalı:

```text
Faz:
Yapılan iş:
Değişen dosyalar:
Eklenen dosyalar:
Silinen dosyalar:
Çalıştırılan komutlar:
Build sonucu:
Test sonucu:
Backend endpoint doğrulaması:
Sıradaki faz:
Risk / dikkat edilmesi gerekenler:
```

Kullanıcı bu raporu ChatGPT'ye gönderirse ChatGPT kaldığı fazı anlayıp yönlendirme yapacaktır.

---

## 13. İlk gerçek Codex görevi

Codex'e verilecek ilk uygulama promptu:

```text
AGENTS.md dosyasını oku. Wordix frontend projesinde Faz F0A aşamasındayız.
Sadece F0A'yı yap:
- GitHub repo adı wordix-frontend-web olacak.
- README.md başlangıç içeriğini hazırla.
- .gitignore hazırla.
- Kod üretme.
- Bitince değişen dosyaları ve sonraki fazı raporla.
```

---

## 14. Son amaç

Bu frontend projesinin amacı sadece çalışan ekran yapmak değildir.

Amaç:

```text
Backend sözleşmesine bağlı
Keycloak güvenliğine uyumlu
NgRx ile izlenebilir state yönetimli
Feature-based modüler
SOLID prensiplerine uygun
Geliştirilebilir ama mevcut modülleri bozmayacak
Responsive ve production'a hazırlanabilir
```

bir web uygulaması geliştirmektir.

Codex tüm geliştirmeleri bu belgeye göre yapmalıdır.
