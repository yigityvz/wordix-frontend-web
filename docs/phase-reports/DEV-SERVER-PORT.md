# Development Server Port Sabitlemesi

Bu rapor, Wordix geliştirme sunucusunun Keycloak redirect ayarlarıyla uyumlu olacak şekilde `http://localhost:4200` adresine sabitlenmesini kaydeder.

## Yapılanlar

- `npm start` komutuna açık `localhost` hostu ve `4200` portu eklendi.
- Ekrandaki rastgele portun Wordix uygulamasına değil, Vitest watch sunucusuna ait olduğu doğrulandı.
- Port değişikliğinden sonra format, test ve build kontrolleri çalıştırıldı.

## Kullanım

```powershell
npm.cmd start
```

Uygulama `http://localhost:4200` adresinden açılır. `npm.cmd test` ise uygulamayı başlatmaz; unit testleri çalıştırır ve geçici bir test portu kullanabilir.
