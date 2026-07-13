/** Bu dosya, admin dashboard'un beş gerçek endpoint intentini ve logout akışını doğrular. */
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthFacade } from '@core/auth/auth.facade';
import { describe, expect, it, vi } from 'vitest';
import { ProfileFacade } from '../../../profile/facades/profile.facade';
import { AdminAnalyticsFacade } from '../../facades/admin-analytics.facade';
import { AdminDashboardPage } from './admin-dashboard-page';

/** Facade mocklarıyla admin landing lifecycle davranışını izole sınar. */
describe('AdminDashboardPage', () => {
  /** Sayfa açılışında profile ve beş analytics endpoint intentini gönderir. */
  it('loads all live admin analytics sources', async () => {
    const profileFacade = {
      profile: signal(null),
      isLoaded: signal(false),
      isLoading: signal(false),
      load: vi.fn(),
      clear: vi.fn(),
    };
    const adminFacade = {
      dashboardStatus: signal('loading'),
      dashboard: signal(null),
      dashboardError: signal(null),
      topSearches: signal(null),
      topSaved: signal(null),
      mostWrong: signal(null),
      providerStats: signal(null),
      loadDashboard: vi.fn(),
      loadTopSearches: vi.fn(),
      loadTopSaved: vi.fn(),
      loadMostWrong: vi.fn(),
      loadProviderStats: vi.fn(),
      clear: vi.fn(),
    };
    const authFacade = { logout: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [AdminDashboardPage],
      providers: [
        provideRouter([]),
        { provide: ProfileFacade, useValue: profileFacade },
        { provide: AdminAnalyticsFacade, useValue: adminFacade },
        { provide: AuthFacade, useValue: authFacade },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdminDashboardPage);
    fixture.detectChanges();

    expect(profileFacade.load).toHaveBeenCalledOnce();
    expect(adminFacade.loadDashboard).toHaveBeenCalledOnce();
    expect(adminFacade.loadTopSearches).toHaveBeenCalledOnce();
    expect(adminFacade.loadTopSaved).toHaveBeenCalledOnce();
    expect(adminFacade.loadMostWrong).toHaveBeenCalledOnce();
    expect(adminFacade.loadProviderStats).toHaveBeenCalledOnce();
  });
});
