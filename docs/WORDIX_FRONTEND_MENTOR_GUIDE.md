# Wordix Frontend Mentor Rehberi

Bu belge, Wordix Angular frontend repositorysindeki dosyaların neden bulunduğunu,
katmanların nasıl konuştuğunu ve kodda karşılaşılabilecek Angular, TypeScript, RxJS,
NgRx ve HTTP terimlerini açıklar. Amaç, bir dosyayı ezberlemek değil; mentör bir isim
sorduğunda o ismin sistemdeki sorumluluğunu ve neden seçildiğini anlatabilmektir.

## 1. Projeyi tek cümlede nasıl anlatırım?

Wordix frontend; Keycloak ile kimlik doğrulayan, Wordix API'ye bearer token ile istek
atan, backend verisini feature bazlı NgRx state içinde yöneten ve Angular standalone
componentlerle light/dark/system temalı ekranlar sunan bir web uygulamasıdır.

## 2. Uçtan uca veri akışı

Bir kullanıcı butona bastığında genel akış şöyledir:

1. HTML template bir component metodunu veya bir `output` eventini tetikler.
2. Sayfa componenti doğrudan HTTP çağırmak yerine feature facade metodunu çağırır.
3. Facade bir NgRx action dispatch eder.
4. Effect actionı dinler ve feature API service üzerinden backend isteğini yapar.
5. API service ortak `WordixApiService`/`BaseApiService` HTTP altyapısını kullanır.
6. Auth interceptor access tokenı `Authorization` headerına ekler.
7. Backend cevabı mapper ile ekran modeline dönüştürülür.
8. Reducer yeni immutable state üretir.
9. Selector gerekli state parçasını seçer.
10. Facade bu selectorı signal olarak component ve template'e sunar.

Bu ayrımın faydası; HTML, business intent, state değişimi, HTTP ve DTO dönüşümünün
aynı dosyaya yığılmamasıdır.

## 3. Kök dosyalar

| Dosya | Görevi |
| --- | --- |
| `AGENTS.md` | Mimari, ürün, backend ve çalışma süreci kurallarının ana kaynağıdır. |
| `README.md` | Projenin amacı, kurulumu ve temel geliştirme komutlarını açıklar. |
| `.editorconfig` | Editörler arasında girinti, satır sonu ve karakter kodlamasını tutarlı yapar. |
| `.prettierrc` | Prettier biçimlendirme standardını belirler; satır hedefi 100 karakterdir. |
| `.postcssrc.json` | Tailwind CSS'in PostCSS derleme zincirine bağlanmasını sağlar. |
| `.gitignore` | `node_modules`, build çıktıları ve yerel dosyaların Git'e girmesini engeller. |
| `package.json` | Bağımlılıkları ve `start`, `build`, `test` gibi npm scriptlerini tanımlar. |
| `package-lock.json` | Kurulan npm bağımlılık sürümlerini tekrarlanabilir biçimde kilitler; generated dosyadır. |
| `angular.json` | Angular workspace, build, serve, test ve environment replacement ayarlarını taşır. |
| `tsconfig.json` | Bütün workspace için ortak strict TypeScript compiler ayarlarını tanımlar. |
| `tsconfig.app.json` | Yalnız uygulama derlemesine ait TypeScript giriş ve çıktı sınırlarını belirler. |
| `tsconfig.spec.json` | Test dosyalarının Vitest/Angular test tipleriyle derlenmesini sağlar. |

`angular.json` içindeki `production` adı bir build configuration ismidir. Kaldırılan
`environment.production` boolean alanıyla aynı şey değildir. Build configuration;
optimizasyon, output hashing ve file replacement gibi Angular CLI davranışlarını seçer.

## 4. Uygulama başlangıç dosyaları

| Dosya | Görevi |
| --- | --- |
| `src/index.html` | Angular'ın browserda bağlandığı tek HTML host belgesidir. |
| `src/main.ts` | `bootstrapApplication` ile root componenti ve uygulama configini başlatır. |
| `src/styles.css` | Tailwind importu, tema tokenları ve uygulama genelindeki global stilleri taşır. |
| `src/app/app.ts` | Root Angular component sınıfıdır. |
| `src/app/app.html` | Root template içinde router çıktısının gösterildiği yüzeydir. |
| `src/app/app.css` | Root componente özel stil alanıdır. |
| `src/app/app.config.ts` | Router, HTTP, interceptor, NgRx ve uygulama providerlarını birleştirir. |
| `src/app/app.routes.ts` | Public, user ve admin route ağacının üst seviye tanımıdır. |
| `src/app/app.spec.ts` | Root componentin temel oluşturulma davranışını doğrular. |

