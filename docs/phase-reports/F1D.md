# F1D Phase Report — Wordix Theme Foundation

Tarih: 2026-07-11

## Faz

F1D — Theme palette ve light/dark/system altyapısı

## Yapılan iş

- Coastal Blues paletinin canonical 100–900 tonları Tailwind 4 theme tokenları olarak eklendi.
- Light ve dark görünüm için semantic background, surface, border, text, accent ve focus tokenları eklendi.
- Tailwind dark variantı `html.dark` classını izleyecek şekilde tanımlandı.
- `light`, `dark` ve `system` tercihlerini yöneten theme service ve facade eklendi.
- Varsayılan tercih `system`, storage key `wordix-theme` olarak uygulandı.
- System tercihi için `prefers-color-scheme` değişiklikleri canlı izlenir hale getirildi.
- Tema bootstrap sırasında application initializer ile başlatıldı.
- Shared katmanın core bağımlılığı oluşturmaması için yalnızca input/output kullanan erişilebilir theme toggle eklendi.
- Tema servisi ve toggle davranışı için unit testler eklendi.

## Değişen dosyalar

- `src/styles.css`
- `src/app/app.config.ts`

## Eklenen dosyalar

- `src/app/core/theme/theme.models.ts`
- `src/app/core/theme/theme.service.ts`
- `src/app/core/theme/theme.service.spec.ts`
- `src/app/core/theme/theme.facade.ts`
- `src/app/shared/components/theme-toggle/theme-toggle.ts`
- `src/app/shared/components/theme-toggle/theme-toggle.html`
- `src/app/shared/components/theme-toggle/theme-toggle.spec.ts`
- `docs/phase-reports/F1D.md`

## Silinen dosyalar

Yok.

## Çalıştırılan komutlar

- `npm.cmd exec prettier -- --write ...`
- `npm.cmd run build`
- `npm.cmd test -- --watch=false`
- `git diff --check`

## Build sonucu

Başarılı. Production bundle toplam ham boyutu 253.75 kB olarak üretildi.

## Test sonucu

Başarılı. 3 test dosyasındaki 5 test geçti.

## Backend endpoint doğrulaması

F1D backend endpointi veya DTO implementasyonu içermez. F1C başında canlı Swagger erişilemez durumdaydı; backend sözleşmesi hakkında varsayım yapılmadı.

## Ürün kararları / deferred backlog değişikliği

Yok.

## Sıradaki faz

F2A — Core/shared/features klasörleri.

## Risk / dikkat edilmesi gerekenler

- Proje Tailwind 4 kullandığı için palette ayrı bir JavaScript config yerine resmi CSS-first `@theme` tokenlarıyla tanımlandı.
- Theme toggle ilgili shell/auth yüzeyi oluşturulduğunda `ThemeFacade` tarafından beslenecektir; mevcut root placeholder UI değiştirilmedi.
