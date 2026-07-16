# Wordix UI Screen Plan

Tarih: 2026-07-10

Bu plan production uygulamasının route, rol, data ve UI state sınırlarını tanımlar.

## Global layout

### Public/auth layout

- Sidebar veya authenticated topbar içermez.
- Wordix brand, authentication card ve theme control içerir.
- Responsive olarak tek kolon çalışır.

### User shell

- Desktop user sidebar
- User topbar
- Mobile user bottom navigation
- User feature route outlet
- Admin navigation içermez

### Admin shell

- Ayrı admin sidebar/topbar
- Admin role badge ve analytics navigation
- Mobile admin navigation ayrıca tasarlanır
- User bottom navigation, global user lookup veya Back to User App içermez

## Route matrix

| Route                             | Rol             | Shell | Ana data kaynağı                         |
| --------------------------------- | --------------- | ----- | ---------------------------------------- |
| `/`                               | Public          | Auth  | Keycloak actions                         |
| `/auth/callback`                  | Public callback | Auth  | Keycloak + `/api/profile/me`             |
| `/dashboard`                      | `basic_user`    | User  | Learning summary + dictionary/statistics |
| `/lookup`                         | Authenticated   | User  | `/api/lookups`                           |
| `/dictionary`                     | Authenticated   | User  | `/api/user-dictionary`                   |
| `/dictionary/:userLearningItemId` | Authenticated   | User  | Dictionary detail, notes, flags          |
| `/decks`                          | Authenticated   | User  | `/api/decks`                             |
| `/decks/:deckId`                  | Authenticated   | User  | `/api/decks/{id}`                        |
| `/quizzes/start`                  | Authenticated   | User  | Quiz config + decks when needed          |
| `/quizzes/:quizSessionId/play`    | Authenticated   | User  | Quiz session + answer endpoint           |
| `/quizzes/:quizSessionId/summary` | Authenticated   | User  | Quiz summary endpoint                    |
| `/statistics`                     | Authenticated   | User  | User statistics endpoints                |
| `/profile`                        | Authenticated   | User  | `/api/profile/me`                        |
| `/settings`                       | Authenticated   | User  | Browser-local theme                      |
| `/admin/dashboard`                | `admin`         | Admin | Admin dashboard analytics                |
| `/admin/analytics/top-lookups`    | `admin`         | Admin | Admin top searches                       |
| `/admin/analytics/most-saved`     | `admin`         | Admin | Admin top saved                          |
| `/admin/analytics/quiz-insights`  | `admin`         | Admin | Admin most wrong                         |
| `/admin/analytics/provider`       | `admin`         | Admin | Admin provider stats                     |

## Authentication entry

Route: `/`

Hedef görünüm:

- Premium Coastal Blues authentication background
- Wordix logo/wordmark
- Kısa ürün değeri; geniş marketing welcome hero değil
- Belirgin Sign in aksiyonu
- Belirgin Create account aksiyonu
- Light/dark/system theme control
- Keycloak güvenlik açıklaması

Davranış:

```text
Sign in       -> Keycloak login redirect
Create account -> Keycloak registration redirect
Theme          -> browser-local preference
```

Kurallar:

- Ayrı admin login yoktur.
- Username/password Wordix Angular formunda toplanmaz.
- Demo flow ve auth bypass yoktur.
- Loading ve Keycloak erişim hatası görünümü bulunur.
- Klavye ve screen-reader kullanımı desteklenir.

Önerilen Angular parçaları:

```text
auth-entry-page
auth-card
auth-brand-panel
auth-action-group
theme-toggle
```

## Auth callback

Route: `/auth/callback`

State akışı:

```text
Completing Keycloak callback
Loading current user
Resolving role
Redirecting
Recoverable error
```

Callback progress görseli gerçek async statelerden türetilir; timer ile sahte adım ilerletilmez.

## User dashboard

Route: `/dashboard`

İçerik:

- Learning summary cards
- Review-due panel
- Difficult items panel
- Recent dictionary items
- Lookup, dictionary, decks, quiz ve statistics yönlendirmeleri
- New user empty state

Welcome marketing hero ve backendde bulunmayan streak bilgisi gösterilmez.

Dashboard ayrı kalıcı store açmak yerine statistics/dictionary facadelerinden birleşik view model tüketebilir.

## Lookup

Route: `/lookup`

Componentler:

```text
lookup-search-form
language-select
lookup-result-card
lookup-meaning-list
lookup-sentence-translation
provider-badge
save-to-dictionary-button
add-to-deck-button
deck-selection-dialog
```

State:

```text
idle
validation error
searching
result
not found
API error
saving
saved/duplicate
adding to deck
```

Add to Deck birleşik akışı:

1. Sonuç zaten dictionary'deyse mevcut `userLearningItemId` kullanılır.
2. Değilse uygun word/phrase veya sentence save endpointi çağrılır.
3. Save tamamlanınca deck selection dialog açılır.
4. Seçilen deck için add-item endpointi çağrılır.
5. Kısmi hata durumunda dictionary save geri alınmış gibi gösterilmez; kullanıcıya deck ekleme hatası açıklanır.

## Dictionary list

Route: `/dictionary`

Componentler:

```text
dictionary-list-page
dictionary-search
dictionary-filters
dictionary-sort
dictionary-card
progress-badge
flag-toggle
add-to-deck-button
deck-selection-dialog
```

