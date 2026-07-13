# F7C — Dictionary List UI

## Tamamlananlar

- `/dictionary` authenticated user route'u lazy dictionary feature providerlarıyla eklendi.
- Dictionary user navigation içine yalnızca route gerçekten açıldıktan sonra eklendi.
- Liste sayfası gerçek `GET /api/user-dictionary` lifecycle state'ine bağlandı.
- Responsive header, collection özeti, loading, recoverable error, backend-empty ve local-filter-empty durumları eklendi.
- Search, item type, favorite ve difficult filtreleri ile recent, confidence ve alphabetical sıralama local ve immutable olarak uygulandı.
- Dictionary card; seçili anlam/çeviri, item type, learning status, flags, confidence, kayıt tarihi, dil ve not sayısını gerçek response modelinden gösterir.
- Confidence değeri için erişilebilir progressbar componenti eklendi.
- Lookup route'una çalışan navigation aksiyonları eklendi.
- Dictionary route'u Keycloak oturumu olmadan açıldığında auth guard'ın login ekranına yönlendirdiği tarayıcıda doğrulandı.
- Flag mutation, Add to Deck, quiz start ve detail navigation kendi gerçek entegrasyon fazları gelmeden eklenmedi.

## Değişen dosyalar

- `src/app/app.routes.ts`
- `src/app/core/layout/user-shell/user-shell.ts`
- `src/app/features/dictionary/dictionary.routes.ts`
- `src/app/features/dictionary/components/progress-badge/progress-badge.ts`
- `src/app/features/dictionary/components/progress-badge/progress-badge.html`
- `src/app/features/dictionary/components/dictionary-filters/dictionary-filters.ts`
- `src/app/features/dictionary/components/dictionary-filters/dictionary-filters.html`
- `src/app/features/dictionary/components/dictionary-card/dictionary-card.ts`
- `src/app/features/dictionary/components/dictionary-card/dictionary-card.html`
- `src/app/features/dictionary/pages/dictionary-list-page/dictionary-list-page.ts`
- `src/app/features/dictionary/pages/dictionary-list-page/dictionary-list-page.html`
- `src/app/features/dictionary/pages/dictionary-list-page/dictionary-list-page.spec.ts`
- `docs/phase-reports/F7C.md`

## Doğrulama

- Canlı Swagger: `GET /api/user-dictionary` mevcut ve response `200/401/500` sözleşmesi doğrulandı.
- `npm test -- --watch=false`: başarılı — 36 test dosyası, 101 test.
- `npm run build`: başarılı — dictionary list page ayrı lazy chunk olarak üretildi.
- `npm audit --omit=dev`: başarılı — 0 vulnerability.
- Tarayıcı console kontrolü: error/warning yok.
- `git diff --check`: whitespace hatası yok; yalnızca mevcut Windows LF/CRLF uyarıları var.

## Kapsam sınırı

Korumalı ekran aktif kullanıcı oturumu olmadan sahte kimlikle açılmadı. Tarayıcı doğrulaması auth redirect seviyesinde, component görünüm doğrulaması ise Angular test renderı ve production build üzerinden tamamlandı.

## Sonraki faz

Onay sonrasında F7D — Save to Dictionary Flow.
