/** Bu dosya, gerçek admin dashboard aggregate ve preview analytics akışlarını yönetir. */
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthFacade } from '@core/auth/auth.facade';
import { ErrorState } from '@shared/components/error-state/error-state';
import { Spinner } from '@shared/components/spinner/spinner';
import { ProfileFacade } from '../../../profile/facades/profile.facade';
import { AdminAnalyticsFacade } from '../../facades/admin-analytics.facade';
import {
  createAdminDateRangeQuery,
  createAdminListQuery,
} from '../../mappers/admin-analytics-query.mapper';

/** Beş canlı admin endpointini production analytics landing ekranında birleştirir. */
@Component({
  selector: 'wx-admin-dashboard-page',
  imports: [ErrorState, RouterLink, Spinner],
  templateUrl: './admin-dashboard-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardPage implements OnInit {
  /** Admin analytics state ve intentlerini componentten izole eder. */
  private readonly facade = inject(AdminAnalyticsFacade);

  /** Güvenli admin kullanıcı adını profile endpointinden alır. */
  private readonly profileFacade = inject(ProfileFacade);

  /** Gerçek Keycloak logout akışını yönetir. */
  private readonly authFacade = inject(AuthFacade);

  protected readonly dateRangeDays = signal(30);
  protected readonly profile = this.profileFacade.profile;
  protected readonly dashboardStatus = this.facade.dashboardStatus;
  protected readonly dashboard = this.facade.dashboard;
  protected readonly dashboardError = this.facade.dashboardError;
  protected readonly topSearches = this.facade.topSearches;
  protected readonly topSaved = this.facade.topSaved;
  protected readonly mostWrong = this.facade.mostWrong;
  protected readonly providerStats = this.facade.providerStats;

  /** Sayfa açılışında profile ve beş gerçek admin analytics isteğini başlatır. */
  ngOnInit(): void {
    if (!this.profileFacade.isLoaded() && !this.profileFacade.isLoading()) {
      this.profileFacade.load();
    }

    this.loadAll();
  }

  /** Tarih filtresini değiştirip bütün dashboard endpointlerini yeniden çağırır. */
  protected selectDateRange(days: number): void {
    this.dateRangeDays.set(days);
    this.loadAll();
  }

  /** Dashboard aggregate hatasında bütün ilişkili preview verilerini yeniden ister. */
  protected retryDashboard(): void {
    this.loadAll();
  }

  /** Profile ve analytics state'ini temizleyip Keycloak logout yönlendirmesini başlatır. */
  protected logout(): void {
    this.profileFacade.clear();
    this.facade.clear();
    this.authFacade.logout();
  }

  /** Backend oranını tutarlı tam yüzde metnine dönüştürür. */
  protected percentage(value: number): string {
    return Math.round(value) + '%';
  }

  /** Backend millisecond değerini dashboard için okunabilir tam sayı metnine dönüştürür. */
  protected milliseconds(value: number): string {
    return Math.round(value) + ' ms';
  }

  /** Seçili tarih aralığıyla beş gerçek endpoint intentini birlikte gönderir. */
  private loadAll(): void {
    const range = createAdminDateRangeQuery(this.dateRangeDays());
    const listQuery = createAdminListQuery(this.dateRangeDays(), 5);
    this.facade.loadDashboard(range);
    this.facade.loadTopSearches(listQuery);
    this.facade.loadTopSaved(listQuery);
    this.facade.loadMostWrong(listQuery);
    this.facade.loadProviderStats(range);
  }
}
