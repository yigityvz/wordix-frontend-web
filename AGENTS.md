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

Canonical ürün kararları ve ertelenen işler:

```text
docs/PRODUCT_DECISIONS.md
docs/DEFERRED_FEATURES.md
```

Kurallar:

```text
Figma/Make export yalnızca görsel referanstır; demo davranışları implementation kaynağı değildir.
Her ekran production'a çıkacak gerçek uygulama yaklaşımıyla geliştirilir.
Mock mutation, fake success, demo switcher ve backend desteği olmayan çalışan buton yapılmaz.
Backend desteği bekleyen özellikler uygulamada Coming Soon olarak gösterilmez.
Bu özellikler yalnızca docs/DEFERRED_FEATURES.md içinde takip edilir.
Her fazdan önce kapsam/dosya/kabul kriteri raporlanır.
Her fazdan sonra docs/phase-reports altında kısa faz raporu hazırlanır.
```

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


## Figma ZIP Visual Reference

This repository contains a Figma/Make generated React + Vite + Tailwind export under:

```text
design/figma/react-reference
```

This export is only a visual reference. Codex must not copy React code into Angular.

Before implementing UI, Codex must read:

docs/FIGMA_EXPORT_HANDOFF.md
docs/DESIGN_SYSTEM.md
docs/UI_SCREEN_INVENTORY.md
design/figma/react-reference/src/index.css
design/figma/react-reference/src/pages
design/figma/react-reference/src/components

Rules:

Rebuild UI with Angular + Tailwind + NgRx.
Preserve Clean Frontend Architecture.
Support light, dark and system theme modes.
Use one Keycloak authentication entry with sign-in and registration actions.
admin redirects to /admin/dashboard.
basic_user redirects to /dashboard.
No dead buttons.
Backend Swagger/OpenAPI is behavior source of truth.
Do not copy demo switchers, fake notifications, mock mutations or unsupported admin screens.
Admin and user applications must have separate shells and navigation.

---

## 1.1 Görsel tasarım, tema ve UI kalite standardı

Wordix frontend sadece çalışan bir arayüz olmayacak; modern, temiz, premium hissi veren bir dil öğrenme web uygulaması olacak.

Tasarım karakteri:

```text
Modern SaaS + language learning dashboard
Clean layout
Yumuşak radius
Net typography
Card-based interface
Responsive mobile-first yaklaşım
Dark mode ve light mode desteği
Coastal blues renk paleti
Aşırı kalabalık olmayan, ferah arayüz
```

Codex tasarım yaparken şu kurallara uymalıdır:

```text
Rastgele renk kullanılmayacak.
Tüm renkler Tailwind theme tokenlarından gelecek.
Dark/light mode birlikte düşünülmeden component yazılmayacak.
Her yeni component hover, focus, disabled ve loading state desteklemeli.
Formlar erişilebilir label/error/helper text yapısına sahip olmalı.
Admin panel ile kullanıcı panelinin görsel dili aynı aileden ama layoutu ayrı olmalı.
```

Zorunlu tema desteği:

```text
Light mode olacak.
Dark mode olacak.
System mode olacak ve prefers-color-scheme değişiklikleri izlenecek.
Tema toggle olacak.
Kullanıcı tercihi localStorage içinde saklanacak.
Tailwind darkMode: 'class' yaklaşımı kullanılacak.
html veya body üzerinde dark class yönetilecek.
```

Önerilen theme storage key:

```text
wordix-theme
```

Önerilen theme değerleri:

```ts
export type WordixTheme = 'light' | 'dark' | 'system';
```

Kayıtlı tercih yoksa başlangıç değeri `system` olmalıdır. `system` tercihi işletim sistemi temasını canlı izler; uygulanan görünüm yine `dark` classı üzerinden yönetilir.

### 1.1.1 Coastal Blues renk paleti

Kullanıcının seçtiği ana renk paleti Coastal Blues ailesidir. Bu palet Wordix'in ana görsel kimliğidir.

Kullanıcı tarafından verilen palette bazı anahtar adları tekrar ettiği için, Tailwind/TypeScript içinde çakışma olmaması adına renk tokenları aşağıdaki canonical isimlerle kullanılacaktır.

Tailwind `theme.extend.colors` içine eklenecek önerilen yapı:

```ts
colors: {
  'deep-space-blue': {
    DEFAULT: '#012a4a',
    100: '#00090f',
    200: '#00111e',
    300: '#011a2d',
    400: '#01233c',
    500: '#012a4a',
    600: '#025ca1',
    700: '#048df6',
    800: '#54b4fc',
    900: '#aad9fe',
  },
  'yale-blue-dark': {
    DEFAULT: '#013a63',
    100: '#000c14',
    200: '#001828',
    300: '#01243d',
    400: '#012f51',
    500: '#013a63',
    600: '#026bb6',
    700: '#0d99fd',
    800: '#5dbbfd',
    900: '#aeddfe',
  },
  'yale-blue': {
    DEFAULT: '#01497c',
    100: '#000f19',
    200: '#011e32',
    300: '#012c4c',
    400: '#013b65',
    500: '#01497c',
    600: '#0277ca',
    700: '#1c9ffd',
    800: '#68bffd',
    900: '#b3dffe',
  },
  'yale-blue-bright': {
    DEFAULT: '#014f86',
    100: '#000f1a',
    200: '#001f35',
    300: '#002e4f',
    400: '#013e6a',
    500: '#014f86',
    600: '#0179cf',
    700: '#1ea0fe',
    800: '#69c0fe',
    900: '#b4dfff',
  },
  'rich-cerulean': {
    DEFAULT: '#2a6f97',
    100: '#09161e',
    200: '#112d3c',
    300: '#1a435b',
    400: '#225979',
    500: '#2a6f97',
    600: '#3a93c7',
    700: '#6baed5',
    800: '#9cc9e3',
    900: '#cee4f1',
  },
  cerulean: {
    DEFAULT: '#2c7da0',
    100: '#091920',
    200: '#123240',
    300: '#1a4b60',
    400: '#236480',
    500: '#2c7da0',
    600: '#3fa1ca',
    700: '#6fb8d8',
    800: '#9fd0e5',
    900: '#cfe7f2',
  },
  'air-force-blue': {
    DEFAULT: '#468faf',
    100: '#0e1d23',
    200: '#1c3946',
    300: '#2a5669',
    400: '#38738c',
    500: '#468faf',
    600: '#67a7c3',
    700: '#8dbdd2',
    800: '#b3d3e1',
    900: '#d9e9f0',
  },
  'steel-blue': {
    DEFAULT: '#61a5c2',
    100: '#10222a',
    200: '#214454',
    300: '#31677e',
    400: '#4189a7',
    500: '#61a5c2',
    600: '#81b7ce',
    700: '#a0c9da',
    800: '#c0dbe6',
    900: '#dfedf3',
  },
  'sky-blue-light': {
    DEFAULT: '#89c2d9',
    100: '#112b35',
    200: '#22566a',
    300: '#34819f',
    400: '#52a6c7',
    500: '#89c2d9',
    600: '#a0cee0',
    700: '#b7dae8',
    800: '#cfe6f0',
    900: '#e7f3f7',
  },
  'light-blue': {
    DEFAULT: '#a9d6e5',
    100: '#12333d',
    200: '#25657b',
    300: '#3798b8',
    400: '#6bb9d3',
    500: '#a9d6e5',
    600: '#badeea',
    700: '#cbe6f0',
    800: '#dceff5',
    900: '#eef7fa',
  },
}
```

Semantic kullanım önerisi:

```text
Primary: yale-blue / yale-blue-bright
Dark background: deep-space-blue-500, deep-space-blue-300, yale-blue-dark-300
Light background: light-blue-900, sky-blue-light-900, white
Cards: white/dark deep-space-blue-400
Borders: steel-blue-800/light-blue-700 veya dark mode'da yale-blue-dark-400
Accent: cerulean-600, rich-cerulean-600
Charts: palette içinden sırayla seçilen tonlar
```

Codex yeni component yazarken hex değerlerini component içine gömmemelidir. Tailwind classları veya theme tokenları kullanılmalıdır.

### 1.1.2 Modern component kalite standardı

Shared UI componentleri şu kalite seviyesinde hazırlanmalıdır:

```text
Button: primary, secondary, ghost, danger, loading, disabled
Input: label, helper text, validation error
Card: light/dark uyumlu, hover state opsiyonlu
Modal/Dialog: focus trap ve escape close planı
Badge: status/role/progress/flag için reusable
Toast/Snackbar: success/error/info/warning
Skeleton/Spinner: API loading state için
EmptyState/ErrorState: liste ve sayfa hataları için
ThemeToggle: light/dark/system geçişi için
```