## 5. Environment ve configuration dosyaları

| Dosya | Görevi |
| --- | --- |
| `src/environments/environment.ts` | Varsayılan API base URL ve public Keycloak ayarlarını içerir. |
| `src/environments/environment.development.ts` | Local geliştirme buildinde file replacement ile seçilen karşılıktır. |
| `core/config/app-config.model.ts` | İki environment nesnesinin uyması gereken readonly TypeScript sözleşmesidir. |
| `core/config/app-config.service.ts` | Aktif configi uygulamaya tek merkezden sunar. |
| `core/config/app-config.service.spec.ts` | Config getterlarının seçili environment değerlerini döndürdüğünü sınar. |

### `production: true/false` neden vardı ve neden kaldırıldı?

Bu alan geleneksel olarak runtime kodunun “hangi builddeyim?” sorusunu cevaplaması için
kullanılır. Örneğin production buildde debug log kapatılabilir. Wordix'te hiçbir davranış
bu booleanı kullanmıyordu; yalnız model ve getter olarak taşınıyordu. Bu nedenle iki
environment dosyasından, `AppConfig` sözleşmesinden ve `AppConfigService` getterından
kaldırıldı. API/Keycloak environment ayrımı devam eder.

## 6. `core` katmanı

`core`, uygulama genelinde bir kez kurulan altyapıdır. Feature iş ekranı içermez.

### 6.1 Authentication

| Dosya | Görevi |
| --- | --- |
| `auth.models.ts` | Auth status, kullanıcı rolleri ve session tiplerini tanımlar. |
| `keycloak.service.ts` | Keycloak init, login, register, logout ve token işlemlerini sarar. |
| `keycloak.service.spec.ts` | Keycloak adapterının success/error davranışlarını doğrular. |
| `auth.facade.ts` | Componentlere auth state ve auth intentleri için sade bir kapı sunar. |
| `auth-navigation.service.ts` | Role göre user/admin hedef routeunu seçer. |
| `auth-navigation.service.spec.ts` | Admin önceliği ve basic user yönlendirmesini sınar. |

Keycloak kullanıcı adı/parolayı Wordix frontend veya API'ye vermez. Authorization Code
+ PKCE akışı browserı Keycloak'a yönlendirir; frontend daha sonra access token alır.

### 6.2 Guards

| Dosya | Görevi |
| --- | --- |
| `auth.guard.ts` | Route açılmadan önce session varlığını kontrol eder. |
| `role.guard.ts` | Route için gerekli rolün token rollerinde bulunmasını kontrol eder. |
| İlgili `.spec.ts` dosyaları | İzin, redirect ve forbidden senaryolarını sınar. |

Guard bir güvenlik duvarının frontend tarafıdır; asıl authorization yine backendde
uygulanmalıdır. Kullanıcı routeu gizlense bile backend 403 kontrolü zorunludur.

### 6.3 Interceptors ve errors

| Dosya | Görevi |
| --- | --- |
| `auth-token.interceptor.ts` | Protected API requestlerine bearer token ekler. |
| `api-error.interceptor.ts` | HTTP hatalarını merkezi Wordix hata modeline dönüştürür. |
| `api-error.model.ts` | UI/state katmanının kullanacağı normalize hata tipidir. |
| `api-error.mapper.ts` | 400/401/403/404/500 ve validation payloadlarını eşler. |
| İlgili `.spec.ts` dosyaları | Header ve hata eşleme davranışını sınar. |

Interceptor, her `HttpClient` çağrısında otomatik çalışan ara katmandır. Böylece her
feature service token veya hata dönüşüm kodunu tekrar yazmaz.

### 6.4 Ortak HTTP

| Dosya | Görevi |
| --- | --- |
| `models/api-response.model.ts` | Backend `ApiResponse<T>` zarfının tipini tanımlar. |
| `models/error-response.model.ts` | Backend hata payload sözleşmesini tanımlar. |
| `models/paged-result.model.ts` | Sayfalı sonuçlarda items/page/total alanlarını tanımlar. |
| `api-response.mapper.ts` | Başarılı response zarfından typed payloadı çıkarır. |
| `wordix-api.service.ts` | Genel library ile Wordix'e özel response zarfı arasında adapterdır. |
| İlgili `.spec.ts` dosyaları | Unwrap, request ve hata durumlarını sınar. |

