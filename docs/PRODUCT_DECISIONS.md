# Wordix Product Decisions

Bu belge kabul edilmiş ürün kararlarının canonical kaydıdır. Swagger/OpenAPI ile çelişen uygulama davranışlarında backend sözleşmesi gerçek referanstır; ürün gereksinimi henüz backend tarafından desteklenmiyorsa frontend sahte davranış üretmez.

Son güncelleme: 2026-07-10

## Production-first yaklaşımı

- Her ekran canlıya çıkacak gerçek uygulamanın parçasıymış gibi geliştirilir.
- Figma/Make exportu yalnızca görsel referanstır.
- Mock veri, sahte gecikme, fake success toast ve demo navigation production uygulamasına taşınmaz.
- Backend desteği olmayan aksiyon uygulamada çalışıyormuş gibi gösterilmez.
- Coming Soon özellikleri UI'da gösterilmez; `DEFERRED_FEATURES.md` içinde takip edilir.

## Authentication ve registration

- Tek authentication girişi bulunur; ayrı admin login ekranı yapılmaz.
- Login ve registration Keycloak tarafından yürütülür.
- Wordix API'ye username/password gönderilmez.
- Auth giriş ekranı yüksek kaliteli, responsive bir login/register yüzeyi olacaktır.
- “Sign in” Keycloak login akışını, “Create account” Keycloak registration akışını başlatır.
- Marketing welcome hero ve “See demo flow” bulunmaz.
- Callback sonrasında roller okunur:
  - `admin` -> `/admin/dashboard`
  - `basic_user` -> `/dashboard`
- Kullanıcı iki role de sahipse admin alanı önceliklidir.
- `keycloakUserId` veya teknik token kimlikleri profil ekranında gösterilmez.

## Admin ve user alanları

- Admin ve user shell/router alanları birbirinden ayrıdır.
- Admin alanında user bottom navigation veya global user lookup davranışı bulunmaz.
- “Back to User App”, workspace switcher ve demo role switcher yapılmaz.
- Önerilen canonical admin route yapısı:

```text
/admin/dashboard
/admin/analytics/top-lookups
/admin/analytics/most-saved
/admin/analytics/quiz-insights
/admin/analytics/provider
```

- Backend endpointi olmayan admin ekranı production navigation'a eklenmez.
- Import job listesi, raw provider request logları ve retry işlemleri plan kapsamında değildir.

## Theme

- İlk sürüm `light`, `dark` ve `system` tema değerlerini destekler.
- Tercih `wordix-theme` anahtarıyla localStorage'da saklanır.
- `system` seçildiğinde `prefers-color-scheme` izlenir ve işletim sistemi değişiklikleri canlı uygulanır.
- Componentlerde hard-coded tema rengi kullanılmaz.

## Lookup ve dictionary

- Lookup gerçek `POST /api/lookups` endpointini kullanır.
- Ürün hedefi kelime/phrase sonucunu bütün anlamlarıyla dictionary'ye kaydetmektir.
- Mevcut Swagger tek `selectedMeaningId` istediği için bütün anlamları kaydetme davranışı backend sözleşmesi güncellenmeden uygulanmaz.
- Sentence save ayrı backend endpointini kullanır.
- Lookup sonucundan Add to Deck birleşik akıştır:
  1. Item dictionary'de değilse kaydedilir.
  2. Kullanıcı hedef deck'i seçer.
  3. Oluşan `userLearningItemId` deck'e eklenir.
- Dictionary list/detail ekranında Add to Deck bulunur ve kullanıcı deck seçer.
- Frontend requestlerine ownership id eklenmez.

## Decks

- İlk uygulamada create, list, detail, add item ve remove item gerçek endpointlerle desteklenir.
- Edit/delete backend endpointleri gelene kadar UI'ya eklenmez.

## Quizzes

- Quiz başlatma, answer gönderme, summary ve recommendation save gerçek backend cevaplarıyla yürür.
- Frontend cevap doğruluğunu kendi hesaplamaz.
- Recommendation save mevcut backend sözleşmesindeki per-item endpointi kullanır.
- Aktif quiz içinde normal çıkış aksiyonu sunulmaz.
- Tarayıcı kapanması/bağlantı kopması sonrasında cevaplanmayan soruların yanlış sayılması backend session finalization gerektirir.
- Difficulty backend requestine eklenene kadar UI'da gösterilmez.

## Demo referansından kaldırılan davranışlar

- User/Admin demo switcher
- 404/500 demo launcher
- See demo flow
- Fake notification listesi
- Fake import job ve provider log tabloları
- Back to User App
- Hard-coded kullanıcı ve admin kimlikleri
- Local state ile başarılı gösterilen API mutationları
