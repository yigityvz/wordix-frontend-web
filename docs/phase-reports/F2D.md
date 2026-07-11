# F2D Faz Raporu — User/Admin Shell Ayrımı ve Shared Design System

Bu rapor, basic user ve admin uygulama alanlarının ayrı route sahipleri haline getirilmesini ve feature ekranlarının kullanacağı business-bağımsız UI temelini kaydeder.

Tarih: 2026-07-11

## Faz

F2D — User/Admin shell ayrımı ve shared design system

## Yapılan iş

- Basic user route listesinin tek sahibi olan ayrı `UserShell` eklendi.
- Admin analytics route listesinin tek sahibi olan ayrı `AdminShell` eklendi.
- User shell içine admin route, admin shell içine user route eklenmedi.
- Admin paneline Back to User App veya role/demo switcher eklenmedi.
- Button componentine primary, secondary, ghost, danger, size, loading ve disabled contractları eklendi.
- Card componentine semantic surface, kontrollü padding ve opsiyonel hover contractı eklendi.
- Input componentine erişilebilir label, helper, validation error ve disabled contractları eklendi.
- Badge componentine neutral, info, success, warning ve error semantic varyantları eklendi.
- Modal componentine dialog semantiği, Escape close, backdrop kontrolü ve manuel focus trap eklendi.
- Spinner, EmptyState ve ErrorState componentleri eklendi.
- Empty/Error aksiyonları yalnızca parent gerçek handler ve label verdiğinde görünür olacak şekilde tasarlandı.
- Status renkleri light/dark semantic theme tokenlarına eklendi; componentlere hex renk gömülmedi.
- F2C layout dosyalarının açıklamaları Türkçeleştirildi ve property, fonksiyon, state mutation, döngü ve UI blokları adım adım yorumlandı.
- Kalıcı Türkçe yorum ve faz-önemi raporlama standardı `AGENTS.md` içinde genişletildi.

## Bu faz proje için neden önemli?

F2D, Wordix'in tek authentication girişi kullanmasına rağmen basic user ve admin uygulamalarının navigation ve business ekranlarını birbirine karıştırmamasını sağlayan ana UI sınırıdır. Bu ayrım ileride RoleGuard eklendiğinde yalnızca yetki kontrolüne değil, doğru route ağacına ve doğru navigation yüzeyine de güvenilmesini sağlar.

Shared component tabanı ise lookup, dictionary, decks, quizzes, statistics ve admin analytics featurelarının aynı loading, disabled, validation, dialog, empty ve error davranışlarını yeniden yazmadan kullanmasına imkân verir. Böylece yeni feature eklemek görsel tutarlılığı veya erişilebilirlik kurallarını bozmaz; feature componentleri business akışına odaklanabilir.

## Değişen dosyalar

- `AGENTS.md`
- `docs/phase-reports/F2C.md`
- `src/styles.css`
- `src/app/core/layout/navigation.models.ts`
- `src/app/core/layout/app-shell/app-shell.ts`
- `src/app/core/layout/app-shell/app-shell.html`
- `src/app/core/layout/app-shell/app-shell.spec.ts`
- `src/app/core/layout/navbar/navbar.ts`
- `src/app/core/layout/navbar/navbar.html`
- `src/app/core/layout/sidebar/sidebar.ts`
- `src/app/core/layout/sidebar/sidebar.html`
- `src/app/core/layout/mobile-nav/mobile-nav.ts`
- `src/app/core/layout/mobile-nav/mobile-nav.html`

## Eklenen dosyalar

- `src/app/core/layout/user-shell/user-shell.ts`
- `src/app/core/layout/user-shell/user-shell.html`
- `src/app/core/layout/admin-shell/admin-shell.ts`
- `src/app/core/layout/admin-shell/admin-shell.html`
- `src/app/core/layout/shell-separation.spec.ts`
- `src/app/shared/components/button/button.ts`
- `src/app/shared/components/button/button.html`
- `src/app/shared/components/button/button.spec.ts`
- `src/app/shared/components/card/card.ts`
- `src/app/shared/components/card/card.html`
- `src/app/shared/components/input/input.ts`
- `src/app/shared/components/input/input.html`
- `src/app/shared/components/badge/badge.ts`
- `src/app/shared/components/badge/badge.html`
- `src/app/shared/components/modal/modal.ts`
- `src/app/shared/components/modal/modal.html`
- `src/app/shared/components/modal/modal.spec.ts`
- `src/app/shared/components/spinner/spinner.ts`
- `src/app/shared/components/spinner/spinner.html`
- `src/app/shared/components/empty-state/empty-state.ts`
- `src/app/shared/components/empty-state/empty-state.html`
- `src/app/shared/components/error-state/error-state.ts`
- `src/app/shared/components/error-state/error-state.html`
- `docs/phase-reports/F2D.md`

## Silinen dosyalar

Yok.

## Çalıştırılan komutlar

- `npm.cmd exec prettier -- --write ...`
- `npm.cmd run build`
- `npm.cmd test -- --watch=false`
- `git diff --check`

## Build sonucu

Başarılı. Production bundle toplam ham boyutu 261.23 kB olarak üretildi.

## Test sonucu

Başarılı. 7 test dosyasındaki 11 test geçti.

Test kapsamına user/admin navigation sızıntı kontrolü, shared button loading koruması ve modal Escape/dialog davranışı eklendi.

## Backend endpoint doğrulaması

F2D API requesti, response DTO'su veya backend mutation implementasyonu içermez. Admin navigation yalnızca mevcut canonical API snapshotında desteklenen analytics sayfalarıyla sınırlı tutuldu; users overview, system health, raw logs veya import job route'u eklenmedi.

## Ürün kararları / deferred backlog değişikliği

Yeni ürün kararı yoktur. Kullanıcının Türkçe ve adım-adım kod yorumu ile faz-önemi raporlama isteği kalıcı Codex standardı olarak `AGENTS.md` içine kaydedildi.

## Sıradaki faz

F3A — Environment config.

## Risk / dikkat edilmesi gerekenler

- User ve admin shell henüz root route ağacına bağlanmadı; auth/role guard olmadan protected navigation canlı uygulamaya açılmadı.
- Shared input controlled component contractı kullanır; Angular Forms ControlValueAccessor ihtiyacı gerçek form fazında değerlendirilebilir.
- Modal business stateini kendi değiştirmez; `closed` eventi sonrası open stateini owning component kapatmalıdır.
