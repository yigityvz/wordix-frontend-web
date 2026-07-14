# API Client Core — Bağımsız GitHub Repository Yayını

Bu rapor, reusable Angular API Client Core library'sinin Wordix repository'sinden bağımsız bir Angular workspace olarak hazırlanmasını, temiz consumer testinden geçirilmesini ve public GitHub repository'ye yayınlanmasını kaydeder.

## Faz

Bağımsız repository oluşturma, clean-room doğrulama, ilk commit, public push ve CI kontrolü.

## Sonuç

- Public repository: `https://github.com/yigityvz/angular-api-client-core`
- Local repository: `C:\Users\alphastellar\source\repos\angular-api-client-core`
- Default branch: `main`
- İlk commit: `eb844b3004b76ba11628c4404585ed99dc3e6e69`
- Commit mesajı: `feat: initialize angular api client core library`
- GitHub Actions CI run: `29324931582`
- CI sonucu: başarılı.

## Yapılan iş

- Angular 21.2 tabanlı, uygulama içermeyen temiz library workspace oluşturuldu.
- Reusable library source, config, test, public API, README ve MIT lisansı bağımsız workspace'e taşındı.
- Wordix feature, Keycloak, environment ve backend response bağımlılıkları yeni repository'ye taşınmadı.
- Root workspace için build, watch, test, CI test, format ve npm pack dry-run scriptleri eklendi.
- GitHub Actions üzerinde install, test, build ve npm package içerik kontrolü yapan CI workflow eklendi.
- Generated ve public library için gereksiz `.vscode/mcp` dosyaları repository'den çıkarıldı.
- `rxjs`, library doğrudan import ettiği için açık peer dependency olarak eklendi.
- Gerçek `repository`, `homepage` ve `bugs` URL'leri package metadata'ya eklendi.
- Root ve publish edilen package README'lerindeki Wordix monorepo komutları bağımsız repository scriptleriyle değiştirildi.
- GitHub CLI kuruldu ve kullanıcı hesabı `yigityvz` olarak resmi web akışıyla yetkilendirildi.
- Public repository oluşturuldu, `origin` ayarlandı ve `main` branch push edildi.

## Bağımsız doğrulamalar

- Sıfırdan `npm install` başarılıdır ve `package-lock.json` oluşturulmuştur.
- Format kontrolü başarılıdır.
- Library: 2 test dosyası ve 8 test başarılıdır.
- Production Angular package buildi başarılıdır.
- `npm pack --dry-run` başarılıdır.
- Yayın paketi yalnızca altı gerekli dosya içerir.
- Tarball geçici ve sıfırdan oluşturulan başka bir Angular 21.2 uygulamasına kurulmuştur.
- Consumer uygulama `provideApiClient` ve `BaseApiService` kullanarak production buildden başarıyla geçmiştir.
- Consumer kurulumunda güvenlik açığı raporlanmamıştır.
- Geçici consumer uygulama, tarball, staging ve publish helper dosyaları doğrulama sonrasında temizlenmiştir.

## npm audit notu

- Bağımsız library workspace geliştirme bağımlılıklarında bir düşük seviye uyarı vardır.
- Uyarı `ng-packagr@21.2.5` içindeki transitive `esbuild@0.27.7` bağımlılığına aittir.
- `npm audit fix --dry-run` uygulanabilir güvenli bir değişiklik üretmemiştir.
- Uyarı publish edilen runtime package içinde değildir; geliştirme/build aracına aittir.
- Uyumsuz dependency override uygulanmamıştır. Güncel `ng-packagr` patch sürümleri takip edilmelidir.

## Wordix repository içinde değişen dosyalar

- `projects/angular-api-client-core/package.json`
- `projects/angular-api-client-core/README.md`
- `package-lock.json`

## Wordix repository içinde eklenen dosyalar

- `docs/phase-reports/API-CLIENT-CORE-GITHUB-PUBLISH.md`

## Bağımsız repository ana dosyaları

- `.github/workflows/ci.yml`
- `README.md`
- `LICENSE`
- `package.json`
- `package-lock.json`
- `angular.json`
- `tsconfig.json`
- `projects/angular-api-client-core/**`

## Wordix build/test sonucu

- API Client Core testleri: 8/8 başarılıdır.
- Angular API Client Core package buildi başarılıdır.
- Wordix production buildi başarılıdır.

## Ürün kararları / deferred backlog değişikliği

- Değişiklik yok.

## Bu faz proje için neden önemli?

Library artık Wordix kaynak ağacına bağımlı olmayan, kendi lockfile, CI, test, build ve package doğrulamasına sahip gerçek bir açık kaynak repository'dir. Tarball'ın temiz bir Angular consumer uygulamasında build edilmesi, README'deki temel kurulum ve inheritance akışının yalnızca teorik değil gerçek kurulum koşullarında da çalıştığını doğrulamıştır.

## Sıradaki faz

- npm publish yapılmadan önce package sürümü ve ilk release stratejisi kararlaştırılmalıdır.
- Önerilen ilk public sürüm `0.1.0` olarak taglenebilir.
- npm hesabı/organization kapsamı ve paket adının publish anındaki uygunluğu yeniden doğrulanmalıdır.
- npm publish, release tag ve GitHub Release işlemleri ayrıca kullanıcı onayıyla yapılmalıdır.

## Risk / dikkat edilmesi gerekenler

- GitHub'a push yapılmış olması npm registry'ye package yayınlandığı anlamına gelmez.
- Package şu anda `0.0.1` sürümündedir.
- Angular peer dependency desteği `^21.2.0`, RxJS desteği `^7.8.0` ile sınırlıdır.
- Daha geniş Angular sürüm aralığı consumer matrisiyle test edilmeden package metadata genişletilmemelidir.
