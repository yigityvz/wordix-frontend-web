# F6B — Lookup NgRx State

## Tamamlananlar

- Lookup search, success, failure ve clear actionları eklendi.
- `idle`, `loading`, `loaded` ve `error` lifecycle durumlarını taşıyan feature state eklendi.
- Yeni aramada eski sonucu temizleyen, requesti koruyan ve hatayı normalize eden reducer eklendi.
- Status, request, result, error, loading ve result-presence selectorları eklendi.
- Gerçek `LookupApiService` çağrısını yapan ve DTO'yu `mapLookupResult` ile dönüştüren effect eklendi.
- Yeni kullanıcı aramasında eski HTTP akışını iptal edip son aramayı esas alan `switchMap` davranışı kullanıldı.
- Componentlerin NgRx ayrıntılarını bilmesini engelleyen lookup facade eklendi.
- State, effect, API service ve facade için lazy feature provider bileşimi eklendi.
- Reducer ve effect success/failure davranışları testlerle kapsandı.

## Değişen dosyalar

- `src/app/features/lookup/store/lookup.actions.ts`
- `src/app/features/lookup/store/lookup.state.ts`
- `src/app/features/lookup/store/lookup.reducer.ts`
- `src/app/features/lookup/store/lookup.reducer.spec.ts`
- `src/app/features/lookup/store/lookup.selectors.ts`
- `src/app/features/lookup/store/lookup.effects.ts`
- `src/app/features/lookup/store/lookup.effects.spec.ts`
- `src/app/features/lookup/facades/lookup.facade.ts`
- `src/app/features/lookup/lookup.providers.ts`
- `docs/phase-reports/F6B.md`

## Doğrulama

- `npm test -- --watch=false`: başarılı — 28 test dosyası, 69 test.
- `npm run build`: başarılı — production build tamamlandı.
- `npm audit --omit=dev`: başarılı — 0 vulnerability.
- Facade/store taraması: doğrudan HTTP çağrısı veya manual subscription bulunmadı.
- `git diff --check`: whitespace hatası yok; yalnızca mevcut Windows LF/CRLF uyarıları var.

## Sınır

Bu fazda lookup route'u, sayfası veya reusable UI componentleri eklenmedi.

## Sonraki faz

Onay sonrasında F6C — Lookup UI.
