# F7E — Dictionary Detail UI

## Tamamlananlar

- `/dictionary/:userLearningItemId` lazy detail route'u dictionary feature ağacına eklendi.
- Dictionary liste kartları canonical `userLearningItemId` ile gerçek detail route'una bağlandı.
- Detail sayfası gerçek `GET /api/user-dictionary/{id}` lifecycle state'ini kullanıyor.
- Route UUID değeri backend çağrısından önce doğrulanıyor; geçersiz adreslerden API isteği üretilmiyor.
- Loading, recoverable API error, retry ve route teardown state temizliği eklendi.
- Detail hero; item type, learning status, display text, kayıt tarihi, kaynak dil, note count ve active durumunu gerçek response alanlarından gösteriyor.
- Seçili word/phrase meaning veya sentence translation için reusable içerik paneli eklendi.
- Confidence, learning status ve mevcut flag durumları için reusable progress paneli eklendi.
- Responsive mobil/desktop grid ve light/dark semantic tema tokenları uygulandı.
- Notes, flag mutation, Add to Deck, quiz start ve quiz history kendi gerçek endpoint fazları gelmeden eklenmedi.

## Değişen dosyalar

- `src/app/features/dictionary/dictionary.routes.ts`
- `src/app/features/dictionary/pages/dictionary-list-page/dictionary-list-page.html`
- `src/app/features/dictionary/pages/dictionary-list-page/dictionary-list-page.spec.ts`
- `src/app/features/dictionary/pages/dictionary-detail-page/dictionary-detail-page.ts`
- `src/app/features/dictionary/pages/dictionary-detail-page/dictionary-detail-page.html`
- `src/app/features/dictionary/pages/dictionary-detail-page/dictionary-detail-page.spec.ts`
- `src/app/features/dictionary/components/dictionary-meaning-panel/dictionary-meaning-panel.ts`
- `src/app/features/dictionary/components/dictionary-meaning-panel/dictionary-meaning-panel.html`
- `src/app/features/dictionary/components/learning-progress-panel/learning-progress-panel.ts`
- `src/app/features/dictionary/components/learning-progress-panel/learning-progress-panel.html`
- `docs/phase-reports/F7E.md`

## Doğrulama

- Canlı Swagger: `GET /api/user-dictionary/{id}` ve `UserDictionaryItemResponse` şeması yeniden doğrulandı.
- `npm test -- --watch=false`: başarılı — 38 test dosyası, 114 test.
- `npm run build`: başarılı — detail sayfası ayrı lazy chunk olarak üretildi.
- `npm audit --omit=dev`: başarılı — 0 vulnerability.
- Production detail UI taraması: doğrudan `HttpClient`, manuel `.subscribe()`, fake/mock davranış veya ownership alanı bulunmadı.
- `git diff --check`: whitespace hatası yok; yalnızca mevcut Windows LF/CRLF uyarıları var.

## Kapsam sınırı

Detail ekranı protected olduğu ve sahte Keycloak oturumu kullanılmadığı için doğrulama Angular component render testleri ve production build üzerinden tamamlandı. Notes ve flags panelleri F8 fazında gerçek endpoint lifecyclelarıyla eklenecek.

## Sonraki faz

Onay sonrasında F8A — Notes.
