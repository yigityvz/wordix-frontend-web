# API Client Core — Açık Kaynak Paket Hazırlığı

Bu rapor, reusable Angular API Client Core library'sinin farklı projelerde anlaşılır biçimde kullanılabilmesi ve ileride ayrı GitHub repository üzerinden yayınlanabilmesi için yapılan dokümantasyon ve paket hazırlığını kaydeder.

## Faz

Detaylı public README, package metadata, MIT lisansı ve npm paket içeriği doğrulaması.

## Yapılan iş

- Public README, uluslararası Angular geliştiricileri için İngilizce ve bağımsız kullanılabilir olacak şekilde baştan yazıldı.
- README 529 satır ve yaklaşık 2.700 kelimelik uygulamalı kullanım rehberine dönüştürüldü.
- Kurulum, standalone Angular provider ayarı ve ilk feature API servisi adım adım açıklandı.
- GET, POST, PUT, PATCH ve DELETE örnekleri eklendi.
- Header, query parametresi, `HttpContext`, timeout, credentials ve transfer cache seçenekleri belgelendi.
- Authentication interceptor, merkezi error interceptor ve backend response-envelope adaptörü örnekleri eklendi.
- Angular HTTP testing kurulumu ve feature service test örneği eklendi.
- URL güvenlik sınırları, dynamic route encoding ve hassas veri kuralları açıklandı.
- Sık karşılaşılan DI, authorization, envelope ve query sorunları için troubleshooting bölümü eklendi.
- Source build, tarball üretme, temiz projeye local kurulum ve npm publish ön kontrol akışı belgelendi.
- Desteklenen public exportlar ve protected HTTP metot imzaları listelendi.
- Package açıklaması, keywordler, MIT lisansı ve public publish ayarı eklendi.
- MIT `LICENSE` dosyası eklendi.
- Package adının npm registry kontrolü yapıldı; 2026-07-14 tarihinde erişilebilir paket bulunmadı. Bu kontrol adı rezerve etmez.
- Source ve dist README SHA-256 değerlerinin aynı olduğu doğrulandı.
- `npm pack --dry-run` ile yayın paketinin yalnızca gerekli altı girdiyi içerdiği doğrulandı.

## Değişen dosyalar

- `projects/angular-api-client-core/README.md`
- `projects/angular-api-client-core/package.json`

## Eklenen dosyalar

- `projects/angular-api-client-core/LICENSE`
- `docs/phase-reports/API-CLIENT-CORE-OPEN-SOURCE-PREP.md`

## Silinen dosyalar

- Yok.

## Çalıştırılan kontroller

- `npm view angular-api-client-core name version description license --json`
- README ve package metadata için Prettier.
- `npm run test:api-core -- --watch=false`
- `npm run build:api-core`
- `npm pack --dry-run --json`
- `npm test -- --watch=false`
- `npm run build`
- Source/dist README hash karşılaştırması.

## Build sonucu

- Angular API Client Core production package buildi başarılıdır.
- Wordix uygulama production buildi başarılıdır.
- Güncel README, LICENSE ve package metadata dist paketine başarıyla taşındı.

## Test sonucu

- Library: 2 test dosyası ve 8 test başarılıdır.
- Wordix uygulaması: 69 test dosyası ve 222 test başarılıdır.

## npm paket doğrulaması

- Paket: `angular-api-client-core@0.0.1`
- Sıkıştırılmış dry-run boyutu: yaklaşık 14,6 KB.
- Açılmış boyut: yaklaşık 47,7 KB.
- Paket girdileri: `LICENSE`, `README.md`, ESM bundle, source map, `package.json` ve type declarations.
- Test, workspace config veya Wordix uygulama dosyası yayın paketine sızmadı.

## Ürün kararları / deferred backlog değişikliği

- Değişiklik yok.

## Bu faz proje için neden önemli?

Library artık yalnızca Wordix içinde çalışan bir altyapı değil; başka bir Angular geliştiricisinin kurulumdan production kullanımına ve test yazımına kadar dış desteğe ihtiyaç duymadan anlayabileceği bir package adayıdır. Backend, authentication ve business-domain bağımsızlığı README üzerinde de açık biçimde korunmuştur.

## Sıradaki faz

- Ayrı GitHub repository adı ve görünürlüğü kararlaştırılacak.
- Yeni repository oluşturulduktan sonra library kaynakları bağımsız workspace yapısına taşınacak.
- Gerçek repository URL'leri `package.json` içindeki `repository`, `homepage` ve `bugs` alanlarına eklenecek.
- Temiz clone üzerinde install, test, build ve tarball consumer smoke testi yapılacak.
- Commit/push işlemleri ayrıca kullanıcı onayıyla gerçekleştirilecek.

## Risk / dikkat edilmesi gerekenler

- Mevcut GitHub remote sahibi `yigityvz`; yeni repository owner ve adı kullanıcı tarafından kesinleştirilmelidir.
- npm registry sonucu paket adını rezerve etmez; publish anında tekrar kontrol edilmelidir.
- Package şu anda Angular `^21.2.0` peer dependency aralığını destekler; daha geniş Angular sürüm desteği test edilmeden vaat edilmemelidir.
- `repository`, `homepage` ve `bugs` URL'leri gerçek repository oluşmadan tahmin edilerek eklenmemelidir.
