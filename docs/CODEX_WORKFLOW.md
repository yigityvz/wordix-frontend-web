# Wordix Codex Workflow

Bu çalışma biçimi faz bazlı ilerlemeyi ve kullanıcı onayını zorunlu tutar.

## Her fazdan önce

1. `AGENTS.md` ve fazla doğrudan ilgili canonical dokümanları oku.
2. API işi varsa canlı Swagger/OpenAPI sözleşmesini kontrol et.
3. Mevcut worktree durumunu kontrol et ve kullanıcı değişikliklerini koru.
4. Kullanıcıya şunları sun:
   - Fazın amacı
   - Yapılacak işler
   - Değişecek/eklenecek dosyalar
   - Kapsam dışı işler
   - Kabul kriterleri
5. Açık kullanıcı onayı olmadan uygulamaya başlama.

## Faz uygulanırken

- Yalnızca onaylanan faz kapsamını değiştir.
- Route, request DTO, response DTO veya enum tahmin etme.
- Backend ile plan çelişirse backend sözleşmesini esas al ve farkı raporla.
- Componentten doğrudan API çağrısı yapma.
- Fake success, mock production data ve demo navigation ekleme.
- Backend desteği olmayan özelliği Coming Soon veya çalışıyormuş gibi UI'ya koyma.
- Kullanıcıya ait mevcut dosya/değişiklikleri geri alma.
- Yeni kalıcı ürün kararı gerekmiyorsa canonical dokümanları rutin olarak güncelleme.
- Uzun süren çalışmada kısa ilerleme bilgisi ver.

## Faz doğrulaması

Risk ve mevcut araç zincirine göre:

```text
format/lint
typecheck
unit tests
build
targeted smoke checks
git diff --check
```

Bir komut yoksa veya henüz proje kurulmadıysa bunu açıkça belirt; varmış gibi raporlama.

## Faz sonunda kullanıcıya verilecek kısa rapor

```text
Faz:
Yapılan iş:
Değişen dosyalar:
Eklenen/silinen dosyalar:
Çalıştırılan komutlar:
Build sonucu:
Test sonucu:
Backend doğrulaması:
Riskler/açık bağımlılıklar:
Sıradaki faz:
```

Ayrı faz raporu dosyası yalnızca kullanıcı özellikle isterse oluşturulur. Normal durumda sohbet içindeki kısa rapor yeterlidir.

## Swagger çalışma kuralı

API içeren her fazda:

1. `http://localhost:5000/swagger/v1/swagger.json` okunur.
2. İlgili path/method doğrulanır.
3. Request/response schema isimleri doğrulanır.
4. Path/query parametreleri doğrulanır.
5. 400/401/403/404/500 davranışları UI stateine eşlenir.
6. Ownership alanlarının requeste eklenmediği kontrol edilir.

Swagger erişilemiyorsa endpoint implementasyonu varsayımla tamamlanmaz; kullanıcıya blocker bildirilir.

## Tasarım çalışma kuralı

UI fazlarında şu sıra izlenir:

1. İlgili dark screenshotları incele.
2. React referansındaki sayfa/component yapısını oku.
3. `index.css` semantic tokenlarını incele.
4. UI'yı Angular + Tailwind ile yeniden kur.
5. Light, dark ve system davranışını birlikte doğrula.
6. Loading, empty, error, disabled ve responsive durumlarını doğrula.
7. React demo davranışlarını kopyalamadığını kontrol et.

## Git güvenliği

- Branch oluşturma, stage, commit, push veya PR yalnızca kullanıcı talebiyle yapılır.
- `git reset --hard` veya kullanıcı değişikliğini silen checkout kullanılmaz.
- İlgisiz dirty değişiklikler korunur.
- Faz sonunda çalışma ağacı ve değişen dosya kapsamı raporlanır.

## Onay döngüsü

Bir faz tamamlandığında Codex sonraki fazın planını sunar ve durur. Kullanıcının yeni onayı olmadan sonraki faza geçmez.
