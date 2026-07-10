# Deferred Frontend Features

Bu belge frontend tamamlandıktan veya ilgili backend sözleşmesi yayımlandıktan sonra tekrar değerlendirilecek işleri tutar. Bu maddeler mevcut uygulamada Coming Soon badge, disabled sahte aksiyon veya mock sonuç olarak gösterilmez.

Son güncelleme: 2026-07-10

## Backend sözleşmesi bekleyenler

| Özellik | Beklenen bağımlılık | UI kararı |
|---|---|---|
| Quiz difficulty | `StartQuizRequest` difficulty alanı ve enum sözleşmesi | Şimdilik gösterme |
| Deck edit | Deck update endpointi | Şimdilik gösterme |
| Deck delete | Deck delete endpointi ve silme kuralları | Şimdilik gösterme |
| Kelimeyi bütün anlamlarıyla kaydetme | Save requestinin çoklu meaning desteği veya yeni backend davranışı | Mevcut tek-meaning sözleşmesi netleşene kadar beklet |
| Quiz abandonment/finalization | Session timeout, abandon veya server-side finalize kuralı | Aktif quizde çıkış gösterme |
| Notifications | Notification list/read/preferences endpointleri | Şimdilik gösterme |
| User streak | Güvenilir streak alanı/endpointi | Dashboardda gösterme |
| Popular searches | Basic user için yetkili endpoint | Lookup ekranında gösterme |
| Dictionary item quiz history | Item bazlı history endpointi | Detail ekranında gösterme |
| Admin Users Overview | Admin aggregate user analytics endpointi | Admin navigation'a ekleme |
| Admin System Health | Güvenli backend health/metrics endpointi | Admin navigation'a ekleme |
| Analytics export | Backend export endpointi veya onaylı client export sözleşmesi | Export butonu gösterme |

## Daha sonraki ürün değerlendirmesi

- Notification preferences
- Language and region preferences
- Default quiz preferences
- Spaced-repetition tuning preferences
- Workspace switching; mevcut karara göre gerekli değildir ve ancak yeni ürün kararıyla açılabilir

## Planlanmayan Figma demo özellikleri

Aşağıdakiler ertelenmiş özellik değil, mevcut kapsamdan çıkarılmış demo davranışlarıdır:

- Import job listesi ve canlı progress tablosu
- Import job retry
- Raw provider request logları
- Provider request retry
- Demo user/admin/404/500 switcher
- Back to User App
- See demo flow
