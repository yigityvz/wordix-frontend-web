# Angular API Client Core npm 1.0.0 Yayını

Bu rapor, Wordix içinde geliştirilen reusable Angular API client yapısının bağımsız GitHub repository ve public npm paketi olarak yayımlanmasını kaydeder.

## Yapılanlar

- Public paket adı `angular-api-client-core` olarak doğrulandı.
- İlk kararlı public sürüm `1.0.0` olarak hazırlandı.
- Paket metadata, repository, homepage, issue tracker, MIT lisansı ve public export yüzeyi kontrol edildi.
- Ayrıntılı README içindeki kurulum, kullanım, authentication, error handling, test ve mimari açıklamaları doğrulandı.
- Library ve test TypeScript yapılandırmalarında `rootDir` açıkça tanımlandı.
- Bağımsız repository release commit'i GitHub `main` branch'ine gönderildi.
- Paket npm registry'ye public olarak yayımlandı.

## Doğrulama

- Prettier format kontrolü başarılı.
- İki test dosyasında sekiz unit test başarılı.
- Angular production library build başarılı.
- `angular-api-client-core-1.0.0.tgz` tarball'ı başarıyla üretildi.
- Tarball yalnızca derlenmiş modül, type declaration, README, lisans ve package metadata içeriyor.
- Tarball temiz bir Angular consumer projesine kuruldu.
- Consumer projede `BaseApiService` inheritance ve `provideApiClient` kullanımı TypeScript type-check işleminden geçti.
- npm registry paketi `latest: 1.0.0` olarak döndürüyor.
- GitHub local ve remote `main` commit değerleri eşleşiyor.

## Yayın bağlantıları

- npm: <https://www.npmjs.com/package/angular-api-client-core>
- GitHub: <https://github.com/yigityvz/angular-api-client-core>

## Güvenlik

- npm parolası, 2FA kodu, recovery code veya authentication token repository dosyalarına yazılmadı.
- Kimlik doğrulama kullanıcı tarafından npm'in güvenli web ve CLI akışında tamamlandı.
- Public pakette environment dosyası, credential veya uygulamaya özel secret bulunmuyor.
