# API Client Core — Mentör Rehberi Dokümantasyonu

Bu rapor, Angular API Client Core çalışmasının teknik kararlarını ve bütün aşamalarını mentör görüşmesine hazırlanacak ayrıntıda açıklayan Türkçe rehberin hazırlanmasını kaydeder.

## Yapılan iş

- API servislerindeki başlangıç problemi ve tekrar eden kodlar açıklandı.
- Üç katmanlı `BaseApiService -> WordixApiService -> Feature API Service` mimarisi anlatıldı.
- Request ve response akışı Mermaid diyagramlarıyla gösterildi.
- Audit, library, pilot, bütün feature migrationları, açık kaynak hazırlığı ve GitHub yayını aşama aşama belgelendi.
- Genel library, Wordix adaptörü ve bağımsız repository dosyaları sorumluluklarıyla açıklandı.
- Çözülen problemler ve SOLID karşılıkları anlatıldı.
- Inheritance ile composition arasındaki trade-off açıkça belirtildi.
- GitHub repository ile npm registry package arasındaki fark açıklandı.
- Henüz yapılmayan `0.1.0`, Git tag, GitHub Release ve npm publish akışı ayrı bölümde anlatıldı.
- İki source kopyasının drift riski ve uzun vadeli source-of-truth çözümü kaydedildi.
- Bilinen sınırlamalar ve düşük seviyeli build dependency uyarısı saklanmadan açıklandı.
- Mentörün sorabileceği sorular için kısa cevaplar ve iki dakikalık sunum metni eklendi.

## Eklenen dosyalar

- `docs/API_CLIENT_CORE_MENTOR_GUIDE.md`
- `docs/phase-reports/API-CLIENT-CORE-MENTOR-GUIDE.md`

## Değişen kaynak kodu

- Yok.

## Doğrulama

- Rehber güncel Wordix ve bağımsız GitHub repository dosyaları üzerinden hazırlandı.
- Yedi feature servisinin `WordixApiService` inheritance kullanımı doğrulandı.
- Bağımsız repository package, script, CI, commit ve working-tree durumu doğrulandı.
- Markdown Prettier formatı uygulandı.

## Sonraki işlem

- Yeni teknik işlem başlatılmadı.
- npm release/publish yapılmadı.
- Kullanıcının sonraki görevi veya açık onayı beklenecek.
