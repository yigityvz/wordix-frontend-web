# F7D — Save to Dictionary Flow

## Tamamlananlar

- Lookup lazy route'una dictionary state/effect/facade providerları eklendi.
- Lookup result card gerçek dictionary save lifecycle durumlarına bağlandı.
- Word/phrase sonucunda `POST /api/user-dictionary` gerçek requesti oluşturuluyor.
- Sentence sonucunda `POST /api/user-dictionary/sentences` ayrı gerçek requesti oluşturuluyor.
- Word/phrase için backendin tek `selectedMeaningId` sınırı açık seçim kontrolüyle uygulandı; bütün anlamlar kaydedilmiş gibi gösterilmedi.
- Sentence için gerçek backend çevirilerinden biri seçilerek `translatedText` request alanına aktarılıyor.
- Backend `isAlreadyInUserDictionary` alanı ve gerçek save success state'i `Saved to Dictionary` durumuna bağlandı.
- Mutation boyunca buton loading/disabled çalışıyor ve duplicate submit engelleniyor.
- Duplicate dahil normalize backend hata mesajları fake success göstermeden alert olarak sunuluyor.
- Yeni lookup veya clear işleminde önceki sonuca ait save mesajları temizleniyor.
- Eksik zorunlu lookup alanlarından tahmini request üretilmiyor; save aksiyonu açıklamayla disabled kalıyor.
- Add to Deck aksiyonu deck entegrasyonu gelmeden eklenmedi.

## Değişen dosyalar

- `src/app/features/lookup/lookup.routes.ts`
- `src/app/features/lookup/pages/lookup-page/lookup-page.ts`
- `src/app/features/lookup/pages/lookup-page/lookup-page.html`
- `src/app/features/lookup/pages/lookup-page/lookup-page.spec.ts`
- `src/app/features/lookup/components/lookup-result-card/lookup-result-card.ts`
- `src/app/features/lookup/components/lookup-result-card/lookup-result-card.html`
- `src/app/features/lookup/components/lookup-result-card/lookup-result-card.spec.ts`
- `src/app/features/lookup/components/lookup-meaning-list/lookup-meaning-list.ts`
- `src/app/features/lookup/components/lookup-meaning-list/lookup-meaning-list.html`
- `src/app/features/lookup/components/save-to-dictionary-button/save-to-dictionary-button.ts`
- `src/app/features/lookup/components/save-to-dictionary-button/save-to-dictionary-button.html`
- `src/app/features/lookup/components/save-to-dictionary-button/save-to-dictionary-button.spec.ts`
- `src/app/features/dictionary/store/dictionary.effects.spec.ts`
- `docs/phase-reports/F7D.md`

## Doğrulama

- Canlı Swagger: `SaveLearningItemRequest`, `SaveSentenceToDictionaryRequest` ve iki save response şeması yeniden doğrulandı.
- `npm test -- --watch=false`: başarılı — 37 test dosyası, 109 test.
- `npm run build`: başarılı — production build tamamlandı.
- `npm audit --omit=dev`: başarılı — 0 vulnerability.
- Production lookup UI taraması: doğrudan `HttpClient`, manuel `.subscribe()`, fake timer, mock result veya ownership alanı bulunmadı.
- `git diff --check`: whitespace hatası yok; yalnızca mevcut Windows LF/CRLF uyarıları var.

## Sözleşme sınırı

Backend hâlâ bir dictionary item için tek nullable `selectedMeaningId` kabul ediyor. Çoklu meaning desteği yayımlanana kadar UI seçili tek anlamı açıkça gösterir ve bütün anlamların ilişkilendirildiğini iddia etmez.

## Sonraki faz

Onay sonrasında F7E — Dictionary Detail UI.
