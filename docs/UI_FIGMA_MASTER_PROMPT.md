# Wordix Frontend Web — Google Stitch Master Design Prompt

> Bu dosya `wordix-frontend-web` repository içinde önerilen konumla saklanmalıdır:
>
> ```text
> docs/UI_STITCH_MASTER_PROMPT.md
> ```
>
> Amaç: Google Stitch'e verilecek tek ve kapsamlı tasarım promptudur. Stitch'in üreteceği ekranlar Codex'in Angular + Tailwind + NgRx ile kodlayacağı frontend için görsel referans olacaktır.
>
> Bu doküman Codex için de tasarım kaynağıdır. Codex, `AGENTS.md` ile birlikte bu dosyayı okuyup UI/UX kararlarını buna göre uygulamalıdır.

---

# 1. Google Stitch'e verilecek ana prompt

Aşağıdaki promptu Google Stitch'e **tek parça** olarak ver.

```text
You are designing a complete, production-ready, premium, modern web application UI for a language learning platform named Wordix.

Design a full responsive web app prototype, not just a few isolated screens. The design must cover all user flows, all major pages, all empty/loading/error states, both light mode and dark mode, and both basic user and admin experiences.

The UI must look extremely polished, modern, elegant, memorable, and implementation-friendly. It should feel like a premium SaaS + modern learning app. It must be visually impressive enough that people would point to it as an example of a beautiful product, but it must still be realistic to implement with Angular, Tailwind CSS, NgRx, and component-based architecture.

Important: do not create decorative screens with dead buttons. Every button, menu item, tab, chip, dropdown, toggle, card action, and icon action must have a visible purpose. If the action cannot execute in a static prototype, show the intended result as another screen, modal, drawer, toast, state change, or navigation state.

The app name is Wordix.

Wordix helps users:
- Search English words, phrases, and sentences.
- See Turkish meanings/translations.
- Save items into their personal dictionary.
- Add notes and flags such as Favorite and Difficult.
- Organize saved items into decks.
- Start quizzes from dictionary, decks, difficult items, or system recommendations.
- Answer multiple-choice and writing questions.
- See quiz summary and learning progress.
- See statistics and dashboard cards.
- Admin users can view analytics and provider/import insights.

Backend facts:
- Authentication is handled by Keycloak.
- The frontend does not implement a custom username/password backend login.
- There is one entry/login experience. Users authenticate through Keycloak.
- After login, role determines destination:
  - basic_user -> user dashboard
  - admin -> admin dashboard
- Backend ownership is based on JWT token. Do not design forms that ask for userId, userProfileId, ownerId, or keycloakUserId.
- The backend API runs at http://localhost:5000/api.
- Keycloak runs at http://localhost:8080.
- Realm is wordix.
- Frontend client is wordix-web.
- Backend audience/resource is wordix-api.

Design language:
- Premium language-learning dashboard
- Dark navy and coastal blue identity
- Clean cards, soft gradients, subtle glassmorphism, high readability
- Rounded 2xl cards and buttons
- Modern SaaS sidebar + topbar layout
- Friendly but professional
- Mobile-first responsive behavior
- Smooth but not excessive animations
- No clutter, no childish design
- High contrast and accessibility-minded

Use this color palette as the core brand system.

Primary palette tokens:
- deep-space-blue: #012a4a
- yale-blue-dark: #013a63
- yale-blue: #01497c
- yale-blue-bright: #014f86
- rich-cerulean: #2a6f97
- cerulean: #2c7da0
- air-force-blue: #468faf
- steel-blue: #61a5c2
- sky-blue-light: #89c2d9
- light-blue: #a9d6e5

Full palette shades:
deep-space-blue:
  100 #00090f
  200 #00111e
  300 #011a2d
  400 #01233c
  500 #012a4a
  600 #025ca1
  700 #048df6
  800 #54b4fc
  900 #aad9fe

yale-blue-dark:
  100 #000c14
  200 #001828
  300 #01243d
  400 #012f51
  500 #013a63
  600 #026bb6
  700 #0d99fd
  800 #5dbbfd
  900 #aeddfe

yale-blue:
  100 #000f19
  200 #011e32
  300 #012c4c
  400 #013b65
  500 #01497c
  600 #0277ca
  700 #1c9ffd
  800 #68bffd
  900 #b3dffe

yale-blue-bright:
  100 #000f1a
  200 #001f35
  300 #002e4f
  400 #013e6a
  500 #014f86
  600 #0179cf
  700 #1ea0fe
  800 #69c0fe
  900 #b4dfff

rich-cerulean:
  100 #09161e
  200 #112d3c
  300 #1a435b
  400 #225979
  500 #2a6f97
  600 #3a93c7
  700 #6baed5
  800 #9cc9e3
  900 #cee4f1

cerulean:
  100 #091920
  200 #123240
  300 #1a4b60
  400 #236480
  500 #2c7da0
  600 #3fa1ca
  700 #6fb8d8
  800 #9fd0e5
  900 #cfe7f2

air-force-blue:
  100 #0e1d23
  200 #1c3946
  300 #2a5669
  400 #38738c
  500 #468faf
  600 #67a7c3
  700 #8dbdd2
  800 #b3d3e1
  900 #d9e9f0

steel-blue:
  100 #10222a
  200 #214454
  300 #31677e
  400 #4189a7
  500 #61a5c2
  600 #81b7ce
  700 #a0c9da
  800 #c0dbe6
  900 #dfedf3

sky-blue-light:
  100 #112b35
  200 #22566a
  300 #34819f
  400 #52a6c7
  500 #89c2d9
  600 #a0cee0
  700 #b7dae8
  800 #cfe6f0
  900 #e7f3f7

light-blue:
  100 #12333d
  200 #25657b
  300 #3798b8
  400 #6bb9d3
  500 #a9d6e5
  600 #badeea
  700 #cbe6f0
  800 #dceff5
  900 #eef7fa

Light theme:
- Background: very light blue/white gradient, use light-blue-900, sky-blue-light-900, white.
- Surface: white or translucent blue-white cards.
- Text: deep-space-blue-500/400.
- Primary buttons: deep-space-blue-500 to cerulean-500 gradient.
- Secondary buttons: pale blue border with deep navy text.
- Success: emerald/teal accent, but keep palette harmony.
- Warning: amber accent.
- Error: rose/red accent.
- Focus ring: cerulean-600.

Dark theme:
- Background: deep-space-blue-100/200/300 gradient.
- Surface: deep-space-blue-300/400 with subtle glass border.
- Text: light-blue-900 and sky-blue-light-800.
- Primary buttons: cerulean-600 to light-blue-500 gradient.
- Secondary buttons: transparent glass card with light border.
- Active nav: cerulean glow.
- Cards should look premium, not flat black.

Typography:
- Use a modern font feeling like Inter, Plus Jakarta Sans, or Manrope.
- Headings large, confident, clean.
- Body readable.
- Use strong hierarchy.

Visual style details:
- Sidebar: modern vertical nav with icons and labels, collapsible desktop, bottom navigation on mobile.
- Topbar: search, theme toggle, notification icon, user avatar, role badge.
- Cards: rounded-2xl, subtle shadows, blue gradient borders, clean spacing.
- Tables: modern cards/table hybrid, not old enterprise table.
- Forms: floating labels or clean labeled inputs.
- Charts: simple, readable, blue palette, not rainbow.
- Use microcopy in Turkish or English consistently. Prefer English UI labels for app screens, but allow Turkish helper microcopy only if natural. The app teaches English to Turkish users, so meanings/translations can show Turkish.

Must generate screens for both desktop and mobile where relevant.

---

SCREEN SET A — Public / Auth / Entry

1. Landing / Login Entry Page
Purpose:
- User sees Wordix brand and clicks "Continue with Keycloak".
- Do not create a backend username/password form.
- Show a premium hero: "Learn words, phrases, and sentences with adaptive quizzes."
- Show quick benefits: Smart Lookup, Personal Dictionary, Adaptive Quiz, Progress Analytics.
Actions:
- "Continue with Wordix ID" -> Keycloak login redirect.
- "See demo flow" -> preview dashboard/lookup section.
- Theme toggle -> changes light/dark mode.
- Language toggle visual only if needed.
States:
- Light mode version.
- Dark mode version.
- Mobile version.

2. Auth Callback / Loading Page
Purpose:
- After Keycloak redirect, app validates session.
UI:
- Animated Wordix logo.
- "Signing you in..."
- Skeleton progress steps: validating token, loading profile, preparing dashboard.
Actions:
- none except "Try again" error state.
States:
- Loading.
- Auth error with "Back to login".

3. Role Redirect State
Purpose:
- Show routing based on role.
UI:
- basic_user redirects to /dashboard.
- admin redirects to /admin/dashboard.
Actions:
- none, only transitional.

4. Unauthorized / Forbidden Pages
- 401 session expired page with "Sign in again".
- 403 page with "You do not have access to this area".
- Show admin-only route blocked for basic_user.

---

SCREEN SET B — User App Shell

5. User App Shell Layout
Pages under:
- /dashboard
- /lookup
- /dictionary
- /decks
- /quizzes/start
- /statistics
- /profile
- /settings

Desktop:
- Sidebar left with Wordix logo.
- Nav items: Dashboard, Lookup, Dictionary, Decks, Quiz, Statistics, Profile, Settings.
- Topbar with global search, theme toggle, notification, avatar, role badge.
- Main content area.

Mobile:
- Topbar compact.
- Bottom nav: Dashboard, Lookup, Dictionary, Quiz, Profile.
- More menu for Decks, Statistics, Settings.

Every nav item must show active state.

---

SCREEN SET C — User Dashboard

6. User Dashboard — Light and Dark
Purpose:
- First screen for basic_user.
Content:
- Welcome card with username.
- Today's learning summary.
- Saved items count.
- Due review count.
- Quiz accuracy.
- Streak / consistency card.
- Recent dictionary items.
- Difficult items preview.
- Recommended next actions.
Actions:
- "Start Review" -> Quiz start page.
- "Search New Word" -> Lookup page.
- "Open Dictionary" -> Dictionary list.
- "View Statistics" -> Statistics page.
States:
- Normal data state.
- Empty new-user state: no dictionary yet, prompt to search first word.
- Loading skeleton.

Use sample data:
- Saved items: 42
- Due review: 8
- Accuracy: 76%
- Confidence average: 63%
- Example words: achieve, struggle, improve, give up.

---

SCREEN SET D — Lookup / Smart Search

7. Lookup Page
Purpose:
- User searches word, phrase, or sentence.
Components:
- Search input card.
- Source language dropdown: English.
- Target language dropdown: Turkish.
- Search button.
- Recent searches.
- Popular suggestions chips.
Actions:
- Search button -> lookup loading -> result.
- Suggestion chip -> fills input and searches.
- Clear button -> clears input.
States:
- Empty state.
- Loading state.
- Validation error: empty text.
- Provider fallback badge when item was not in database.
- Not found state with friendly message.

8. Lookup Result — Word
Example:
- Query: "achieve"
- Type badge: Word
- Source: English
- Target: Turkish
- Meanings:
  - başarmak
  - elde etmek
- Part of speech: verb
- Provider badge / Database badge
- Lookup history id hidden from UI but implied.
Actions:
- "Save to Dictionary" -> save success state/toast.
- "Start Quiz with this" -> Quiz start prefilled.
- "Add to Deck" -> deck picker modal.
- "Copy meaning" -> copied toast.
States:
- Already saved -> button becomes "Saved" disabled or "Open in Dictionary".
- Save error duplicate -> show non-breaking friendly message.

9. Lookup Result — Phrase
Example:
- Query: "give up"
- Type badge: Phrase
- Meaning: vazgeçmek
Actions same as word.

10. Lookup Result — Sentence
Example:
- Query: "I want to improve my English."
- Translation: "İngilizcemi geliştirmek istiyorum."
Actions:
- "Save Sentence" -> sentence save flow.
- "Copy translation" -> copied toast.
- "Practice later" -> save as learning item if supported.
States:
- Sentence lookup does not automatically create permanent content until saved.

---

SCREEN SET E — Dictionary

11. Dictionary List Page
Purpose:
- User sees saved learning items.
Components:
- Header with count and quick filters.
- Search within dictionary.
- Filter chips: All, Words, Phrases, Sentences, Difficult, Favorite, Due Review.
- Sort dropdown: Recently added, Confidence low-high, Alphabetical.
- Dictionary cards.
Card content:
- Display text
- Item type badge
- Meaning/translation
- Confidence score progress
- Learning status badge
- Favorite/Difficult flags
- Next review date
Actions:
- Open detail.
- Toggle favorite.
- Toggle difficult.
- Add note.
- Add to deck.
- Start quiz with this item.
States:
- Empty dictionary.
- Loading skeleton.
- Error state.
- No filter result state.

12. Dictionary Detail Page
Purpose:
- Full item learning detail.
Sections:
- Hero word/phrase/sentence card.
- Meaning list.
- Progress panel.
- Quiz history mini timeline.
- Notes panel.
- Flags panel.
- Deck membership panel.
Actions:
- Add/edit/delete note.
- Toggle favorite/difficult.
- Add/remove from deck.
- Start quiz.
- Back to list.
States:
- Loading.
- Not found/forbidden.
- Saved success.
- Note edit modal.

13. Notes UI
Components:
- Note list.
- Create note form.
- Edit note modal.
- Delete confirmation.
Actions:
- Create.
- Update.
- Delete.
- Cancel.
No dead buttons.

14. Flags UI
Components:
- Favorite toggle.
- Difficult toggle.
- Want more practice chip if displayed.
Actions:
- Toggle on/off.
- Show immediate optimistic UI state.

---

SCREEN SET F — Decks

15. Deck List Page
Purpose:
- User manages learning collections.
Components:
- Deck cards.
- Create deck button.
- Search deck.
- Empty deck state.
Deck card:
- Deck name
- Description
- Item count
- Accuracy if available
- Last practiced
Actions:
- Open deck.
- Rename/edit.
- Delete/archive visual if supported.
- Start deck quiz.

16. Create/Edit Deck Modal
Fields:
- Name
- Description
Actions:
- Save
- Cancel
- Validation error if empty name.

17. Deck Detail Page
Sections:
- Deck header.
- Item list.
- Add item drawer.
- Deck statistics.
Actions:
- Add dictionary item.
- Remove item.
- Start quiz from deck.
- Open item detail.
States:
- Empty deck.
- Loading.
- Remove confirmation.

---

SCREEN SET G — Quizzes

18. Quiz Start Page
Purpose:
- User configures quiz.
Fields:
- Quiz Type: Test, Writing
- Source: UserDictionary, Deck, DifficultItems, SystemRecommendations
- Content Mode: WordsOnly, PhrasesOnly, SentencesOnly, Mixed
- Difficulty: Beginner, Intermediate, Hard, Mixed
- Question Count
- Deck selector if source is Deck
- Include System Recommendations toggle
Actions:
- "Start Quiz" -> active quiz screen.
- "Use defaults" -> fills settings.
- "Cancel" -> dashboard.
States:
- Validation error if deck required but missing.
- Empty dictionary warning if no items.

19. Active Quiz — Multiple Choice
Components:
- Question progress indicator.
- Question card.
- 4 option buttons.
- Timer/response time visual.
- Confidence hint.
Actions:
- Select option.
- Submit answer.
- Next question.
- Exit quiz confirmation.
States:
- Before answer.
- Correct feedback.
- Wrong feedback with correct answer.
- Already answered disabled state.
- Loading next question.

20. Active Quiz — Writing
Components:
- Text input answer.
- Submit answer.
- Correct answer feedback.
Actions:
- Type answer.
- Submit.
- Next.
States:
- Empty answer validation.
- Partial/incorrect/correct visual variants if supported.

21. Quiz Summary Page
Content:
- Accuracy
- Correct/wrong count
- Average response time
- Confidence changes
- Question-by-question review
- Recommended items panel
Actions:
- Save recommended item to dictionary.
- Retry difficult items.
- Back to dashboard.
- Start another quiz.
States:
- No answers yet.
- Loading.

22. Recommended Item Save Flow
Component:
- Recommendation card after wrong answer.
Actions:
- Save to dictionary.
- Dismiss.
- View item.
State:
- Saved success.

---

SCREEN SET H — Statistics

23. Statistics Dashboard
Sections:
- Learning summary cards.
- Quiz statistics chart.
- Confidence distribution chart.
- Difficult items table.
- Deck statistics grid.
Actions:
- Date filter.
- Quiz type filter.
- Open difficult item.
- Start quiz for difficult items.
States:
- Empty analytics.
- Loading skeleton.
- Error state.

24. Difficult Items Page
Content:
- Table/card list of difficult items.
- Filters and pagination.
Actions:
- Open item detail.
- Start focused quiz.
- Toggle difficult off.

---

SCREEN SET I — Profile and Settings

25. Profile Page
Content:
- Token profile info from /api/profile/me:
  - username
  - email
  - roles
  - keycloak id shown as developer/debug collapsed field, not main UI
Actions:
- Logout.
- Open Keycloak account page visual if supported.
- Theme toggle.

26. Settings Page
Content:
- Theme: Light / Dark / System
- Quiz preferences placeholder
- Motivation messages placeholder
- Language preferences
Actions:
- Save preferences if API exists; otherwise clearly mark as "Coming soon".
No dead buttons: if backend endpoint is not available, button must say "Coming soon" or be disabled with tooltip.

---

SCREEN SET J — Admin Panel

Admin panel is separate from user panel.

27. Admin App Shell
Purpose:
- Admin role sees admin layout after same Keycloak login.
- Different sidebar and dashboard.
Admin nav:
- Admin Dashboard
- Top Lookups
- Most Saved
- Quiz Insights
- Provider Stats
- Import Jobs
- Users Overview visual placeholder if backend not ready
- System Health
- Back to User App if admin also has basic_user role

Visual:
- More analytical, dense but still beautiful.
- Dark mode especially strong.
- Admin role badge.

28. Admin Dashboard
Cards:
- Total lookups
- Database hit rate
- Provider fallback count
- Most saved item
- Quiz completion rate
- Import jobs status
Charts:
- Top lookups
- Most saved words/phrases
- Wrong answers by item
- Provider usage trend
Actions:
- Filter date range.
- Open provider details.
- Open import jobs.
- Export button should show export modal or disabled "Coming soon" if not implemented.

29. Admin Top Lookups Page
Table/card hybrid:
- query text
- type
- count
- database hit/provider
- last searched
Actions:
- Search/filter.
- Open detail drawer.

30. Admin Provider/Import Page
Content:
- Import jobs table.
- Provider request logs.
- Cache hit ratio.
- Failed provider requests.
Actions:
- Retry failed import visual if supported.
- Open log detail.
- Refresh.

31. Admin Forbidden State
Show what basic_user sees when trying admin route.

---

SCREEN SET K — Shared System States

32. Loading States
- Global page skeleton.
- Card skeleton.
- Table skeleton.
- Button loading spinner.

33. Error States
- Inline field validation.
- API validation summary.
- 404 not found.
- 500 generic error.
- Network offline banner.

34. Empty States
- No dictionary items.
- No decks.
- No quiz history.
- No admin analytics yet.
- No difficult items.

35. Toasts / Notifications
Show design examples:
- Saved to dictionary.
- Note updated.
- Flag added.
- Quiz answer submitted.
- Session expired.
- Forbidden action.

36. Confirmation Dialogs
- Delete note.
- Remove deck item.
- Exit quiz.
- Logout.

37. Theme Toggle
- Light/dark switch in topbar.
- Show both light and dark versions of the main screens:
  - Login
  - Dashboard
  - Lookup
  - Dictionary
  - Quiz active
  - Admin dashboard

---

Implementation constraints:
- Design must be codable with Angular components and Tailwind CSS.
- Avoid impossible 3D or overly complex graphics.
- Use reusable components:
  - AppShell
  - Sidebar
  - Navbar
  - Button
  - Card
  - StatCard
  - Badge
  - ProgressBar
  - Modal
  - Drawer
  - Toast
  - EmptyState
  - ErrorState
  - Skeleton
  - DataTable
  - FilterBar
  - ThemeToggle
- Use consistent spacing and component variants.
- Do not use random colors outside the defined blue palette except semantic success/warning/error.
- Every screen must have clear responsive behavior.
- Use realistic data, not lorem ipsum.
- Make all buttons meaningful and mapped to an action/state/navigation.

Output expectations:
- Generate a complete high-fidelity screen set.
- Include light and dark mode variants.
- Include user and admin flows.
- Include desktop and mobile variants for critical pages.
- Include reusable component/design system references.
- Name screens clearly using route-like names:
  - Auth / Login
  - User / Dashboard
  - User / Lookup / Result Word
  - User / Dictionary / List
  - User / Quiz / Active Multiple Choice
  - Admin / Dashboard
  etc.
```

