/**
 * Shared modalın open state, Escape close ve erişilebilir dialog contractını test eder.
 * Feature dialoglarının ortak klavye davranışına güvenebilmesini sağlar.
 */
import { TestBed } from '@angular/core/testing';

import { Modal } from './modal';

describe('Modal', () => {
  /** Açık dialogda Escape tuşunun parenta tek kapanma niyeti yayınladığını doğrular. */
  it('Escape ile kapanma niyeti yayınlar', async () => {
    // Standalone modal component strict template ile test ortamında derlenir.
    await TestBed.configureTestingModule({ imports: [Modal] }).compileComponents();

    // Zorunlu title ve open inputları verilen modal instance'ı oluşturulur.
    const fixture = TestBed.createComponent(Modal);
    fixture.componentRef.setInput('title', 'Confirm action');
    fixture.componentRef.setInput('open', true);

    // Kapanma outputunun kaç kez yayınlandığı deterministik sayaçla izlenir.
    let closeCount = 0;
    fixture.componentInstance.closed.subscribe(() => closeCount++);

    // Dialog DOM'a eklendikten sonra document seviyesinde Escape eventi simüle edilir.
    fixture.detectChanges();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    // Escape tuşunun parenta yalnızca bir close intenti ilettiği doğrulanır.
    expect(closeCount).toBe(1);

    // Render edilen yüzeyin screen reader tarafından dialog olarak algılandığı doğrulanır.
    expect(fixture.nativeElement.querySelector('[role="dialog"]')).not.toBeNull();
  });
});
