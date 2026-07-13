# F9B — Deck List ve Detail UI

## Tamamlananlar

- Protected `/decks` ve `/decks/:deckId` route'ları user shell altında lazy feature route olarak eklendi.
- Decks bağlantısı yalnızca gerçek route oluşturulduktan sonra user desktop/mobile navigation listesine açıldı.
- Deck list sayfası gerçek `GET /api/decks` collection lifecycle, total count, loading, error/retry ve empty state durumlarıyla eklendi.
- Backend deck summary kayıtları için light/dark uyumlu responsive deck card grid eklendi.
- Name, normalized name ve description alanlarında yalnızca yüklenmiş collection üzerinde çalışan local arama eklendi.
- Erişilebilir create dialogu gerçek `POST /api/decks` NgRx lifecycle durumuna bağlandı.
- Create formu boş deck adını engelliyor, alanları trim ediyor ve boş description değerini `null` gönderiyor.
- Başarılı backend create responseundan sonra dialog kapanıyor ve reducer tarafından collection gerçek oluşturulan deck ile güncelleniyor.
- Deck detail sayfası gerçek `GET /api/decks/{id}` lifecycle state, UUID kontrolü, retry ve route teardown temizliğiyle eklendi.
- Detail hero name, description, item count, created/updated date alanlarını yalnızca backend responseundan gösteriyor.
- Deck item listesi selected meaning veya sentence translation alanlarıyla salt-okunur kartlarda gösteriliyor; her item canonical dictionary detail route'una bağlı.
- Figma/Make referansındaki fake edit/delete, mock accuracy/last practiced, demo quiz ve local item mutation davranışları aktarılmadı.
- Backend desteği olmayan deck edit/delete aksiyonları ve F9C/F10 kapsamındaki add/remove/quiz butonları UI'a eklenmedi.

## Değişen dosyalar

- `src/app/app.routes.ts`
- `src/app/core/layout/user-shell/user-shell.ts`
- `src/app/features/decks/deck.routes.ts`
- `src/app/features/decks/components/deck-card/deck-card.ts`
- `src/app/features/decks/components/deck-card/deck-card.html`
- `src/app/features/decks/components/create-deck-dialog/create-deck-dialog.ts`
- `src/app/features/decks/components/create-deck-dialog/create-deck-dialog.html`
- `src/app/features/decks/components/create-deck-dialog/create-deck-dialog.spec.ts`
- `src/app/features/decks/components/deck-item-card/deck-item-card.ts`
- `src/app/features/decks/components/deck-item-card/deck-item-card.html`
- `src/app/features/decks/pages/deck-list-page/deck-list-page.ts`
- `src/app/features/decks/pages/deck-list-page/deck-list-page.html`
- `src/app/features/decks/pages/deck-list-page/deck-list-page.spec.ts`
- `src/app/features/decks/pages/deck-detail-page/deck-detail-page.ts`
- `src/app/features/decks/pages/deck-detail-page/deck-detail-page.html`
- `src/app/features/decks/pages/deck-detail-page/deck-detail-page.spec.ts`
- `docs/phase-reports/F9B.md`

## Doğrulama

- `npm test -- --watch=false`: başarılı — 47 test dosyası, 160 test.
- `npm run build`: başarılı — deck routes, list page ve detail page ayrı lazy chunklar olarak üretildi.
- Production deck UI taraması: component/page içinde doğrudan `HttpClient`, manuel subscription, hard-coded hex, mock/fake/Coming Soon davranışı veya unsupported edit/delete/quiz/item mutation aksiyonu bulunmadı.
- `HttpClient` yalnızca `DeckApiService` içinde bulunuyor.
- `git diff --check`: whitespace hatası yok; yalnızca mevcut Windows LF/CRLF uyarıları var.
- Dependency dosyaları değişmedi; bu fazda `npm audit` yeniden çalıştırılmadı.

## Kapsam sınırı

Deck detail bu fazda salt-okunurdur. Dictionary/Lookup içinden deck seçme, deck'e item ekleme ve detail içinden item kaldırma F9C kapsamında gerçek add/remove endpointleriyle eklenecektir. Quiz start aksiyonu F10 route ve backend akışı hazır olmadan gösterilmeyecektir.

## Sonraki faz

Onay sonrasında F9C — Deck Item Management.