---

# 2. Stitch çıktısını Codex'e nasıl anlatacağız?

Stitch tasarımı ürettikten sonra Codex'e şu dosyaları proje içine koydur:

```text
docs/UI_STITCH_MASTER_PROMPT.md
docs/UI_SCREEN_INVENTORY.md
docs/DESIGN_SYSTEM.md
```

Eğer Stitch export, image link veya ekran isimleri verirse `docs/UI_SCREEN_INVENTORY.md` içine şu formatla yazılmalı:

```markdown
# UI Screen Inventory

## Auth
- Auth / Login
- Auth / Callback Loading
- Auth / Forbidden
- Auth / Unauthorized

## User
- User / Dashboard / Light
- User / Dashboard / Dark
- User / Lookup / Empty
- User / Lookup / Loading
- User / Lookup / Result Word
- User / Lookup / Result Phrase
- User / Lookup / Result Sentence
- User / Dictionary / List
- User / Dictionary / Detail
- User / Decks / List
- User / Decks / Detail
- User / Quiz / Start
- User / Quiz / Active Multiple Choice
- User / Quiz / Active Writing
- User / Quiz / Summary
- User / Statistics / Dashboard
- User / Profile
- User / Settings

## Admin
- Admin / Dashboard / Light
- Admin / Dashboard / Dark
- Admin / Top Lookups
- Admin / Provider Import
- Admin / Forbidden

## Shared States
- Loading
- Empty
- Error
- Toast
- Modal
- Drawer
- Confirm Dialog
```

