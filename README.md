# Wordix Frontend Web

Wordix'in Angular tabanlı, production odaklı web istemcisidir. Uygulama; Wordix API sözleşmesine, Keycloak kimlik doğrulamasına ve kullanıcı sahipliği kurallarına bağlı olarak geliştirilecektir.

## Hedef teknoloji seti

- Angular ve TypeScript strict mode
- Tailwind CSS
- NgRx
- Keycloak Authorization Code + PKCE
- Feature-based Clean Frontend Architecture
- Responsive ve erişilebilir web arayüzü
- Coastal Blues tasarım sistemi
- Light, dark ve system tema desteği

## Değişmez ürün kuralları

- Swagger/OpenAPI ve backend kaynak kodu davranışın gerçek referansıdır.
- Frontend Wordix API'ye kullanıcı adı veya parola göndermez.
- Login ve kayıt Keycloak üzerinden yürütülür.
- Tek authentication girişi vardır; ayrı admin login ekranı yoktur.
- `admin` kullanıcısı admin alanına, `basic_user` kullanıcısı kullanıcı alanına yönlendirilir.
- Admin ve kullanıcı uygulamaları arasında demo switcher veya “Back to User App” bulunmaz.
- Sahte API başarısı, mock production verisi ve ölü buton kullanılmaz.
- Backend desteği olmayan özellikler uygulamada Coming Soon olarak gösterilmez; dokümantasyon backlogunda tutulur.
- `keycloakUserId`, `userId`, `userProfileId` ve benzeri sahiplik alanları frontend requestlerine eklenmez.

## Yerel servis adresleri

```text
Backend API: http://localhost:5000
Swagger:     http://localhost:5000/swagger
Keycloak:    http://localhost:8080
Realm:       wordix
Web Client:  wordix-web
API Client:  wordix-api
```

## Tasarım referansı

Figma/Make React exportu `design/figma/react-reference` altında yalnızca görsel referans olarak tutulur. React kodu Angular'a kopyalanmaz. Dark-mode ekran görüntüleri `design/figma/screenshots/dark` altındadır; light tema referansı exportun tema tokenlarından alınır.

## Proje dokümanları

- `AGENTS.md`: Ana geliştirme kuralları ve faz planı
- `docs/PRODUCT_DECISIONS.md`: Kabul edilmiş ürün kararları
- `docs/DEFERRED_FEATURES.md`: Backend veya sonraki ürün fazını bekleyen işler
- `docs/UI_SCREEN_INVENTORY.md`: Canonical ekran ve aksiyon listesi
- `docs/DESIGN_SYSTEM.md`: Tema ve component standartları
- `docs/phase-reports`: Tamamlanan fazların kısa raporları

## Branch stratejisi

- `main`: Production'a çıkabilir kararlı sürüm
- `develop`: Onaylanmış fazların entegrasyon dalı
- `feature/*`: İnsan geliştiricilerin faz/özellik dalları
- `codex/*`: Codex tarafından oluşturulan çalışma dalları

Her faz ayrı ve küçük bir değişiklik seti olarak tamamlanır; kullanıcı onayı olmadan sonraki faza geçilmez.

## Mevcut durum

F0A repository ve ürün kararları temeli tamamlanmıştır. Angular uygulama kodu henüz oluşturulmamıştır.

Gerçek `.env`, access token, refresh token, API key veya veritabanı parolası repository'ye eklenmemelidir.
