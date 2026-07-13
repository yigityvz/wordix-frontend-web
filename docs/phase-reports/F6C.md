# F6C — Lookup UI

## Tamamlananlar

- `/lookup` authenticated basic-user route'u ve lazy lookup provider ağacı eklendi.
- User sidebar/mobile navigation içine yalnızca çalışan Lookup route'u eklendi.
- Erişilebilir lookup search formu, boş metin validationı, loading ve clear davranışı eklendi.
- Mevcut ürün kapsamına göre gerçek `en` → `tr` requesti facade üzerinden NgRx effect akışına bağlandı.
- Loading, recoverable API error/retry, initial ve success result durumları eklendi.
- Lookup result card, meaning/sentence translation listesi ve provider badge componentleri eklendi.
- Backend item type, source, provider, quality, language, dictionary durumu ve lisans alanları korunarak gösterildi.
- Browser Clipboard API kullanan gerçek local copy aksiyonu eklendi; clipboard başarısızlığı fake success olarak gösterilmiyor.
- Figma'daki mock recent searches, popular suggestions, fake timer ve mock sonuçlar taşınmadı.
- Dictionary/deck/quiz entegrasyonları hazır olmadığı için Save to Dictionary, Add to Deck veya Start Quiz butonları gösterilmedi.
- Light/dark semantic tokenlar ve responsive Coastal Blues tasarım dili kullanıldı.

## Değişen dosya grupları

- `src/app/features/lookup/components/lookup-search-form/*`
- `src/app/features/lookup/components/lookup-result-card/*`
- `src/app/features/lookup/components/lookup-meaning-list/*`
- `src/app/features/lookup/components/provider-badge/*`
- `src/app/features/lookup/pages/lookup-page/*`
- `src/app/features/lookup/lookup.routes.ts`
- `src/app/app.routes.ts`
- `src/app/core/layout/user-shell/user-shell.ts`
- `docs/phase-reports/F6C.md`

## Doğrulama

- `npm test -- --watch=false`: başarılı — 31 test dosyası, 78 test.
- `npm run build`: başarılı — production build tamamlandı; lookup lazy chunk üretildi.
- `npm audit --omit=dev`: başarılı — 0 vulnerability.
- Component testleri: validation/trim/clear, canonical en→tr request, result metadata, clipboard metni ve deferred mutation butonlarının bulunmaması doğrulandı.
- Tarayıcı kontrolü: unauthenticated `/lookup` isteği `/?returnUrl=%2Flookup` adresine doğru yönlendirildi; konsol hatası yoktu.
- Authenticated lookup ekranı test oturumu bulunmadığı için canlı tarayıcıda görsel olarak açılamadı; başarılı görsel kontrol olarak işaretlenmedi.
- `git diff --check`: whitespace hatası yok; yalnızca mevcut Windows LF/CRLF uyarıları var.

## Sonraki faz

Ana plana göre F7A — Dictionary API + Models.
