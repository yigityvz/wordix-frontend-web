# F8B — Dictionary Flags

## Tamamlananlar

- Canlı Swagger üzerinden flags listeleme, ekleme ve kaldırma route/DTO/response sözleşmeleri doğrulandı.
- Backend `UserLearningFlagType` enum ve validator kaynakları incelendi; canonical `Favorite` ve `Difficult` değerleri bu fazın UI kapsamına alındı.
- `GET /api/user-dictionary/{userLearningItemId}/flags` gerçek collection akışı dictionary detail sayfasına bağlandı.
- `POST /api/user-dictionary/{userLearningItemId}/flags` ve `DELETE /api/user-dictionary/{userLearningItemId}/flags/{flagType}` gerçek mutation akışları eklendi.
- Flags DTO, request, normalize UI model ve mapper katmanları eklendi; nullable backend listesi boş collection'a normalize edildi.
- Flags collection ve mutation lifecycleları dictionary NgRx action/reducer/effect/selector stateine bağımsız olarak eklendi.
- Idempotent set sonucu aynı flag kaydını çoğaltmıyor; set/remove başarılarından sonra detail `isFavorite` ve `isDifficult` alanları immutable güncelleniyor.
- Dictionary facade flags state ve intentlerinin componentlerden NgRx ayrıntılarını gizliyor.
- Detail ekranına light/dark uyumlu, `aria-pressed` semantiği taşıyan Favorite ve Difficult toggle paneli eklendi.
- Loading, collection error/retry, mutation error, hedef flag spinnerı ve tekrar tıklama koruması eklendi.
- State yalnızca gerçek backend success response sonrası güncelleniyor; optimistic veya sahte başarı kullanılmıyor.
- Backendde bulunan `WantMorePractice` ve `Ignored` flag tipleri bu fazın ürün kapsamı dışında olduğu için UI'a eklenmedi.

## Değişen dosyalar

- `src/app/features/dictionary/api/dictionary-api.service.ts`
- `src/app/features/dictionary/api/dictionary-api.service.spec.ts`
- `src/app/features/dictionary/models/dictionary-api.models.ts`
- `src/app/features/dictionary/models/dictionary-request.models.ts`
- `src/app/features/dictionary/models/dictionary.models.ts`
- `src/app/features/dictionary/mappers/dictionary.mapper.ts`
- `src/app/features/dictionary/store/dictionary.actions.ts`
- `src/app/features/dictionary/store/dictionary.state.ts`
- `src/app/features/dictionary/store/dictionary.reducer.ts`
- `src/app/features/dictionary/store/dictionary.reducer.spec.ts`
- `src/app/features/dictionary/store/dictionary.selectors.ts`
- `src/app/features/dictionary/store/dictionary.effects.ts`
- `src/app/features/dictionary/store/dictionary.effects.spec.ts`
- `src/app/features/dictionary/facades/dictionary.facade.ts`
- `src/app/features/dictionary/components/dictionary-flags-panel/dictionary-flags-panel.ts`
- `src/app/features/dictionary/components/dictionary-flags-panel/dictionary-flags-panel.html`
- `src/app/features/dictionary/components/dictionary-flags-panel/dictionary-flags-panel.spec.ts`
- `src/app/features/dictionary/pages/dictionary-detail-page/dictionary-detail-page.ts`
- `src/app/features/dictionary/pages/dictionary-detail-page/dictionary-detail-page.html`
- `src/app/features/dictionary/pages/dictionary-detail-page/dictionary-detail-page.spec.ts`
- `docs/phase-reports/F8B.md`

## Doğrulama

- Canlı Swagger: `GET/POST .../{userLearningItemId}/flags`, `DELETE .../{flagType}`, `SetUserLearningFlagRequest`, `GetUserLearningFlagsResponse` ve `UserLearningFlagResponse` doğrulandı.
- Backend kaynak kodu: `UserLearningFlagType`, set validator ve remove handler enum parse davranışı doğrulandı.
- `npm test -- --watch=false`: başarılı — 40 test dosyası, 135 test.
- `npm run build`: başarılı — dictionary detail ayrı lazy chunk olarak üretildi.
- Production flags UI taraması: component içinde doğrudan `HttpClient`, manuel subscription, hard-coded hex, mock/fake/Coming Soon davranışı veya kapsam dışı flag bulunmadı.
- `git diff --check`: whitespace hatası yok; yalnızca mevcut Windows LF/CRLF uyarıları var.
- Dependency dosyaları değişmedi; bu fazda `npm audit` yeniden çalıştırılmadı.

## Kapsam sınırı

Flags paneli yalnızca authenticated dictionary detail route'unda gerçek backend endpointleriyle çalışır. Sahte Keycloak oturumu, mock veri, optimistic mutation veya backenddeki diğer flag tipleri için gizli aksiyon eklenmedi.

## Sonraki faz

Onay sonrasında F9A — Deck API ve State.
