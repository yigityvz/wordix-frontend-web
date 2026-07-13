# F4B Faz Raporu — Bearer Token Interceptor

Bu rapor, protected Wordix API çağrılarına gerçek Keycloak access tokenının güvenli biçimde eklendiğini kaydeder.

Tarih: 2026-07-13

## Yapılan iş

- Functional bearer token interceptor eklendi.
- Token yalnızca environment içindeki Wordix API origin/path sınırına ekleniyor.
- Request öncesinde Keycloak token yenileme kontrolü yapılıyor.
- Oturum yoksa sahte Authorization header üretilmiyor.
- Refresh hatası request gönderilmeden authentication `ApiError` modeline dönüştürülüyor.
- Error ve auth interceptor sırası uygulama bootstrap'ında yapılandırıldı.

## Bu faz proje için neden önemli?

Tüm protected backend çağrılarının tokenı feature servislerinde tekrarlamadan taşımasını ve tokenın Keycloak ya da üçüncü taraf adreslerine sızmamasını sağlar.

## Dosyalar

- `src/app/core/interceptors/auth-token.interceptor.ts`
- `src/app/core/interceptors/auth-token.interceptor.spec.ts`
- `src/app/app.config.ts`

## Doğrulama

- Production build başarılı.
- 14 test dosyasında 35 test geçti.
- Production dependency audit sonucu: 0 vulnerability.
- Sıradaki faz: F4C.
