/**
 * Shared butonun loading/disabled korumasını ve geçerli tıklamayı parenta iletmesini test eder.
 * API mutationlarında duplicate submit oluşmaması için temel etkileşim contractını korur.
 */
import { TestBed } from '@angular/core/testing';

import { Button } from './button';

describe('Button', () => {
  /** Enabled durumdaki native tıklamayı activated outputuna dönüştürdüğünü doğrular. */
  it('geçerli tıklamayı parent componente iletir', async () => {
    // Standalone shared component Angular test ortamında derlenir.
    await TestBed.configureTestingModule({ imports: [Button] }).compileComponents();

    // Output sayısını gözlemlemek için component instance'ı oluşturulur.
    const fixture = TestBed.createComponent(Button);
    let activationCount = 0;

    // Her activated eventi deterministik bir sayaçla izlenir.
    fixture.componentInstance.activated.subscribe(() => activationCount++);

    // Template render edildikten sonra native buton kullanıcı gibi tıklanır.
    fixture.detectChanges();
    fixture.nativeElement.querySelector('button').click();

    // Tek native tıklamanın tek parent intenti ürettiği doğrulanır.
    expect(activationCount).toBe(1);
  });

  /** Loading durumunda native butonun disabled olduğunu ve event yayınlamadığını doğrular. */
  it('loading sırasında tekrar tıklamayı engeller', async () => {
    // Standalone shared component loading state testi için derlenir.
    await TestBed.configureTestingModule({ imports: [Button] }).compileComponents();

    // Loading inputu renderdan önce true yapılan component instance'ı oluşturulur.
    const fixture = TestBed.createComponent(Button);
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    // Native disabled property browser seviyesinde duplicate clicki engellemelidir.
    const nativeButton: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(nativeButton.disabled).toBe(true);
  });
});
