/**
 * Onay ve düzenleme akışları için erişilebilir dialog yüzeyi sunar.
 * Focus'u dialog içinde tutar, Escape ile kapanma niyeti yayınlar ve business kararını parenta bırakır.
 */
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  effect,
  input,
  output,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'wx-modal',
  templateUrl: './modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Modal {
  /** Parent stateine göre dialogun DOM'da görünür olup olmadığını belirler. */
  readonly open = input(false);

  /** Dialog başlığını erişilebilir isim olarak kullanır. */
  readonly title = input.required<string>();

  /** Backdrop tıklamasının kapanma niyeti üretip üretmeyeceğini belirler. */
  readonly closeOnBackdrop = input(true);

  /** Kullanıcı dialogu kapatmak istediğinde parent state sahibine bildirim yapar. */
  readonly closed = output<void>();

  /** Render edilen dialog paneline focus yönetimi için erişim sağlar. */
  private readonly dialogPanel = viewChild<ElementRef<HTMLElement>>('dialogPanel');

  constructor() {
    // Open signalı her değiştiğinde dialogun yeni açılıp açılmadığı izlenir.
    effect(() => {
      // Kapalı dialog için focus işlemi yapılmaz.
      if (!this.open()) {
        return;
      }

      // Angular yeni paneli DOM'a ekledikten sonra ilk focusable elemente focus taşınır.
      queueMicrotask(() => this.focusFirstElement());
    });
  }

  /** Escape ve Tab tuşlarını dialog açıkken merkezi olarak yönetir. */
  @HostListener('document:keydown', ['$event'])
  protected handleDocumentKeydown(event: KeyboardEvent): void {
    // Kapalı dialog global klavye eventlerini etkilemez.
    if (!this.open()) {
      return;
    }

    // Escape kullanıcının dialogu kapatma niyetini parenta bildirir.
    if (event.key === 'Escape') {
      event.preventDefault();
      this.requestClose();
      return;
    }

    // Tab dışındaki tuşlar focus trap mantığına girmez.
    if (event.key !== 'Tab') {
      return;
    }

    // Klavye odağını dialog sınırları içinde tutar.
    this.trapFocus(event);
  }

  /** Close butonu veya Escape tarafından paylaşılan kapanma niyetini yayınlar. */
  protected requestClose(): void {
    // Dialog kendi open stateini değiştirmez; tek state sahibi parent componenttir.
    this.closed.emit();
  }

  /** Backdrop tıklamasını parent tarafından izin verildiyse kapanma niyetine dönüştürür. */
  protected handleBackdropClick(): void {
    // Kritik akışlar parent tarafından backdrop kapanmasına karşı korunabilir.
    if (!this.closeOnBackdrop()) {
      return;
    }

    // İzin verilen backdrop tıklaması normal close eventi üretir.
    this.requestClose();
  }

  /** Dialog açıldığında ilk interactive elemente, yoksa panelin kendisine focus verir. */
  private focusFirstElement(): void {
    // Panel henüz render edilmediyse focus işlemi güvenli biçimde sonlandırılır.
    const panel = this.dialogPanel()?.nativeElement;
    if (!panel) {
      return;
    }

    // Ortak selector dialog içindeki klavye ile erişilebilir elementleri bulur.
    const firstFocusable = this.getFocusableElements(panel)[0];

    // Interactive eleman yoksa role=dialog paneli fallback focus hedefi olur.
    (firstFocusable ?? panel).focus();
  }

  /** Tab ve Shift+Tab dolaşımını ilk/son focusable element arasında döngüye alır. */
  private trapFocus(event: KeyboardEvent): void {
    // Focus trap yalnızca mevcut dialog paneli üzerinde hesaplanır.
    const panel = this.dialogPanel()?.nativeElement;
    if (!panel) {
      return;
    }

    // Disabled olmayan ve klavye odağı alabilen tüm elementler sıralı olarak alınır.
    const focusableElements = this.getFocusableElements(panel);
    if (focusableElements.length === 0) {
      event.preventDefault();
      panel.focus();
      return;
    }

    // Döngünün sınırları için ilk ve son element ayrı tutulur.
    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    // Shift+Tab ilk elementteyken focus son elemana sarılır.
    if (event.shiftKey && activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    // Normal Tab son elementteyken focus ilk elemana sarılır.
    if (!event.shiftKey && activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  /** Panel içindeki görünür ve enabled klavye hedeflerini DOM sırasıyla döndürür. */
  private getFocusableElements(panel: HTMLElement): HTMLElement[] {
    // Selector native interactive elementleri ve explicit tabindex hedeflerini kapsar.
    const selector =
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    // NodeList typesafe HTMLElement dizisine dönüştürülür.
    return Array.from(panel.querySelectorAll<HTMLElement>(selector));
  }
}
