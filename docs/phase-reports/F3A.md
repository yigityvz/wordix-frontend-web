# F3A Faz Raporu — Environment ve Uygulama Yapılandırması

Bu rapor, Wordix frontend'in production ve local development ortamlarında kullanacağı public runtime configuration sınırını kaydeder.

Tarih: 2026-07-11

## Faz

F3A — Environment config

## Yapılan iş

- Production environment dosyası eklendi.
- Local development environment dosyası eklendi.
- Development Angular build için production environment dosyasını development karşılığıyla değiştiren file replacement eklendi.
- `production`, `apiBaseUrl` ve public Keycloak config alanları için readonly `AppConfig` sözleşmesi eklendi.
- Aktif build environment değerlerini uygulama geneline tek noktadan sunan `AppConfigService` eklendi.
- API base URL, Keycloak realm/client ID ve client-secret bulunmaması için unit testler eklendi.
- Environment ve config kaynaklarındaki dosya, property, getter ve işlem satırları Türkçe yorumlarla açıklandı.
- Gerçek `.env`, access token, refresh token, client secret, database parolası veya API key eklenmedi.

## Bu faz proje için neden önemli?

F3A, uygulamanın servis adreslerini component veya feature dosyalarına dağıtmadan environment bazlı yönetmesini sağlar. Bu temel sayesinde F3 ve F4 kapsamındaki HTTP ve Keycloak altyapıları aynı typesafe config kaynağına bağlanabilir; local, test ve production adresleri için business kodu değiştirilmez.

Public config sözleşmesinin secret alanı içermemesi browser bundle içine hassas bilgi konulmasını mimari seviyede engeller. Merkezi service ise ileride runtime config yaklaşımına geçilmesi gerekirse featureların tek tek değiştirilmesine gerek kalmadan tek adaptasyon noktası sunar.

## Değişen dosyalar

- `angular.json`

## Eklenen dosyalar

- `src/environments/environment.ts`
- `src/environments/environment.development.ts`
- `src/app/core/config/app-config.model.ts`
- `src/app/core/config/app-config.service.ts`
- `src/app/core/config/app-config.service.spec.ts`
- `docs/phase-reports/F3A.md`

## Silinen dosyalar

Yok.

## Çalıştırılan komutlar

- `npm.cmd exec prettier -- --write ...`
- `npm.cmd run build`
- `npm.cmd run build -- --configuration development`
- `npm.cmd test -- --watch=false`
- `git diff --check`

## Build sonucu

Başarılı.

- Production build: 261.23 kB toplam ham initial bundle
- Development build: 1.37 MB sourcemap/optimization kapalı development bundle
- Development environment file replacement Angular compiler tarafından kabul edildi.

## Test sonucu

Başarılı. 8 test dosyasındaki 13 test geçti.

## Backend endpoint doğrulaması

Canlı Swagger `http://localhost:5000/swagger/v1/swagger.json` adresinde erişilebilir değildi. F3A herhangi bir endpoint, request DTO veya response DTO implementasyonu içermediğinden backend contract hakkında varsayım yapılmadı. Public local servis adresleri repository canonical dokümanlarındaki değerlerle sınırlı tutuldu.

## Ürün kararları / deferred backlog değişikliği

Yok.

## Sıradaki faz

F3B — API response modelleri ve merkezi response mapper.

## Risk / dikkat edilmesi gerekenler

- Production deploy adresleri henüz ayrıca verilmediği için canonical local servis adresleri kullanılıyor; deployment ortamı netleştiğinde yalnızca public environment değerleri güncellenmelidir.
- `angular.json` strict JSON formatıdır; yorum eklemek dosyayı bozacağı için kalıcı yorum standardının belgelenmiş istisnası olarak tutuldu.
- Browser tabanlı public client içine gelecekte de client secret eklenmemelidir.
