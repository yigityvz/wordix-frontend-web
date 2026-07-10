# F0A Phase Report — Repository and Product Decision Baseline

Tarih: 2026-07-10

## Faz

F0A — Repository ve ürün kararları temeli

## Yapılan iş

- Repository başlangıç README'si ve güvenli `.gitignore` eklendi.
- Main/develop/feature/codex branch stratejisi dokümante edildi.
- Production-first ürün kararları canonical belgeye işlendi.
- Light/dark/system tema gereksinimi kesinleştirildi.
- Login/register akışı Keycloak sınırlarıyla tanımlandı.
- Admin ve user alanlarının kesin ayrımı kaydedildi.
- Demo davranışları production kapsamından çıkarıldı.
- Backend desteği bekleyen özellikler ayrı backlogda toplandı.
- UI ekran envanteri gerçek route ve endpoint yaklaşımına göre güncellendi.

## Değişen dosyalar

- `AGENTS.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/UI_SCREEN_INVENTORY.md`

## Eklenen dosyalar

- `README.md`
- `.gitignore`
- `docs/PRODUCT_DECISIONS.md`
- `docs/DEFERRED_FEATURES.md`
- `docs/phase-reports/F0A.md`

## Silinen dosyalar

Yok.

## Çalıştırılan kontroller

- Repository ve mevcut dosya durumu kontrol edildi.
- İlgili doküman bölümleri `rg` ile doğrulandı.
- Son değişiklik kapsamı `git diff` ve `git status` ile doğrulandı.
- Markdown dosyalarındaki başlık ve code fence dengesi kontrol edildi.

## Build sonucu

Çalıştırılmadı. Bu fazda Angular uygulaması bulunmuyor ve uygulama kodu üretilmedi.

## Test sonucu

Çalıştırılmadı. Bu faz yalnızca dokümantasyon kapsamındadır.

## Backend endpoint doğrulaması

Audit sırasında canlı Swagger `http://localhost:5000/swagger/v1/swagger.json` üzerinden doğrulandı. Backend desteği bulunmayan kararlar `docs/DEFERRED_FEATURES.md` içine alındı.

## Sıradaki faz

F0B — Plan dokümanları iskeleti ve canonical frontend mimari dokümantasyonu.

## Riskler ve dikkat edilmesi gerekenler

- Bütün anlamlarıyla dictionary save mevcut tek `selectedMeaningId` sözleşmesiyle çelişiyor; backend kararı gerekiyor.
- Quiz browser-close finalization frontend tarafından tek başına güvenilir şekilde çözülemez; backend kuralı gerekiyor.
- Backend Swagger her API fazından önce yeniden kontrol edilmelidir.
