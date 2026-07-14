# Proje Biçimlendirme ve Mentor Rehberi Faz Raporu

Bu rapor, Wordix uygulama kaynaklarının okunabilirlik taramasını, environment config
sadeleştirmesini ve proje genelini açıklayan mentor rehberinin hazırlanmasını kaydeder.

## Tamamlanan işler

- `src` altındaki Angular TypeScript, HTML, CSS ve JSON dosyaları Prettier ile tarandı.
- Angular API Client Core source ve config dosyaları aynı format kontrolüne dahil edildi.
- Yorum ile property/metot aynı satırda bulunan Statistics dosyaları elle ayrıldı.
- Uzun açıklama yorumları çok satırlı dokümantasyon yorumuna dönüştürüldü.
- Login page dosyalarında önceden bulunan bozuk Türkçe karakter kodlaması düzeltildi.
- `npm run format` ve `npm run format:check` scriptleri eklendi.
- Kullanılmayan `production` booleanı iki environment dosyasından kaldırıldı.
- Aynı alan `AppConfig` sözleşmesi ve `AppConfigService` getterından kaldırıldı.
- `OnInit`, `NgIf`, `signal(30)`, Angular, TypeScript, NgRx, RxJS, HTTP ve test
  terimlerini açıklayan `docs/WORDIX_FRONTEND_MENTOR_GUIDE.md` hazırlandı.

## Okunabilirlik standardı

- Prettier hedef satır genişliği 100 karakterdir.
- Kod blokları ve dokümantasyon yorumları ayrı satırlarda tutulur.
- Tailwind class listesi, SVG pathi, URL, import yolu ve selector gibi bölünemeyen
  atomik stringler Prettier'ın güvenli çıktısı olarak korunur.
- Figma referans exportu, `dist`, `node_modules`, generated lockfile ve geçmiş faz
  dokümanları mekanik source formatlamasına dahil edilmedi.

## Değişen ana dosyalar

- `package.json`
- `.prettierrc`
- `src/environments/environment.ts`
- `src/environments/environment.development.ts`
- `src/app/core/config/app-config.model.ts`
- `src/app/core/config/app-config.service.ts`
- `src/app/features/statistics/pages/statistics-page/statistics-page.ts`
- `src/app/features/statistics/components/*/*.ts`
- `src/app/features/auth/pages/login-page/*`
- `src/app/features/dictionary/mappers/dictionary.mapper.spec.ts`
- `src/app/features/dictionary/store/dictionary.effects.spec.ts`
- `docs/WORDIX_FRONTEND_MENTOR_GUIDE.md`
- `docs/phase-reports/PROJECT-FORMATTING-AND-MENTOR-GUIDE.md`

## Doğrulama

- `npm run format:check`: başarılı.
- Sıkışık `/** yorum */ kod` kalıbı taraması: eşleşme yok.
- Source encoding artefact taraması: eşleşme yok.
- Runtime `production` boolean referansı taraması: eşleşme yok.
- Angular API Client Core testleri: 2 dosya, 8 test başarılı.
- Wordix uygulama testleri: 69 dosya, 222 test başarılı.
- Angular API Client Core build: başarılı.
- Wordix uygulama build: başarılı; initial raw bundle 426.45 kB.

## Sonuç

Uygulama davranışı değiştirilmeden source okunabilirliği standartlaştırıldı. Kullanılmayan
runtime environment booleanı kaldırıldı ve gelecekte aynı format bozulmalarını yakalamak
için tekrar çalıştırılabilir npm komutları eklendi. Mentor rehberi, repository katmanlarını
ve kodda karşılaşılabilecek temel terimleri tek kaynakta toplar.
