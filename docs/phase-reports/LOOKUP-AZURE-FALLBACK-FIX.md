# Lookup Azure Fallback Yapılandırma Düzeltmesi

Bu rapor, database miss sonrasında Azure Translator fallback akışının neden 404 ürettiğini ve Docker geliştirme ortamında yapılan güvenli yapılandırma düzeltmesini kaydeder.

## Kök neden

- Frontend kelime, phrase ve sentence metinlerini doğru `POST /api/lookups` sözleşmesiyle gönderiyordu.
- Backend önce Word/Phrase için database lookup yapıyor, miss durumunda Azure adapterını çağırıyordu.
- `ProviderRequestLogs` kayıtlarında `MISSING_SUBSCRIPTION_KEY` hatası bulundu.
- Azure değerleri .NET user-secrets içinde bulunmasına rağmen Docker `wordix-api` containerına aktarılmıyordu.

## Yapılanlar

- Backend `docker-compose.yml` içine Azure Translator option environment mappingleri eklendi.
- Gerçek değer içermeyen `.env.example` oluşturuldu ve takip edilebilir olması için `.gitignore` kuralı düzeltildi.
- Gerçek Azure key, region ve endpoint yalnız Git-ignored backend `.env` dosyasına aktarıldı.
- `wordix-api` containerı yalnız `.env` kullanılarak yeniden oluşturuldu.

## Güvenlik doğrulaması

- Backend `.env` dosyası Git tarafından ignore ediliyor.
- `.env` tracked değil ve `git status` çıktısında görünmüyor.
- Gerçek Azure anahtarı mevcut tracked dosyalarda ve Git geçmişinde bulunmuyor.
- Bu görev sırasında commit veya push yapılmadı.
- Secret yalnız local user-secrets, local `.env` ve çalışan local Docker container environmentında bulunuyor.

## Davranış doğrulaması

- Gerçek Azure çağrısı Word, Phrase ve Sentence metinleri için başarılı oldu.
- Database içinde bulunan Word/Phrase kayıtlarının provider çağrısından önce döndüğü backend akışında doğrulandı.
- Database miss olan Word/Phrase sonuçları global kataloğa kaydedilir.
- Sentence lookup sonucu geçici döner; kalıcı kayıt kullanıcı dictionary save akışında oluşturulur.
- Swagger yeniden oluşturulan container sonrasında HTTP 200 döndü.

## Build ve test

- Backend Release build başarılı: 0 hata, mevcut Swagger production uyarısı dışında 1 uyarı.
- Backend test projeleri çalıştırıldı ancak repository içinde keşfedilebilir test bulunmadığı raporlandı.
- Frontend format kontrolü başarılı.
- Frontend 69 test dosyasında 223 test başarılı.
- Base API Client Core ve Wordix production buildleri başarılı.
