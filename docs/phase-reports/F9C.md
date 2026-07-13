# F9C — Deck Item Management

## Tamamlananlar

- Canlı Swagger sözleşmesi yeniden kontrol edildi; `LookupResponse` içinde `userLearningItemId` bulunmadığı doğrulandı.
- Lookup sonucu için gerçek birleşik akış eklendi: deck seçimi sonrası kayıt yoksa önce Dictionary save endpointi çağrılıyor, dönen canonical `userLearningItemId` ile deck add endpointi çalıştırılıyor.
- Daha önce kaydedilmiş Lookup sonucu, sahte kimlik üretmeden gerçek Dictionary collectionında `learningItemId` veya sentence için `sentenceId` üzerinden çözülüyor.
- Dictionary detail ekranına authenticated kullanıcının gerçek deck listesini açan ve seçilen deck'e gerçek item add isteği gönderen `Add to Deck` aksiyonu eklendi.
- Deck detail ekranına itemı dictionary'den silmeden yalnızca deck ilişkisini kaldıran, onay dialoguna bağlı gerçek remove aksiyonu eklendi.
- Loading, empty, collection error/retry ve mutation error durumlarını generic biçimde yöneten reusable tekli option selection dialogu eklendi.
- Lookup ve Dictionary route providerları Deck facade/store sınırına bağlandı; componentlerden doğrudan HTTP çağrısı yapılmadı.
- Add/remove başarıları yalnızca gerçek backend mutation response state'i geldikten sonra UI state'ini kapatıyor veya güncelliyor.
- Backend desteği olmayan deck edit/delete ve quiz aksiyonları eklenmedi; Coming Soon veya demo davranışı üretilmedi.

## Değişen dosyalar

- `src/app/shared/components/option-selection-dialog/option-selection-dialog.ts`
- `src/app/shared/components/option-selection-dialog/option-selection-dialog.html`
- `src/app/shared/components/option-selection-dialog/option-selection-dialog.spec.ts`
- `src/app/features/lookup/lookup.routes.ts`
- `src/app/features/lookup/components/lookup-result-card/lookup-result-card.ts`
- `src/app/features/lookup/components/lookup-result-card/lookup-result-card.html`
- `src/app/features/lookup/components/lookup-result-card/lookup-result-card.spec.ts`
- `src/app/features/lookup/pages/lookup-page/lookup-page.ts`
- `src/app/features/lookup/pages/lookup-page/lookup-page.html`
- `src/app/features/lookup/pages/lookup-page/lookup-page.spec.ts`
- `src/app/features/dictionary/dictionary.routes.ts`
- `src/app/features/dictionary/pages/dictionary-detail-page/dictionary-detail-page.ts`
- `src/app/features/dictionary/pages/dictionary-detail-page/dictionary-detail-page.html`
- `src/app/features/dictionary/pages/dictionary-detail-page/dictionary-detail-page.spec.ts`
- `src/app/features/decks/pages/deck-detail-page/deck-detail-page.ts`
- `src/app/features/decks/pages/deck-detail-page/deck-detail-page.html`
- `src/app/features/decks/pages/deck-detail-page/deck-detail-page.spec.ts`
- `docs/phase-reports/F9C.md`

## Doğrulama

- Canlı Swagger: `LookupResponse` alanları kontrol edildi; `userLearningItemId` yok, `learningItemId` ve `sentenceId` var.
- `npm test -- --watch=false`: başarılı — 48 test dosyası, 162 test.
- `npm run build`: başarılı — Lookup, Dictionary detail ve Deck detail ayrı lazy chunklar olarak üretildi.
- `git diff --check`: whitespace hatası yok; yalnızca mevcut Windows LF/CRLF uyarıları var.
- Dependency dosyaları değişmedi; bu fazda `npm audit` yeniden çalıştırılmadı.

## Kapsam sınırı

Deck edit/delete endpointleri bulunmadığı için bu aksiyonlar eklenmedi. Deck detail üzerinden bütün Dictionary kayıtlarını tarayıp ekleme yüzeyi oluşturulmadı; kullanıcı itemı Lookup veya Dictionary detail üzerinden seçtiği deck'e ekler. Quiz start aksiyonu F10 route ve gerçek quiz backend akışı hazır olmadan gösterilmez.

## Sonraki faz

Onay sonrasında F10A — Quiz API ve modeller.
