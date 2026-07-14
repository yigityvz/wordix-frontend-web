/**
 * Generic shell'in verilen başlık ve route listesini responsive navigation alanlarına aktardığını test eder.
 * User/admin shell'leri bu sözleşmeye güveneceği için composition davranışını korur.
 */
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthFacade } from '../../auth/auth.facade';
import { AppShell } from './app-shell';

describe('AppShell', () => {
  /** Aynı route'un masaüstü ve mobil navigation yüzeylerinde erişilebilir olduğunu doğrular. */
  it('verilen navigation kaydını masaüstü ve mobil alanlarda gösterir', async () => {
    // RouterLink directive'lerinin test ortamında gerçek Angular Router ile oluşması sağlanır.
    await TestBed.configureTestingModule({
      imports: [AppShell],
      providers: [
        provideRouter([]),
        {
          provide: AuthFacade,
          useValue: {
            user: signal({
              username: 'ali.yilmaz',
              email: 'ali@example.com',
              roles: ['basic_user'],
            }),
            logout: vi.fn(),
          },
        },
      ],
    }).compileComponents();

    // Test edilecek generic shell instance'ı oluşturulur.
    const fixture = TestBed.createComponent(AppShell);

    // Shell sahibinden gelecek sayfa başlığı simüle edilir.
    fixture.componentRef.setInput('pageTitle', 'Dashboard');

    // Tek bir izinli route verilerek iki navigation yüzeyine aktarım test edilir.
    fixture.componentRef.setInput('navigationItems', [
      { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    ]);

    // Signal input değişikliklerinin template'e yansıması için change detection çalıştırılır.
    fixture.detectChanges();

    // Navbar başlığının shell inputundan geldiği doğrulanır.
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Dashboard');

    // Aynı route'un sidebar ve mobile nav içinde iki kez erişilebilir olduğu doğrulanır.
    expect(fixture.nativeElement.querySelectorAll('a[href="/dashboard"]')).toHaveLength(2);
  });
});
