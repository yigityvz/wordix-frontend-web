# Wordix Development Notes

Tarih: 2026-07-10

## Local services

```text
Backend API: http://localhost:5000
Swagger UI:  http://localhost:5000/swagger
OpenAPI:     http://localhost:5000/swagger/v1/swagger.json
Keycloak:    http://localhost:8080
Realm:       wordix
Web client:  wordix-web
API client:  wordix-api
```

## Environment yaklaşımı

Environment dosyaları yalnızca public runtime configuration içerir:

```text
apiBaseUrl
keycloakUrl
keycloakRealm
keycloakClientId
production flag
```

Repository'ye eklenmeyecek bilgiler:

```text
Access token
Refresh token
Client secret
Database password
Provider/API key
Gerçek .env içeriği
```

Browser tabanlı public client içinde client secret bulunmaz.

## Kod standartları

- TypeScript strict mode kapatılmaz.
- Standalone Angular component ve functional provider/guard/interceptor yaklaşımı tercih edilir.
- Component doğrudan HTTP çağırmaz.
- Page component facade üzerinden state tüketir.
- Dumb component yalnızca input/output contractına bağlıdır.
- Backend DTO ve UI view model aynı tip kabul edilmez; gerektiğinde mapper kullanılır.
- Ownership alanları frontend form/request modellerine eklenmez.
- `any` ancak sınırı ve nedeni açıkça belgelenmiş adaptör kodunda kullanılabilir.
- Featurelar arası internal import yapılmaz.

## İsimlendirme

```text
Angular selector: wx-<name>
File/folder: kebab-case
Class/type: PascalCase
Variable/function: camelCase
NgRx action source: [Feature/API/Page]
Route param: backend contractındaki canonical id adı
```

Önerilen aliases:

```text
@core/*
@shared/*
@features/*
@env/*
```

## UI ve erişilebilirlik

- Light/dark/system birlikte değerlendirilir.
- Hard-coded component rengi kullanılmaz.
- Form control label ve error ilişkisi erişilebilirdir.
- Icon-only button erişilebilir isim taşır.
- Focus-visible kaybolmaz.
- Modal focus trap ve Escape davranışı uygular.
- Loading sırasında tekrar submit engellenir.
- Disabled durumda neden kullanıcı tarafından anlaşılabilir olmalıdır; backend desteği olmayan özellik hiç gösterilmez.

## Backend çalışma kuralı

- Her API fazından önce canlı Swagger okunur.
- Route, DTO veya enum tahmin edilmez.
- `ApiResponse<T>` ve error yapısı merkezi normalize edilir.
- Frontend cevap doğruluğu, ownership veya authorization kararı üretmez.
- Backend mutation cevabı gelmeden fake success gösterilmez.

## UI geliştirme kuralı

- Canonical görsel kurallar `docs/DESIGN_SYSTEM.md` içinde tutulur.
- Local mock state ve `setTimeout` tabanlı demo davranışı eklenmez.
- Light, dark ve system tema aynı component yapısı üzerinden desteklenir.
- Demo role switcher, See demo flow ve Back to User App yoktur.

## Git çalışma biçimi

```text
main       production-ready
develop    integration
feature/*  human feature work
codex/*    Codex work branches
```

- Her faz küçük ve izole değişiklik setidir.
- Kullanıcı değişiklikleri korunur.
- Destructive reset/checkout yapılmaz.
- Stage, commit veya push yalnızca açık kullanıcı talebiyle yapılır.

## Komutlar

Angular uygulaması F1A'da oluşturulduktan sonra gerçek script adları doğrulanarak bu temel kontroller kullanılır:

```text
npm install
npm run start
npm run build
npm test
```

Henüz bulunmayan script veya tool varsayılmaz.

## Dokümantasyon bakım kuralı

Canonical dokümanlar her fazda rutin olarak değiştirilmez. Yalnızca kalıcı ürün kararı, backend sözleşmesi veya mimari sınır gerçekten değişirse ilgili doküman güncellenir. Normal faz sonunda kullanıcıya kısa değişiklik/build/test/riski özeti vermek yeterlidir.