`WordixApiService` genel `BaseApiService`ten kalıtım alır. Base service URL ve HTTP
metotlarını bilir; Wordix adapterı ise yalnız Wordix backendinin response formatını bilir.

### 6.5 Layout

| Dosya/grup | Görevi |
| --- | --- |
| `navigation.models.ts` | Sidebar/mobile nav item tiplerini tanımlar. |
| `app-shell/*` | Oturum durumuna göre doğru ana shell alanını oluşturur. |
| `user-shell/*` | User sayfaları için sidebar, navbar, mobile nav ve router outlet düzenidir. |
| `admin-shell/*` | Admin navigation ve content düzenini user shell'den ayrı tutar. |
| `sidebar/*` | Sabit masaüstü navigation, profil kartı ve logout alanıdır. |
| `mobile-nav/*` | Küçük ekranlarda kullanıcı navigationını sunar. |
| `navbar/*` | Sayfa üst başlık/aksiyon alanıdır. |
| `navigation-icon/*` | Menü isimlerini ortak SVG ikonlarına eşler. |
| `shell-separation.spec.ts` | Admin ve user shell sınırlarının karışmadığını doğrular. |

Bir component klasöründeki `.ts` davranışı/input/outputları; `.html` ise görünümü taşır.
CSS çoğunlukla Tailwind utility classlarıyla template içinde kurulduğu için her component
yanında ayrı `.css` bulunması zorunlu değildir.

### 6.6 Root auth store

| Dosya | Görevi |
| --- | --- |
| `root-store.providers.ts` | Root NgRx store, effects ve router store providerlarını kurar. |
| `auth.state.ts` | Auth state şekli ve initial statei tanımlar. |
| `auth.actions.ts` | Initialize/login/logout success/failure intent ve eventlerini tanımlar. |
| `auth.reducer.ts` | Actionlara göre yeni immutable auth state üretir. |
| `auth.selectors.ts` | Auth state içinden status/user/role gibi parçaları seçer. |
| `auth.effects.ts` | Keycloak async çağrılarını ve navigation side effectlerini yürütür. |
| `auth.reducer.spec.ts` | Reducer geçişlerini saf fonksiyon olarak sınar. |

### 6.7 Theme

| Dosya | Görevi |
| --- | --- |
| `theme.models.ts` | `light`, `dark`, `system` ve resolved theme tiplerini tanımlar. |
| `theme.service.ts` | localStorage ve `prefers-color-scheme` ile `dark` classını yönetir. |
| `theme.facade.ts` | Componentlere theme state ve değiştirme metodunu sunar. |
| `theme.service.spec.ts` | Storage ve sistem teması değişimini sınar. |

## 7. `shared` componentleri

Shared componentler Wordix business kuralı bilmez; input alır, output üretir.

| Component | Görevi |
| --- | --- |
| `badge` | Role/status/etiket bilgisini küçük görsel işaret olarak sunar. |
| `button` | Primary/secondary/ghost/danger, disabled ve loading buton standardıdır. |
| `card` | Tekrarlanan surface/border/radius düzenini merkezileştirir. |
| `input` | Label, helper, validation ve erişilebilir input düzenidir. |
| `modal` | Dialog, backdrop, Escape, focus ve kapatma davranışlarını yönetir. |
| `option-selection-dialog` | Generic seçenek listesinden seçim yaptırır. |
| `spinner` | Async loading durumunu erişilebilir biçimde gösterir. |
| `empty-state` | Veri olmayan liste/sayfa durumunu açıklar. |
| `error-state` | Hata mesajı ve opsiyonel retry intenti sunar. |
| `theme-toggle` | Light/dark/system tercihini input/output üzerinden yönetir. |

Her klasördeki `.spec.ts`, componentin render, input/output ve kullanıcı etkileşimini
test eder.

## 8. Feature dosya standardı

Feature adından bağımsız olarak aynı dosya son ekleri aynı sorumluluğu taşır:

