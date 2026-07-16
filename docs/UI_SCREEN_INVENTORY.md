# Wordix UI Screen Inventory

Bu dosya production uygulamasının canonical ekran ve aksiyon envanteridir. Demo-only ekran ve davranışlar bu envantere dahil değildir.

## Authentication Entry

Route: `/`

Actions:

- Sign in with Keycloak
- Create account with Keycloak registration
- Toggle light/dark/system theme

Rules:

- Marketing welcome hero yoktur.
- See demo flow yoktur.
- Ayrı admin login ekranı yoktur.
- Wordix API'ye credential gönderilmez.

## Auth Callback

Route: `/auth/callback`

Behavior:

- Keycloak callback'i tamamla
- `GET /api/profile/me` çağır
- `admin` -> `/admin/dashboard`
- `basic_user` -> `/dashboard`
- İki rol de varsa admin önceliklidir
- Hata durumunda kullanıcıyı güvenli şekilde authentication girişine yönlendir

## User Dashboard

Route: `/dashboard`

Actions:

- Lookup -> `/lookup`
- Dictionary -> `/dictionary`
- Decks -> `/decks`
- Quiz -> `/quizzes/start`
- Statistics -> `/statistics`

Data:

- Learning summary
- Review due items
- Difficult items
- Recent dictionary items

Not: Backend desteği gelene kadar streak veya notification verisi gösterilmez.

## Lookup

Route: `/lookup`

Backend:

```text
POST /api/lookups
POST /api/user-dictionary
POST /api/user-dictionary/sentences
POST /api/decks/{deckId}/items
```

Actions:

- Search
- Clear search
- Copy result locally
- Save word/phrase or sentence to dictionary
- Open saved dictionary item
- Add to Deck birleşik akışı: save if needed -> select deck -> add item
- Navigate to quiz setup

## Dictionary List

Route: `/dictionary`

Backend:

```text
GET /api/user-dictionary
POST /api/user-dictionary/{userLearningItemId}/flags
DELETE /api/user-dictionary/{userLearningItemId}/flags/{flagType}
POST /api/decks/{deckId}/items
```

Actions:

- Open detail
- Client-side filter/search/sort
- Select a deck and add item
- Toggle favorite/difficult
- Start quiz setup

## Dictionary Detail

Route: `/dictionary/:userLearningItemId`

Backend:

```text
GET /api/user-dictionary/{id}
GET/POST /api/user-dictionary/{userLearningItemId}/notes
PUT/DELETE /api/user-dictionary/notes/{noteId}
GET/POST /api/user-dictionary/{userLearningItemId}/flags
DELETE /api/user-dictionary/{userLearningItemId}/flags/{flagType}
POST /api/decks/{deckId}/items
```

Actions:

- Create/edit/delete note
- Toggle favorite/difficult
- Select a deck and add item
- Navigate to quiz setup

## Decks

Routes:

```text
/decks
/decks/:deckId
```

Backend:

```text
POST /api/decks
GET /api/decks
GET /api/decks/{id}
POST /api/decks/{deckId}/items
DELETE /api/decks/{deckId}/items/{userLearningItemId}
```

Actions:

- Create deck
- Open deck detail
- Add item by selecting from dictionary
- Remove item
- Start deck quiz

Not: Deck edit/delete endpointleri gelene kadar ilgili UI gösterilmez.

## Quiz

Routes:

```text
/quizzes/start
/quizzes/:quizSessionId/play
/quizzes/:quizSessionId/summary
```

Backend:

```text
POST /api/quizzes
POST /api/quizzes/{quizSessionId}/answers
GET /api/quizzes/{quizSessionId}/summary
POST /api/quizzes/recommendations/{quizRecommendationItemId}/save-to-dictionary
```

Actions:

- Configure supported quiz fields
- Start quiz
- Submit each answer to backend
- Render backend answer feedback
- View backend summary
- Save recommendation per item

Rules:

- Difficulty backend desteği gelene kadar gösterilmez.
- Aktif quiz içinde normal çıkış aksiyonu yoktur.
- Frontend doğruluk hesaplamaz.

## Statistics

Route: `/statistics`

Backend:

```text
GET /api/user-statistics/learning-summary
GET /api/user-statistics/quizzes
GET /api/user-statistics/difficult-items
GET /api/user-statistics/decks
GET /api/user-statistics/confidence-distribution
```

Actions:

- Change supported date/type filters
- Open difficult dictionary item
- Open deck detail
- Navigate to quiz setup

## Admin Dashboard

Route: `/admin/dashboard`

Role: `admin`

Backend:

```text
GET /api/admin/analytics/dashboard
```

Actions:

- Change date range
- Navigate to supported analytics screens

## Admin Analytics

Routes and endpoints:

```text
/admin/analytics/top-lookups   -> GET /api/admin/analytics/top-searches
/admin/analytics/most-saved    -> GET /api/admin/analytics/top-saved
/admin/analytics/quiz-insights -> GET /api/admin/analytics/most-wrong
/admin/analytics/provider      -> GET /api/admin/analytics/provider-stats
```

Rules:

- Admin RoleGuard zorunludur.
- Raw provider logs, import job list/retry, users overview ve system health backend sözleşmesi olmadan gösterilmez.
- Admin shell user navigation içermez.

## Profile

Route: `/profile`

Actions:

- View username, email and roles from authenticated profile
- Open Keycloak account management
- Logout through Keycloak

Rules:

- Keycloak user ID, access token veya teknik token değerleri gösterilmez.

## Settings

Route: `/settings`

Actions:

- Select light theme
- Select dark theme
- Select system theme

Not: Notification, language/region ve quiz preferences backend/ürün kararı gelene kadar gösterilmez.

## System Pages

Routes:

```text
/unauthorized
/forbidden
/not-found
/server-error
```

Global behavior:

- API ve auth hataları merkezi state/interceptor üzerinden bu durumlara yönlenir.
- Browser online/offline durumu local-only banner ile gösterilebilir.