UI modernliği için önerilen görsel kurallar:

```text
rounded-2xl / rounded-3xl
soft shadow
subtle border
gradient hero/header alanları
responsive grid
micro interaction hover/transition
dark mode contrast kontrolü
```


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


### 2.5 Authentication, registration ve role redirect davranışı

Tek bir Keycloak authentication girişi olacaktır. Ayrı admin login ekranı yapılmayacaktır. Auth giriş yüzeyinde sign-in ve create-account aksiyonları bulunabilir; iki aksiyon da Keycloak akışını başlatır. Wordix API'ye credential gönderilmez.

Akış:

```text
Kullanıcı aynı login ekranından giriş yapar.
Frontend token rollerini okur.
Kullanıcı admin rolüne sahipse admin dashboard'a yönlendirilir.
Kullanıcı basic_user rolüne sahipse user dashboard'a yönlendirilir.
Create account aksiyonu Keycloak registration akışına gider.
```

Roller:

```text
basic_user -> /dashboard
admin      -> /admin/dashboard
```

Kullanıcı hem `admin` hem `basic_user` rolüne sahipse admin paneline yönlendirilir.

Kurallar:

```text
Admin panel ayrı feature altında kalacak.
Admin componentleri kullanıcı dashboard componentleriyle karıştırılmayacak.
Admin route'ları RoleGuard ile korunacak.
Admin API service, admin-analytics feature altında tutulacak.
Basic user route'ları admin dependency import etmeyecek.
Admin shell user navigation veya user bottom nav içermeyecek.
User/Admin demo switcher veya Back to User App yapılmayacak.
Backend endpointi olmayan admin ekranı navigation'a eklenmeyecek.
```

Admin panelin hedefi:

```text
Modern analytics dashboard
Top lookups
Most saved items
Most wrong / quiz insights
Provider statistics
Admin-only cards/charts/tables
```

Admin layout önerisi:

```text
features/admin-analytics
core/layout/admin-shell
core/layout/user-shell
```

User ve admin shell ayrımı başlangıçtan itibaren korunmalıdır. Ortak primitive componentler paylaşılabilir; navigation ve business page componentleri paylaşılmaz.


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
GET /api/user-dictionary
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
GET /api/decks/{id}
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
POST /api/quizzes
POST /api/quizzes/{quizSessionId}/answers
GET /api/quizzes/{quizSessionId}/summary
POST /api/quizzes/recommendations/{quizRecommendationItemId}/save-to-dictionary
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
/                         -> role based redirect
/auth/callback
/dashboard                 -> basic_user dashboard
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
/admin/dashboard           -> admin landing page
/admin/analytics/top-lookups
/admin/analytics/most-saved
/admin/analytics/quiz-insights
/admin/analytics/provider
/profile
/settings
```

Guard kuralları:

```text
Authenticated: dashboard, lookup, dictionary, decks, quizzes, statistics, profile, settings
Role based redirect: admin -> /admin/dashboard, basic_user -> /dashboard
Admin: admin dashboard and admin analytics
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

### F0A — Repository ve ürün kararları temeli

Hedef:

```text
wordix-frontend-web repository başlangıç dosyaları ve canonical ürün kararları hazırlanır.
```

Adımlar:

```text
README.md ekle
AGENTS.md ekle
.gitignore ekle
docs/PRODUCT_DECISIONS.md ekle
docs/DEFERRED_FEATURES.md ekle
docs/UI_SCREEN_INVENTORY.md ve docs/DESIGN_SYSTEM.md kararlarla uyumlu hale getir
docs/phase-reports/F0A.md ekle
Branch stratejisi belirle: main, develop, feature/*
```

Kabul kriteri:

```text
AGENTS.md repo kökünde vardır.
.env dosyası yoktur.
Demo davranışları canonical plandan çıkarılmıştır.
Backend desteği bekleyen özellikler ayrı backlogda tutulur.
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

### F1D — Theme palette ve light/dark/system altyapısı

Dosyalar:

```text
tailwind.config.*
src/styles.css
src/app/core/theme/theme.models.ts
src/app/core/theme/theme.service.ts
src/app/core/theme/theme.facade.ts
src/app/shared/components/theme-toggle
```

Hedef:

```text
Coastal Blues renk paleti Tailwind theme içine eklenir.
Tailwind darkMode: 'class' yapılır.
Light/dark mode toggle çalışır.
System mode prefers-color-scheme değerini canlı izler.
Tema tercihi localStorage'da wordix-theme key'iyle saklanır.
Componentlerde hard-coded hex kullanımına izin verilmez.
```

Commit:

```text
feat: add wordix theme palette and theme modes
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