---

# 3. Codex için tasarım uygulama kuralları

Bu bölüm `AGENTS.md` içine de referans olarak eklenmelidir.

Codex şu kurala uymalıdır:

```text
UI implementation source of truth:
1. AGENTS.md
2. docs/UI_STITCH_MASTER_PROMPT.md
3. docs/UI_SCREEN_INVENTORY.md
4. docs/DESIGN_SYSTEM.md
5. Backend Swagger/OpenAPI
```

Eğer Stitch tasarımı ile backend sözleşmesi çelişirse:

```text
Backend contract davranışta kazanır.
Stitch tasarımı görünümde referans alınır.
```

Örnek:

```text
Stitch bir buton tasarladı ama backend endpointi yoksa:
- Buton boş bırakılmaz.
- Ya "Coming soon" disabled state yapılır.
- Ya da mevcut backend akışına uygun hale getirilir.
```

---

# 4. Design System dokümanı için zorunlu içerik

Codex `docs/DESIGN_SYSTEM.md` dosyasını şu başlıklarla oluşturmalıdır:

```markdown
# Wordix Design System

## Brand Personality
Premium, modern, calm, intelligent, focused, trustworthy.

## Theme Modes
- Light mode
- Dark mode
- System preference

## Color Tokens
- deep-space-blue
- yale-blue-dark
- yale-blue
- yale-blue-bright
- rich-cerulean
- cerulean
- air-force-blue
- steel-blue
- sky-blue-light
- light-blue

## Semantic Tokens
- primary
- secondary
- surface
- background
- text
- muted
- border
- success
- warning
- error
- info

## Typography
- Display
- Heading
- Body
- Caption
- Label

## Component Tokens
- border radius
- shadow
- spacing
- focus ring
- card padding
- animation duration

## Components
- Button
- Card
- Badge
- ProgressBar
- Modal
- Drawer
- Toast
- Input
- Select
- DataTable
- EmptyState
- ErrorState
- Skeleton
- ThemeToggle

## Accessibility Rules
- Contrast
- Focus
- Keyboard navigation
- ARIA labels
```

