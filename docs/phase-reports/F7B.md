# F7B — Dictionary State

## Tamamlananlar

- Dictionary koleksiyon, detay ve kayıt işlemleri için birbirinden bağımsız yüklenme, hata ve sonuç durumları tanımlandı.
- Liste yükleme, detay yükleme, word/phrase kaydetme ve sentence kaydetme aksiyonları eklendi.
- Reducer, selector, effect ve facade katmanları Clean Frontend Architecture sınırlarına uygun biçimde oluşturuldu.
- Liste ve detay isteklerinde yeni isteğin eskisini geçersiz kılması için `switchMap` kullanıldı.
- Word/phrase ve sentence kayıtlarının aynı anda yinelenmesini engellemek için ortak kayıt akışında `exhaustMap` kullanıldı.
- Backend kayıt sonucu kısmi veri döndürdüğü için dictionary listesine tahmini veya sahte item eklenmedi; yalnızca gerçek kayıt sonucu state içinde tutuldu.
- Lazy feature kullanımı için dictionary provider grubu eklendi.
- Reducer ve effect davranışları birim testleriyle kapsandı.

## Değişen dosyalar

- `src/app/features/dictionary/store/dictionary.actions.ts`
- `src/app/features/dictionary/store/dictionary.state.ts`
- `src/app/features/dictionary/store/dictionary.reducer.ts`
- `src/app/features/dictionary/store/dictionary.selectors.ts`
- `src/app/features/dictionary/store/dictionary.effects.ts`
- `src/app/features/dictionary/store/dictionary.reducer.spec.ts`
- `src/app/features/dictionary/store/dictionary.effects.spec.ts`
- `src/app/features/dictionary/facades/dictionary.facade.ts`
- `src/app/features/dictionary/dictionary.providers.ts`
- `docs/phase-reports/F7B.md`

## Doğrulama

- `npm test -- --watch=false`: başarılı — 35 test dosyası, 95 test.
- `npm run build`: başarılı — production build tamamlandı.
- `npm audit --omit=dev`: başarılı — 0 vulnerability.
- Dictionary facade/store mimari taraması: doğrudan `HttpClient` veya manuel `.subscribe()` bulunmadı.
- `git diff --check`: whitespace hatası yok; yalnızca mevcut Windows LF/CRLF uyarıları var.

## Kapsam sınırı

Bu fazda dictionary route veya UI eklenmedi. Store lazy route altında F7C ekranlarıyla birlikte bağlanacak.

## Sonraki faz

Onay sonrasında F7C — Dictionary List UI.
