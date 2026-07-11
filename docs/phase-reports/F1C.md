# F1C Phase Report — NgRx Root Setup

Tarih: 2026-07-11

## Faz

F1C — NgRx root setup

## Yapılan iş

- Angular 22, yayımlanmış NgRx sürümüyle uyumlu olmadığı için kullanıcı onayıyla Angular 21'e indirildi.
- TypeScript, Angular 21'in desteklediği 5.9 serisine indirildi.
- NgRx Store, Effects ve Router Store paketleri eklendi.
- Standalone Angular bootstrap yapısına root NgRx provider'ları bağlandı.
- Router state, minimal serializer ile store'a bağlandı.
- Auth ve UI reducer'ları ilgili fazlarından önce sahte state oluşturmamak için eklenmedi.

## Değişen dosyalar

- `package.json`
- `package-lock.json`
- `src/app/app.config.ts`

## Eklenen dosyalar

- `src/app/core/store/root-store.providers.ts`
- `docs/phase-reports/F1C.md`

## Silinen dosyalar

Yok.

## Çalıştırılan komutlar

- `npm.cmd install ...`
- `npm.cmd exec prettier -- --write ...`
- `npm.cmd run build`
- `npm.cmd test -- --watch=false`
- `git diff --check`

## Build sonucu

Başarılı. Production bundle toplam ham boyutu 250.81 kB olarak üretildi.

## Test sonucu

Başarılı. 1 test dosyasındaki 1 test geçti.

## Backend endpoint doğrulaması

Canlı Swagger `http://localhost:5000/swagger/v1/swagger.json` adresinde erişilebilir değildi. F1C API endpointi veya DTO implementasyonu içermediğinden herhangi bir backend sözleşmesi varsayılmadı.

## Ürün kararları / deferred backlog değişikliği

Yok.

## Sıradaki faz

F1D — Theme palette ve light/dark/system altyapısı.

## Risk / dikkat edilmesi gerekenler

- Paket kurulumu 21 adet npm audit bulgusu raporladı (2 düşük, 5 orta, 14 yüksek). Otomatik `npm audit fix --force` uygulanmadı; bu komut desteklenen sürüm sınırlarını bozabilir.
- Angular ve NgRx aynı major sürümde tutulmalıdır.