| Kalıp | Anlamı |
| --- | --- |
| `*.routes.ts` | Feature route ve lazy loading sınırıdır. |
| `*.providers.ts` | Feature store/effects gibi providerları route seviyesinde kurar. |
| `api/*-api.service.ts` | Endpoint, route param, query ve request body bilgisini taşır. |
| `models/*-api.models.ts` | Backend DTO şeklidir; API'ye bağımlıdır. |
| `models/*-request.models.ts` | Mutation ve filtre request tipleridir. |
| `models/*.models.ts` | UI/domain tarafında kullanılan temiz modellerdir. |
| `mappers/*.mapper.ts` | DTO'yu UI modeline dönüştürür ve nullable veriyi normalize eder. |
| `facades/*.facade.ts` | Component ile NgRx arasındaki sade public API'dir. |
| `store/*.actions.ts` | Kullanıcı intenti ve API lifecycle eventleridir. |
| `store/*.effects.ts` | Async API çağrıları ve yan etkilerdir. |
| `store/*.reducer.ts` | Statei immutable biçimde güncelleyen saf fonksiyondur. |
| `store/*.selectors.ts` | State içinden gerekli/türetilmiş veriyi seçer. |
| `store/*.state.ts` | Feature state sözleşmesi ve initial statedir. |
| `pages/*` | Route tarafından açılan, facade ile konuşan smart componenttir. |
| `components/*` | Input/output ile çalışan, mümkün olduğunca dumb UI parçasıdır. |
| `*.spec.ts` | Yanındaki source dosyanın davranış testidir. |

## 9. Feature envanteri

### 9.1 Auth

- `auth-route.resolver.ts`: root girişinde session/role sonucuna göre hedef routeu çözer.
- `login-page`: Credential toplamaz; sign-in ve create-account ile Keycloak'a gider.
- `auth-callback-page`: Keycloak dönüşünden sonra session ve role redirectini tamamlar.
- `forbidden-page`: Rolü yetersiz kullanıcıya 403 anlamlı ekran sunar.

### 9.2 Profile

- `profile-api.service.ts`: `GET /api/profile/me` çağrısını yapar.
- `profile-api.models.ts`: Backend token-derived profile DTO'sudur.
- `profile.models.ts`: Navbar/sidebar için güvenli profile görünüm modelidir.
- `profile.mapper.ts`: DTO'yu view modele dönüştürür.
- `profile.actions/effects/reducer/selectors/state`: Profile load lifecycleını yönetir.
- `profile.facade.ts`: Shell ve sayfalara profile signal/intentlerini sunar.

### 9.3 Dashboard

- `dashboard.routes.ts`: User dashboard lazy routeudur.
- `dashboard-page.ts`: `OnInit`te profile/statistics/dictionary verilerini yükler,
  `OnDestroy`da sayfaya ait state temizliğini yapar.
- `dashboard-page.html`: Summary kartları, progress, difficult items ve quick actionları
  gerçek backend stateinden gösterir.
- `dashboard-page.spec.ts`: Loading/data/error ve navigation davranışını sınar.

### 9.4 Lookup

- API/model/mapper/store/facade dosyaları `POST /api/lookups` akışını yönetir.
- `lookup-page`: Arama intentini ve save-to-dictionary akışını koordine eder.
- `lookup-search-form`: Metin ve dil seçimini toplar.
- `lookup-result-card`: Sonucun başlık, metadata ve anlamlarını gösterir.
- `lookup-meaning-list`: Backendden gelen meanings listesini render eder.
- `provider-badge`: Database/provider kaynağını gösterir.
- `save-to-dictionary-button`: Gerçek save intentini loading/disabled state ile üretir.

### 9.5 Dictionary

- API/model/mapper/store/facade dosyaları liste, detail, save, notes ve flags akışlarını yönetir.
- `dictionary-list-page`: Arama, filtre, sıralama ve sayfalı dictionary listesidir.
- `dictionary-detail-page`: Seçili item, meanings, progress, notes ve flags alanıdır.
- `dictionary-card`: Bir dictionary kaydının liste görünümüdür.
- `dictionary-filters`: Search/filter/sort intentlerini parenta iletir.
- `dictionary-meaning-panel`: Kaydedilmiş anlamları gösterir.
- `dictionary-notes-panel`: Note create/update/delete formlarını yönetir.
- `dictionary-flags-panel`: Favorite/difficult ekleme-kaldırma intentlerini üretir.
- `learning-progress-panel`: Confidence ve lifecycle bilgisini gösterir.
- `progress-badge`: New/learning/reviewing/mastered etiketidir.

### 9.6 Decks

- API/model/mapper/store/facade dosyaları list/detail/create/add/remove akışlarını yönetir.
- `deck-list-page`: Deckleri yükler ve create dialogunu koordine eder.
- `deck-detail-page`: Tek deck ve itemlarını gösterir; gerçek remove intenti üretir.
- `create-deck-dialog`: Deck adı/açıklaması formudur.
- `deck-card`: Liste kartıdır.
- `deck-item-card`: Deck içindeki öğrenme itemının görünümüdür.

