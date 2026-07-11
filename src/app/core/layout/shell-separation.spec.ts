/**
 * User ve admin shell navigation listelerinin birbirine sızmadığını test eder.
 * Authorization guardları eklenmeden önce bile presentation route sahipliğinin ayrı kalmasını güvenceye alır.
 */
import { Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AdminShell } from './admin-shell/admin-shell';
import { UserShell } from './user-shell/user-shell';

describe('Shell navigation ayrımı', () => {
  /** Her shell için tekrar kullanılan Angular test ortamını ve component fixture'ını oluşturur. */
  async function createShell<T>(component: Type<T>): Promise<ComponentFixture<T>> {
    // RouterLink ve RouterLinkActive directive'leri gerçek router provider ile derlenir.
    await TestBed.configureTestingModule({
      imports: [component],
      providers: [provideRouter([])],
    }).compileComponents();

    // İstenen shell componentinin izole test instance'ı oluşturulur.
    const fixture = TestBed.createComponent(component);

    // Nested app-shell ve navigation linklerinin render edilmesi için change detection çalıştırılır.
    fixture.detectChanges();

    // Test assertionlarında DOM'a erişim için hazır fixture döndürülür.
    return fixture;
  }

  /** Basic user shell içinde admin analytics bağlantısı bulunmadığını doğrular. */
  it('user shell içinde admin route göstermez', async () => {
    // Yalnızca user navigation sahibi olan shell render edilir.
    const fixture = await createShell(UserShell);

    // Dashboard route'unun masaüstü ve mobil yüzeylerde bulunduğu doğrulanır.
    expect(fixture.nativeElement.querySelectorAll('a[href="/dashboard"]')).toHaveLength(2);

    // Admin namespace altında hiçbir link user DOM'una sızmamalıdır.
    expect(fixture.nativeElement.querySelector('a[href^="/admin"]')).toBeNull();
  });

  /** Admin shell içinde user dashboard ve user navigation bağlantıları bulunmadığını doğrular. */
  it('admin shell içinde user route göstermez', async () => {
    // Yalnızca admin analytics navigation sahibi olan shell render edilir.
    const fixture = await createShell(AdminShell);

    // Admin dashboard route'unun masaüstü ve mobil yüzeylerde bulunduğu doğrulanır.
    expect(fixture.nativeElement.querySelectorAll('a[href="/admin/dashboard"]')).toHaveLength(2);

    // Basic user dashboard route'u admin DOM'unda bulunmamalıdır.
    expect(fixture.nativeElement.querySelector('a[href="/dashboard"]')).toBeNull();
  });
});