---

# 5. AGENTS.md içine eklenecek kısa ek bölüm

`AGENTS.md` sonuna veya tasarım bölümüne şunu ekle:

```markdown
## UI Design Source of Truth

Before implementing visual UI, Codex must read:

```text
docs/UI_STITCH_MASTER_PROMPT.md
docs/UI_SCREEN_INVENTORY.md
docs/DESIGN_SYSTEM.md
```

The UI must support:

```text
Light mode
Dark mode
Responsive desktop/tablet/mobile layouts
Single Keycloak login
Role-based dashboard redirect:
- basic_user -> /dashboard
- admin -> /admin/dashboard
Separate admin panel layout
No dead buttons
No fake userId/keycloakUserId input fields
```

If a UI action has no backend endpoint yet, Codex must not create a fake working button. It must either:

```text
Disable it with a clear "Coming soon" label
Show a non-destructive placeholder modal
Or map it to the closest real backend-supported action
```

Backend Swagger/OpenAPI remains the behavior source of truth. Stitch is the visual source of truth.
```

---

# 6. Codex'e verilecek prompt — Stitch tasarımı sonrası

Stitch tasarımı alındıktan sonra Codex'e şunu ver:

```text
AGENTS.md ve docs/UI_STITCH_MASTER_PROMPT.md dosyalarını oku.

Google Stitch tasarımını frontend implementation visual source of truth olarak kabul ediyoruz.
Şu an Faz F1/F2 öncesi tasarım dokümantasyonu aşamasındayız.

Sadece şu işleri yap:
1. docs/UI_STITCH_MASTER_PROMPT.md dosyasını oluştur veya güncelle.
2. docs/UI_SCREEN_INVENTORY.md dosyasını oluştur.
3. docs/DESIGN_SYSTEM.md dosyasını oluştur.
4. AGENTS.md içine "UI Design Source of Truth" bölümünü ekle.
5. Kod üretme.
6. Angular component oluşturma.
7. Tailwind config değiştirme.

Amaç:
- Codex ileride UI kodlarken hangi ekranların, hangi tema sisteminin, hangi admin/user ayrımının ve hangi componentlerin uygulanacağını bilsin.

İş bitince raporla:
- Değişen dosyalar
- Eklenen dosyalar
- UI ekran listesi
- Tasarım tokenları
- Sonraki faz
```