### 9.7 Quizzes

- API/model/mapper/store/facade dosyaları session create, answer ve summary akışını yönetir.
- `quiz-start-page`: Backendin desteklediği setup seçenekleriyle session başlatır.
- `quiz-play-page`: Aktif soruyu gösterir ve cevabı backendde kaydeder.
- `quiz-summary-page`: Backend summary ve recommendation verisini gösterir.
- `question-shell`: Soru tipleri için ortak çerçevedir.
- `multiple-choice-question`: Seçenek seçimi outputu üretir.
- `writing-question`: Metin cevap outputu üretir.
- `question-progress`: Mevcut/toplam soru ilerlemesini gösterir.
- `answer-feedback`: Backend değerlendirme sonucunu gösterir.
- `quiz-summary-question`: Summary içindeki soru/cevap detayını gösterir.

### 9.8 Statistics

- API/model/mapper/store/facade dosyaları learning summary, quizzes, difficult items,
  decks ve confidence distribution endpointlerini yönetir.
- `statistics-page`: Beş akışı yükler; tarih, quiz type, source, sort ve pagination
  filtrelerini signal olarak tutar.
- `learning-summary-cards`: Genel öğrenme metriklerini gösterir.
- `quiz-statistics-panel`: Quiz doğruluk/süre metriklerini gösterir.
- `difficult-items-table`: Zor itemlar ve filtre/pagination intentlerini sunar.
- `deck-statistics-grid`: Deck performanslarını gösterir.
- `confidence-distribution-chart`: Backend bucketlarını erişilebilir barlara dönüştürür.

### 9.9 Admin analytics

- API/model/mapper/store/facade dosyaları yalnız admin endpointlerini yönetir.
- `admin-dashboard-page`: Dashboard aggregate ile dört preview listesini birleştirir.
- `top-searches-page`: En çok aranan sorguları gösterir.
- `top-saved-page`: En çok dictionary'ye kaydedilen itemları gösterir.
- `most-wrong-page`: En yüksek yanlış oranlı öğrenme itemlarını gösterir.
- `provider-stats-page`: Provider request/success/failure/cache metriklerini gösterir.

### 9.10 Preferences

- `preferences.routes.ts`: Settings routeunu lazy yükler.
- `settings-page`: Backend gerektirmeyen gerçek theme gibi kullanıcı tercihlerini sunar.

## 10. Angular API Client Core library

`projects/angular-api-client-core` Wordix business bilgisinden bağımsız reusable HTTP
librarydir.

| Dosya | Görevi |
| --- | --- |
| `src/public-api.ts` | Package consumerına açık export yüzeyidir. |
| `api-client-config.model.ts` | Genel `baseUrl` ve opsiyonel config sözleşmesidir. |
| `api-client-config.token.ts` | Configi Angular DI sistemine taşıyan InjectionToken'dır. |
| `provide-api-client.ts` | Consumerın library configini provider olarak kaydetmesini sağlar. |
| `api-request-options.model.ts` | Headers, params, responseType gibi typed request seçenekleridir. |
| `base-api.service.ts` | Typed GET/POST/PUT/PATCH/DELETE ve URL birleştirme temel sınıfıdır. |
| İlgili `.spec.ts` dosyaları | Config, URL, body, query ve HTTP verb davranışlarını sınar. |
| `ng-package.json` | ng-packagr girişini ve package çıktısını tanımlar. |
| `package.json` | Library package adı, peer dependency ve publish metadata bilgisidir. |
| `tsconfig.lib*.json` | Library normal ve publish build compiler ayarlarıdır. |
| `tsconfig.spec.json` | Library test compiler ayarlarıdır. |
| `README.md` | Dış geliştirici için kurulum, kullanım, extension ve test rehberidir. |
| `LICENSE` | Açık kaynak kullanım şartlarını tanımlar. |

## 11. Sorulan Angular kavramları

### `OnInit` ne işe yarar?

`OnInit`, Angular'ın lifecycle interfaceidir. Component oluşturulup Angular inputları
ilk kez hazırladıktan sonra `ngOnInit()` metodunu bir kez çağıracağını ifade eder.

```ts
export class DeckListPage implements OnInit {
  ngOnInit(): void {
    this.facade.loadDecks();
  }
}
```

