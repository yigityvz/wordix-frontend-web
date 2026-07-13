/** Bu dosya, lookup metni validationı ve submit/clear kullanıcı niyetlerini yöneten feature formudur. */
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { Button } from '@shared/components/button/button';
import { Input } from '@shared/components/input/input';

/** HTTP veya NgRx bilmeden yalnızca geçerli arama metnini parent sayfaya ileten standalone formdur. */
@Component({
  selector: 'wx-lookup-search-form',
  imports: [Button, Input],
  templateUrl: './lookup-search-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LookupSearchForm {
  /** Parent API requesti sürerken input ve tekrar submit etkileşimini kapatır. */
  readonly loading = input(false);

  /** Trim edilmiş ve boş olmadığı doğrulanmış lookup metnini parent sayfaya iletir. */
  readonly search = output<string>();

  /** Kullanıcı formu temizlediğinde owning page'in feature state'i sıfırlamasını ister. */
  readonly cleared = output<void>();

  /** Native inputun controlled güncel metin değerini tutar. */
  protected readonly query = signal('');

  /** Boş submit durumunda inputla ilişkili erişilebilir validation mesajını tutar. */
  protected readonly validationError = signal<string | undefined>(undefined);

  /** Input değişikliğini local form state'e yazıp eski validation hatasını temizler. */
  protected updateQuery(value: string): void {
    this.query.set(value);
    this.validationError.set(undefined);
  }

  /** Native form submitini doğrulayıp geçerli metni search outputuna dönüştürür. */
  protected submitSearch(event: Event): void {
    event.preventDefault();
    const query = this.query().trim();

    // Boş metnin backend'e gereksiz validation requesti olarak gitmesini engeller.
    if (!query) {
      this.validationError.set('Please enter a word, phrase, or sentence.');
      return;
    }

    this.search.emit(query);
  }

  /** Input, validation ve mevcut lookup sonucunu tek kullanıcı aksiyonuyla temizler. */
  protected clearSearch(): void {
    this.query.set('');
    this.validationError.set(undefined);
    this.cleared.emit();
  }
}
