# F6A — Lookup API + Models

## Tamamlananlar

- Canlı Swagger `http://localhost:5000/swagger/v1/swagger.json` üzerinden yeniden kontrol edildi.
- Canonical lookup endpointi `POST /api/lookups` olarak doğrulandı.
- Request modeli yalnızca `text`, `sourceLanguageCode` ve `targetLanguageCode` alanlarıyla eklendi.
- `LookupResponse`, `LookupMeaningResponse` ve `LookupSentenceTranslationResponse` transport modelleri canlı sözleşmeye göre eklendi.
- Transport DTO ile UI/state görünüm modeli ayrıldı.
- Nullable meaning ve sentence translation listelerini boş dizilere normalize eden mapper eklendi.
- `ApiResponse<T>` zarfını merkezi helper ile açan feature API servisi eklendi.
- Request body içine ownership veya kullanıcı kimliği alanı eklenmedi.
- API route/body/unwrap ve mapper metadata/list normalizasyonu testlerle kapsandı.

## Değişen dosyalar

- `src/app/features/lookup/api/lookup-api.service.ts`
- `src/app/features/lookup/api/lookup-api.service.spec.ts`
- `src/app/features/lookup/models/lookup-request.model.ts`
- `src/app/features/lookup/models/lookup-api.models.ts`
- `src/app/features/lookup/models/lookup-response.model.ts`
- `src/app/features/lookup/mappers/lookup-view.mapper.ts`
- `src/app/features/lookup/mappers/lookup-view.mapper.spec.ts`
- `docs/phase-reports/F6A.md`

## Doğrulama

- `npm test -- --watch=false`: başarılı — 26 test dosyası, 63 test.
- `npm run build`: başarılı — production build tamamlandı.
- `npm audit --omit=dev`: başarılı — 0 vulnerability.
- `git diff --check`: whitespace hatası yok; yalnızca mevcut Windows LF/CRLF uyarıları var.

## Sınır

Bu fazda NgRx lookup state, facade, route veya UI eklenmedi. Bunlar sonraki fazların kapsamındadır.

## Sonraki faz

Onay sonrasında F6B — Lookup NgRx State.