- `implements OnInit`, TypeScript'e “bu sınıf `ngOnInit` sözleşmesine uyacak” der.
- Asıl çalışan isim `ngOnInit()` metodudur.
- Sayfa ilk açıldığında veri yüklemek için uygundur.
- Constructor; dependency hazırlamak içindir, business/API başlangıcı için tercih edilmez.
- `ngOnInit` her signal değişiminde çalışmaz; component instanceı başına bir kez çalışır.

### `OnDestroy` ne işe yarar?

Component route veya template'ten kaldırılmadan hemen önce `ngOnDestroy()` çalışır.
Subscription, timer, event listener veya feature state temizliği için kullanılır.

### `NgIf` ne işe yarar?

`NgIf`, koşul true ise bir HTML bloğunu DOM'a ekleyen; false ise DOM'dan çıkaran eski
Angular structural directiveidir:

```html
<section *ngIf="isLoaded">İçerik</section>
```

Wordix Angular 21 kullandığı için yeni built-in control flow olan `@if` kullanılır:

```html
@if (isLoaded()) {
  <section>İçerik</section>
} @else {
  <wx-spinner />
}
```

İkisi aynı temel sorunu çözer. `@if` için `NgIf` import etmek gerekmez, okunması daha
kolaydır ve yeni Angular yaklaşımıdır. `[hidden]` yalnız görünürlüğü değiştirirken
`@if`/`NgIf` bloğu gerçekten DOM'a ekler veya DOM'dan kaldırır.

### `signal(30)` ne demektir?

`signal(30)`, başlangıç değeri `30` olan tek bir writable signal oluşturur. “30 signal”
anlamına gelmez.

Admin dashboardta:

```ts
protected readonly dateRangeDays = signal(30);
```

- `dateRangeDays()` mevcut değeri okur.
- `dateRangeDays.set(7)` değeri 7 yapar.
- Template bu signali okuduğu için Angular değişiklikte ilgili görünümü günceller.
- `30`, dashboardun ilk açılışta son 30 günlük analytics istemesi için varsayılandır.
- Kullanıcı 7/30/90 günlük butona basınca değer değişir ve backend tekrar çağrılır.

`readonly`, signal nesnesinin başka bir nesneyle değiştirilmesini engeller; signalin
iç değerinin `.set()` ile değişmesine engel değildir.

## 12. Angular ve TypeScript terimleri

| Terim | Açıklama |
| --- | --- |
| `@Component` | Sınıfı Angular componenti yapan decorator metadata'sıdır. |
| `selector` | Componentin HTML'de kullanılacağı tag adıdır. |
| `standalone` | NgModule zorunluluğu olmadan import edilebilen component yaklaşımıdır. Angular 21'de varsayılandır. |
| `imports` | Template'in kullandığı component/directive/pipe bağımlılıklarıdır. |
| `templateUrl` | Component görünümünün bulunduğu HTML dosyasıdır. |
| `ChangeDetectionStrategy.OnPush` | Değişiklik kontrolünü input, signal ve event odaklı daha kontrollü yürütür. |
| `inject()` | Angular dependency injection containerından servis alır. |
| DI | Sınıfın bağımlılığını kendisi oluşturmaması, dışarıdan almasıdır. |
| Provider | DI sistemine hangi token için hangi değerin/sınıfın verileceğini söyler. |
| `providedIn: 'root'` | Servisin uygulama genelinde singleton olmasını sağlar. |
| `input()` | Parent componentten readonly reaktif değer alır. |
| `input.required()` | Input verilmesini compile-time sözleşme yapar. |
| `output()` | Child componentten parenta event/intent gönderir. |
| `computed()` | Başka signallardan türetilen readonly reaktif değer üretir. |
| `effect()` | Okuduğu signallar değişince side effect çalıştırır; dikkatli kullanılmalıdır. |
| `signal()` | Değeri okunduğunda bağımlılık izleyen reaktif state kabıdır. |
| `protected` | Üyeyi class/template kullanımına açar, dış consumer API'si yapmaz. |
| `private` | Üyenin yalnız sınıf içinde kullanılmasını sağlar. |
| `readonly` | Property referansının sonradan yeniden atanmasını engeller. |
| `interface` | Runtime kod üretmeden nesne şekli sözleşmesi tanımlar. |
| `type` | Union, alias veya birleşik TypeScript tipi tanımlar. |
| Generic `<T>` | Aynı yapıyı tip güvenli biçimde farklı payloadlarla kullanmayı sağlar. |
| `extends` | Bir sınıftan implementasyon ve sözleşme kalıtımı alır. |
| `implements` | Sınıfın bir interface sözleşmesine uyduğunu compile timeda denetler. |
| `abstract` | Doğrudan instance alınmayan, alt sınıflar için temel oluşturan sınıf/metottur. |
| `as const` | Literal değerleri geniş `string/number` yerine en dar readonly tipte tutar. |
| `satisfies` | Nesnenin sözleşmeye uyduğunu denetlerken literal tip bilgisini korur. |
| `?.` | Sol taraf null/undefined ise hata vermeden undefined döndüren optional chainingdir. |
| `??` | Yalnız null/undefined durumunda fallback seçen nullish coalescingdir. |
| `...value` | Object/array spread ile kopyalama/birleştirme yapar. |
| `async/await` | Promise tabanlı asenkron akışı okunabilir sıraya dönüştürür. |
| `void` | Metodun değer döndürmediğini belirtir; `void promise` sonucu bilerek beklemediğimizi anlatabilir. |

