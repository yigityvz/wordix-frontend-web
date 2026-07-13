# F9A — Deck API ve State

## Tamamlananlar

- Canlı Swagger üzerinden deck create, list, detail, item add ve item remove route/DTO/response sözleşmeleri doğrulandı.
- Deck summary, detail, nested item, selected meaning, sentence translation ve mutation response transport modelleri eklendi.
- Nullable backend deck/item listelerini boş collection'a, nullable ad alanlarını güvenli UI değerlerine dönüştüren mapper katmanı eklendi.
- `GET /api/decks`, `GET /api/decks/{id}`, `POST /api/decks`, `POST /api/decks/{deckId}/items` ve `DELETE /api/decks/{deckId}/items/{userLearningItemId}` gerçek API servisine bağlandı.
- Create ve add requestleri yalnızca Swagger alanlarını kullanıyor; ownership/user kimliği alanı eklenmedi.
- Collection, detail, create ve item add/remove lifecycleları için typesafe NgRx actions, state, reducer, selectors ve effects eklendi.
- Add/remove mutationları tek effect sırasında çalışıyor; tekrar submit yarışı `exhaustMap` ile engelleniyor.
- Create başarısı mevcut collection'a sıfır itemlı gerçek deck summary kaydı ekliyor.
- Add response tam deck item içeriği döndürmediği için detail state'e sahte item eklenmiyor; collection sayacı ve gerçek mutation sonucu korunuyor.
- Remove success `removed=true` olduğunda eşleşen detail item ve item count değerleri immutable olarak güncelleniyor.
- Page ve birleşik dictionary/lookup akışları için NgRx ayrıntılarını gizleyen `DeckFacade` eklendi.
- Gelecek lazy deck route ağacı için state/effects/API/facade providerlarını birleştiren feature provider eklendi.
- Backendde bulunmayan deck edit/delete operasyonları için action, API metodu veya sahte state eklenmedi.

## Değişen dosyalar

- `src/app/features/decks/api/deck-api.service.ts`
- `src/app/features/decks/api/deck-api.service.spec.ts`
- `src/app/features/decks/models/deck-api.models.ts`
- `src/app/features/decks/models/deck-request.models.ts`
- `src/app/features/decks/models/deck.models.ts`
- `src/app/features/decks/mappers/deck.mapper.ts`
- `src/app/features/decks/mappers/deck.mapper.spec.ts`
- `src/app/features/decks/store/deck.actions.ts`
- `src/app/features/decks/store/deck.state.ts`
- `src/app/features/decks/store/deck.reducer.ts`
- `src/app/features/decks/store/deck.reducer.spec.ts`
- `src/app/features/decks/store/deck.selectors.ts`
- `src/app/features/decks/store/deck.effects.ts`
- `src/app/features/decks/store/deck.effects.spec.ts`
- `src/app/features/decks/facades/deck.facade.ts`
- `src/app/features/decks/deck.providers.ts`
- `docs/phase-reports/F9A.md`

## Doğrulama

- Canlı Swagger: beş deck endpointi ile `CreateDeckRequest`, `CreateDeckResponse`, `GetMyDecksResponse`, `DeckSummaryResponse`, `DeckDetailResponse`, `DeckItemResponse`, `AddItemToDeckRequest/Response` ve `RemoveItemFromDeckResponse` doğrulandı.
- `npm test -- --watch=false`: başarılı — 44 test dosyası, 151 test.
- `npm run build`: başarılı.
- Production deck taraması: `HttpClient` yalnızca feature API servisinde; manuel subscription, cross-feature dictionary importu, mock/fake/Coming Soon davranışı, ownership alanı veya unsupported edit/delete metodu bulunmadı.
- `git diff --check`: whitespace hatası yok; yalnızca mevcut Windows LF/CRLF uyarıları var.
- Dependency dosyaları değişmedi; bu fazda `npm audit` yeniden çalıştırılmadı.

## Kapsam sınırı

Bu fazda route veya deck UI eklenmedi. `DeckFacade` ve provider F9B sayfalarına hazırlandı. Add response yalnızca ilişki kimliklerini döndürdüğü için gelecekte detail ekranındaki add başarısından sonra gerçek detail reload uygulanmalıdır.

## Sonraki faz

Onay sonrasında F9B — Deck List ve Detail UI.