---

# 7. Bu tasarımın kabul kriterleri

Stitch çıktısı şu kriterleri sağlamıyorsa eksik kabul edilir:

```text
Login/entry screen var.
Keycloak login mantığı görsel olarak doğru.
Light mode var.
Dark mode var.
User dashboard var.
Admin dashboard ayrı var.
Role-based redirect mantığı belirtilmiş.
Lookup ekranı var.
Word/Phrase/Sentence result varyantları var.
Dictionary list/detail var.
Notes/flags UI var.
Deck list/detail var.
Quiz start/active/summary var.
Statistics dashboard var.
Profile/settings var.
Forbidden/Unauthorized/NotFound ekranları var.
Loading/empty/error/toast/modal/drawer state'leri var.
Mobile responsive örnekleri var.
Her butonun aksiyonu belli.
Boşta çalışan sahte buton yok.
Renk paleti Coastal Blues ile uyumlu.
Angular + Tailwind ile kodlanabilir.
```

---

# 8. ChatGPT'ye geri dönüş formatı

Stitch ve Codex dokümantasyon aşaması bitince kullanıcı ChatGPT'ye şu formatta dönebilir:

```text
Frontend UI Design Docs tamamlandı.

Eklenen dosyalar:
- docs/UI_STITCH_MASTER_PROMPT.md
- docs/UI_SCREEN_INVENTORY.md
- docs/DESIGN_SYSTEM.md

AGENTS.md güncellendi.

Stitch şu ekranları üretti:
- ...

Codex henüz kod yazmadı.
Sıradaki faz F1A Angular app kurulumu.
```

Bu formatla dönüldüğünde ChatGPT hangi aşamada olunduğunu anlayacak ve F1A için doğru Codex promptunu verecektir.