### F2D — User/Admin shell ayrımı ve shared design system

Dosyalar:

```text
core/layout/user-shell
core/layout/admin-shell
shared/components/button
shared/components/card
shared/components/input
shared/components/badge
shared/components/modal
shared/components/spinner
shared/components/empty-state
shared/components/error-state
shared/components/theme-toggle
```

Hedef:

```text
Basic user ve admin aynı Keycloak login'i kullanır ama farklı dashboard/shell yapısına yönlenir.
Admin panel ayrı route/layout altında büyüyebilir.
Shared componentler dark/light mode uyumlu olur.
Modern Coastal Blues tasarım dili uygulanır.
```

Commit:

```text
feat: add user admin shells and design system base
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
add-to-deck-button
deck-selection-dialog
```

Lookup Add to Deck birleşik akıştır: item dictionary'de değilse gerçek save endpointi çağrılır, oluşan `userLearningItemId` ile seçilen deck'e eklenir. Bütün anlamları kaydetme ürün hedefidir; mevcut `selectedMeaningId` sözleşmesi değişmeden sahte çoklu-meaning davranışı uygulanmaz.

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
add-to-deck-button
deck-selection-dialog
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
Lookup sonucundan Add to Deck için save-if-needed -> deck selection -> add item sırası uygulanır.
Sentence save ayrı endpoint kullanır.
Backend tek selectedMeaningId istiyorsa bütün anlamları kaydetme destekleniyormuş gibi gösterilmez.
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

Kapsam:

```text
Create deck
List decks
Open deck detail
```

Deck edit/delete backend endpointleri gelene kadar component, button veya Coming Soon UI olarak eklenmez.

Commit:

```text
feat: add deck management pages
```

### F9C — Deck item management

Dictionary ve Lookup akışlarından kullanıcı deck seçebilir. Add/remove işlemleri gerçek backend endpointleriyle yürütülür.

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

`difficulty` backend request sözleşmesine eklenene kadar formda gösterilmez ve frontend modeline varsayımla eklenmez.

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

Kurallar:

```text
Frontend cevap doğruluğunu hesaplamaz; backend answer response gerçek referanstır.
Aktif quiz içinde normal exit/cancel aksiyonu gösterilmez.
Browser close sonrası unanswered soruların finalization davranışı backend desteği gelene kadar frontend tarafından taklit edilmez.
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

Hedef:

```text
Admin kendi Keycloak bilgileriyle aynı login ekranından giriş yapar.
RoleGuard admin rolünü doğrular.
Admin kullanıcı /admin/dashboard veya /admin/analytics ekranına yönlendirilir.
Admin panel kullanıcı dashboardından bağımsız modern analytics panel olarak tasarlanır.
```

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
| F0 | Devam ediyor | F0A tamamlandı; F0B sırada |
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
Ürün kararları / deferred backlog değişikliği:
Sıradaki faz:
Risk / dikkat edilmesi gerekenler:
```

Her faz sonunda aynı bilgi `docs/phase-reports/<FAZ>.md` altında kısa bir rapor olarak saklanır. Kullanıcı bu raporu ChatGPT'ye gönderirse ChatGPT kaldığı fazı anlayıp yönlendirme yapacaktır.

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
- Tema kararını not et: Coastal Blues palette; light, dark ve system zorunlu.
- Auth kararını not et: tek Keycloak authentication girişi ve registration aksiyonu; admin -> admin dashboard, basic_user -> user dashboard.
- Production-first kararlarını docs/PRODUCT_DECISIONS.md içinde kaydet.
- Backend desteği bekleyen işleri docs/DEFERRED_FEATURES.md içinde tut; uygulamada Coming Soon gösterme.
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
Light/dark/system mode destekli
Modern Coastal Blues tasarım sistemine sahip
Admin ve basic user panelleri role göre ayrılmış
Demo davranışlarından arındırılmış ve production-first
```

bir web uygulaması geliştirmektir.

Codex tüm geliştirmeleri bu belgeye göre yapmalıdır.