## 13. Template terimleri

| Terim | Açıklama |
| --- | --- |
| `{{ value }}` | Interpolation; değeri metin olarak render eder. |
| `[value]="x"` | Property binding; DOM/component propertysine expression verir. |
| `(click)="save()"` | Event binding; browser/component eventinde metot çağırır. |
| `[(ngModel)]` | Two-way bindingdir; Wordix reactive/signal form yaklaşımında sınırlı kullanılır. |
| `@if` | Koşullu DOM bloğudur. |
| `@for` | Collection render eder. |
| `track` | Angular'ın hangi satırın aynı item olduğunu anlamasını sağlar. |
| `@empty` | `@for` collectionı boşken gösterilen bloktur. |
| `@switch` | Bir değere göre alternatif bloklardan birini render eder. |
| `as item` | Expression sonucuna template içinde yerel isim verir. |
| `[class.foo]` | Koşula göre tek CSS classı ekler/çıkarır. |
| `routerLink` | Tam sayfa reload olmadan Angular route navigationı yapar. |
| `router-outlet` | Aktif route componentinin yerleştirildiği alandır. |
| `aria-*` | Screen reader ve erişilebilirlik semantiği sağlar. |

## 14. NgRx ve RxJS terimleri

| Terim | Açıklama |
| --- | --- |
| Store | Uygulama/feature stateinin merkezi ve tahmin edilebilir deposudur. |
| Action | “Ne oldu/ne istendi?” bilgisini taşıyan plain object eventidir. |
| Reducer | Önceki state + actiondan yeni state üreten side-effectsiz fonksiyondur. |
| Selector | State içinden belirli veya türetilmiş veriyi seçen fonksiyondur. |
| Effect | Action dinleyip HTTP/navigation gibi async side effect yapan akıştır. |
| Facade | Componentin action/selector ayrıntılarını bilmesini engelleyen ara yüzdür. |
| Immutable | Mevcut nesneyi değiştirmek yerine yeni state nesnesi üretmektir. |
| Observable | Zaman içinde sıfır veya daha fazla değer yayınlayan RxJS akışıdır. |
| `pipe()` | Observable operatorlerini sırayla uygular. |
| `map()` | Her yayınlanan değeri başka değere dönüştürür. |
| `switchMap()` | Yeni değer gelince önceki inner isteği iptal edip yenisine geçer. |
| `exhaustMap()` | Mevcut işlem bitmeden gelen yeni tetikleri yok sayar; çift submiti önler. |
| `concatMap()` | Async işleri sırayla çalıştırır. |
| `catchError()` | Observable hatasını yakalayıp failure action/value üretir. |
| `of()` | Verilen değerleri yayınlayan basit Observable oluşturur. |
| Subscription | Observable dinleyiciliğidir; lifecycle sonunda temizlenmesi gerekebilir. |

## 15. HTTP ve backend terimleri

| Terim | Açıklama |
| --- | --- |
| Endpoint | Backendde belirli bir işlemi sunan HTTP routeudur. |
| DTO | Ağ üzerinden taşınan request/response veri sözleşmesidir. |
| GET | Veri okur; normalde state mutation yapmaz. |
| POST | Yeni işlem/kayıt veya komut başlatır. |
| PUT | Kaynağın tamamını güncelleme anlamı taşır. |
| PATCH | Kaynağın belirli alanlarını kısmi günceller. |
| DELETE | Kaynağı veya ilişkiyi kaldırır. |
| Header | Authorization/content type gibi request metadatasıdır. |
| Query param | Filtre, sayfa ve sort gibi URL sonu parametreleridir. |
| Route param | `/decks/:deckId` içindeki belirli kaynak kimliğidir. |
| Request body | POST/PUT/PATCH ile gönderilen typed payloadtır. |
| Bearer token | API'nin kullanıcı/rol doğrulaması için Authorization headerında aldığı access tokendır. |
| 400 | Request/validation hatasıdır. |
| 401 | Geçerli kimlik doğrulama yoktur. |
| 403 | Kimlik belli ama işlem için yetki yoktur. |
| 404 | Kaynak bulunamamıştır. |
| 409 | Duplicate veya state conflict anlamına gelir. |
| 500 | Beklenmeyen backend hatasıdır; frontend fake success üretmemelidir. |