Search/filter/sort yüklenen liste üzerinde local olabilir. Flag ve deck mutationları facade/effect üzerinden gerçek API çağrısıdır.

Her card detail açar. Hover-only aksiyonlar mobil ve klavye kullanımında erişilebilir alternatif taşır.

## Dictionary detail

Route: `/dictionary/:userLearningItemId`

Componentler:

```text
dictionary-detail-page
dictionary-meaning-panel
learning-progress-panel
notes-panel
note-editor-dialog
delete-note-dialog
flag-toggle
deck-membership-panel
deck-selection-dialog
```

Detail, notes ve flags farklı endpoint lifecyclelarına sahip olabilir; her panel kendi loading/error stateini gösterebilir. Item quiz history endpoint gelene kadar gösterilmez.

## Decks

Routes: `/decks`, `/decks/:deckId`

List componentleri:

```text
deck-list-page
deck-card
create-deck-dialog
deck-empty-state
```

Detail componentleri:

```text
deck-detail-page
deck-summary-card
deck-item-list
add-dictionary-item-dialog
remove-deck-item-dialog
```

Desteklenen mutationlar create deck, add item ve remove itemdır. Edit/delete UI backend endpointleri gelene kadar oluşturulmaz.

## Quiz start

Route: `/quizzes/start`

Desteklenen alanlar yalnızca canlı `StartQuizRequest` sözleşmesinden gelir:

```text
quizType
quizSourceType
quizContentMode
questionCount
deckId
includeSystemRecommendations
```

Deck source seçilirse deck zorunludur. Difficulty UI gösterilmez.

## Active quiz

Route: `/quizzes/:quizSessionId/play`

Componentler:

```text
quiz-play-page
question-shell
multiple-choice-question
writing-question
question-progress
answer-submit
answer-feedback
```

Kurallar:

- Active session backend responseundan yüklenir.
- Answer bir kez submit edilir; pending sırasında inputlar kilitlenir.
- Correct/wrong sonucu backend responseundan gösterilir.
- Normal exit/cancel butonu bulunmaz.
- Browser navigation için uyarı konabilir; session finalization backend desteği olmadan taklit edilmez.

## Quiz summary

Route: `/quizzes/:quizSessionId/summary`

Summary her zaman backend endpointinden yeniden yüklenebilir olmalıdır; yalnızca navigation stateine bağlı kalmaz.

Recommendationlar per-item kaydedilir. Bulk save endpointi olmadığı için “Save all successful” davranışı varsayılmaz.

## Statistics

Route: `/statistics`

Componentler:

```text
learning-summary-cards
quiz-statistics-panel
confidence-distribution-chart
difficult-items-table
deck-statistics-grid
statistics-filters
```

Filterlar Swagger query parametrelerine çevrilir. Chartlar semantic palette kullanır ve text/table alternatifi sunar.

## Profile

Route: `/profile`

Gösterilecek bilgiler:

```text
username
email
roles
Keycloak account-management action
logout
```

Gösterilmeyecek bilgiler:

```text
keycloakUserId
access token
refresh token
raw token claims/debug panel
```

## Settings

Route: `/settings`

İlk kapsam yalnızca theme tercihidir:

```text
Light
Dark
System
```

Notification, language/region ve quiz preferences UI'ya eklenmez.

## Admin dashboard

Route: `/admin/dashboard`

Componentler:

```text
admin-dashboard-page
admin-date-filter
admin-summary-cards
provider-summary-panel
lookup-summary-panel
quiz-summary-panel
```

Kartlar yalnızca `AdminDashboardAnalyticsResponse` alanlarından türetilir. Export, import job tablosu veya fake system status gösterilmez.

## Admin analytics pages

```text
top-lookups-page   -> top-searches endpointi
most-saved-page    -> top-saved endpointi
quiz-insights-page -> most-wrong endpointi
provider-stats-page -> provider-stats endpointi
```

Date range ve limit kontrolleri endpoint querylerine bağlanır. Liste satırı detail drawer açabilir; drawer yalnızca listede gerçek olarak bulunan alanları gösterir.

Users Overview, System Health, raw provider logs, import jobs ve retry UI bulunmaz.

## Global feedback states

- Toast yalnızca gerçek işlem sonucu veya local UI sonucu için kullanılır.
- Skeleton layout shift azaltır.
- Empty state kullanıcıya geçerli bir sonraki aksiyon sunar.
- Validation error ilgili control ile ilişkilidir.
- 401 Keycloak/session akışına, 403 forbidden sayfasına gider.
- 404 feature-specific not found veya global not-found gösterir.
- Offline banner yalnızca browser network stateini bildirir; request başarısını varsaymaz.

## Responsive standardı

```text
Mobile: single column, bottom/user navigation, touch-safe actions
Tablet: adaptive grids, collapsible navigation
Desktop: sidebar + topbar + bounded content width
```

Admin mobil navigation user bottom navı yeniden kullanmaz.

## Uygulanmayacak demo davranışları

- Demo user/admin/404/500 switcher
- See demo flow
- Back to User App
- Fake notification dropdown
- Hard-coded user/admin data
- Timer ile fake auth/lookup success
- Local state ile note/deck/flag API başarısı
- Import job/log/retry ekranları
- Users Overview ve System Health mock ekranları
- Deck edit/delete
- Quiz difficulty ve exit
- Profile developer/token info
