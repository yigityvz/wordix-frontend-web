# Angular API Client Core TypeScript Config Düzeltmesi

Bu rapor, library source ve test TypeScript configlerinin açık kaynak köküyle
çalışacak şekilde düzeltilmesini ve doğrulanmasını kaydeder.

## Değişiklik

- `projects/angular-api-client-core/tsconfig.lib.json` içine `rootDir: "./src"` eklendi.
- `projects/angular-api-client-core/tsconfig.spec.json` içine `rootDir: "./src"` eklendi.
- Library source, declaration ve test dosyalarının ortak kaynak sınırı açık hale getirildi.
- Uygulama kodu ve library çalışma davranışı değiştirilmedi.

## Doğrulama

- Her iki config için `tsc --noEmit`: başarılı.
- TypeScript project-reference dry build: başarılı.
- Library testleri: 2 dosya, 8 test başarılı.
- Angular library package build: başarılı.