## 16. Test terimleri

| Terim | Açıklama |
| --- | --- |
| Unit test | Tek service/reducer/mapper/component davranışını izole doğrular. |
| `describe` | İlgili test grubunu tanımlar. |
| `it` | Tek beklenen davranış senaryosudur. |
| `beforeEach` | Her testten önce ortak kurulumu tekrarlar. |
| `expect` | Gerçek sonuç için assertion kurar. |
| Mock | Gerçek bağımlılığın kontrollü test karşılığıdır; production fake veri değildir. |
| Spy | Bir metodun çağrılıp çağrılmadığını/argümanlarını izler. |
| Fixture | Testte oluşturulan Angular component ve DOM erişim kabıdır. |
| TestBed | Angular dependency/component test ortamını konfigüre eder. |
| HttpTestingController | Gerçek ağa çıkmadan beklenen HTTP isteğini yakalar ve cevaplar. |

## 17. Mentörün sorabileceği kısa sorulara hazır cevaplar

### Neden component doğrudan API service çağırmıyor?

Componentin görevi görünüm ve kullanıcı intentidir. Facade/NgRx ayrımı loading, error,
cache ve test davranışlarını tek yerde toplar; componenti backend ayrıntısından korur.

### Neden API modeli ve normal model ayrı?

Backend DTO değişebilir, nullable veya taşıma odaklı olabilir. Mapper sınırı sayesinde
template backend shapeine doğrudan bağlanmaz ve güvenli UI modeli kullanır.

### Neden her featureın ayrı storeu var?

Feature bağımsız gelişir, lazy route ile yüklenir ve global store şişmez. Bir feature
değiştiğinde diğer featureların state sözleşmesi etkilenmez.

### Neden signal ve NgRx birlikte kullanılıyor?

NgRx paylaşılan async/server state için; local signal ise seçili filtre, dialog açık mı
gibi component-local ve hızlı UI state için kullanılır. Facade selectorları da template'e
signal olarak sunarak iki yaklaşım arasında temiz köprü kurar.

### Neden `OnPush` kullanılıyor?

Signal/input/action kaynaklı değişiklikleri daha öngörülebilir izler, gereksiz geniş
change detectionı azaltır ve immutable state yaklaşımıyla uyumludur.

### Neden Tailwind varken component CSS dosyaları az?

Stiller design token kullanan utility classlarla HTML'de ifade ediliyor. Global tokenlar
`styles.css` içindedir. Ayrı CSS ancak karmaşık veya tekrar kullanılacak özel stil
gerektiğinde açılır; dosya sayısı olsun diye boş CSS açılmaz.

### `private readonly facade = inject(...)` ne demek?

Angular DI'dan bir facade instanceı alır; yalnız class içinde kullanılabilir ve property
başka bir nesneye yeniden atanamaz.

### Neden `signal(30)` sabit değil?

30 başlangıç değeridir; kullanıcı 7 veya 90 seçebildiği için değer değişebilmelidir.
Reaktif signal, template ve request querysinin aynı güncel değeri kullanmasını sağlar.

### Frontendde `userId` neden gönderilmiyor?

Ownership backendde access tokenın `sub` claiminden çözülür. Browserdan owner id kabul
etmek başka kullanıcının verisine erişme riskini doğurur.

## 18. Okuma sırası

Bir featureı anlamak için önerilen sıra:

1. `*.routes.ts`
2. page `.ts` ve `.html`
3. facade
4. actions
5. effects
6. API service
7. API/request modelleri
8. mapper ve UI modelleri
9. reducer/state/selectors
10. componentler
11. `.spec.ts` davranış örnekleri

Bu sıra, “kullanıcı hangi routeu açıyor?” sorusundan başlayıp backend çağrısına ve
statein tekrar ekrana dönüşüne kadar bütün zinciri takip etmeyi sağlar.
