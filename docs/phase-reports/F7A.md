# F7A — Dictionary API + Models

## Tamamlananlar

- Canlı Swagger user dictionary endpointleri yeniden doğrulandı.
- `GET /api/user-dictionary` liste endpointi query param olmadan eklendi.
- `GET /api/user-dictionary/{id}` canonical detail endpointi eklendi.
- `POST /api/user-dictionary` word/phrase save endpointi eklendi.
- `POST /api/user-dictionary/sentences` ayrı sentence save endpointi eklendi.
- Request, transport DTO ve normalize UI/state modelleri birbirinden ayrıldı.
- Dictionary collection, item, selected meaning, selected sentence translation ve save sonuç mapperları eklendi.
- Nullable backend liste alanı boş diziye normalize edildi.
- Flags, progress, confidence, note count, source lookup ve active state alanları kayıpsız korundu.
- Request modellerine ownership veya kullanıcı kimliği alanı eklenmedi.
- API route/method/body/unwrap ve mapper davranışları testlerle kapsandı.

## Değişen dosyalar

- `src/app/features/dictionary/api/dictionary-api.service.ts`
- `src/app/features/dictionary/api/dictionary-api.service.spec.ts`
- `src/app/features/dictionary/models/dictionary-request.models.ts`
- `src/app/features/dictionary/models/dictionary-api.models.ts`
- `src/app/features/dictionary/models/dictionary.models.ts`
- `src/app/features/dictionary/mappers/dictionary.mapper.ts`
- `src/app/features/dictionary/mappers/dictionary.mapper.spec.ts`
- `docs/phase-reports/F7A.md`

## Doğrulama

- `npm test -- --watch=false`: başarılı — 33 test dosyası, 86 test.
- `npm run build`: başarılı — production build tamamlandı.
- `npm audit --omit=dev`: başarılı — 0 vulnerability.
- Dictionary production model/API taraması: ownership alanı bulunmadı.
- `git diff --check`: whitespace hatası yok; yalnızca mevcut Windows LF/CRLF uyarıları var.

## Sözleşme sınırı

Word/phrase save requesti hâlâ tek nullable `selectedMeaningId` alanı taşıyor. Backend bütün meaningleri tek işlemle ilişkilendiren sözleşme sunmadan frontend bütün anlamlar kaydedilmiş gibi davranmayacak.

## Sonraki faz

Onay sonrasında F7B — Dictionary State.
