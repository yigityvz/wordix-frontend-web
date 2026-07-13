# F3C Faz Raporu — Merkezi HTTP Hata Yönetimi

Bu rapor, HTTP ve runtime hatalarının ortak `ApiError` modeline dönüştürüldüğünü kaydeder.

Tarih: 2026-07-13

## Yapılan iş

- Network, validation, business, authentication, authorization, not-found, server ve unknown hata türleri tanımlandı.
- Backend `traceId`, `errorCode`, detail ve validation alanlarını koruyan mapper eklendi.
- Functional error interceptor uygulama bootstrap'ına bağlandı.
- Mapper ve interceptor testleri eklendi.

## Bu faz proje için neden önemli?

Feature, form ve auth akışlarının ham `HttpErrorResponse` yerine aynı güvenli hata sözleşmesini tüketmesini sağlar.

## Dosyalar

- `src/app/core/errors/*`
- `src/app/core/interceptors/api-error.interceptor*`
- `src/app/app.config.ts`

## Doğrulama

- Production build başarılı.
- Faz sonunda 11 test dosyasında 25 test geçti.
- Sıradaki faz: F3D.
