/** Bu dosya, authenticated kullanıcı dashboard'unu gerçek profile ve statistics state ile yönetir. */
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthFacade } from '@core/auth/auth.facade';
import { ErrorState } from '@shared/components/error-state/error-state';
import { Spinner } from '@shared/components/spinner/spinner';
import { ProfileFacade } from '../../../profile/facades/profile.facade';
import { StatisticsFacade } from '../../../statistics/facades/statistics.facade';

/** Dashboard özetini gerçek backend verileri ve çalışan route aksiyonlarıyla sunan standalone sayfadır. */
@Component({
  selector: 'wx-dashboard-page',
  imports: [ErrorState, RouterLink, Spinner],
  templateUrl: './dashboard-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage implements OnInit, OnDestroy {
  /** Current-user bilgisini gerçek profile endpointinden yönetir. */
  private readonly profileFacade = inject(ProfileFacade);

  /** Dashboard learning summary ve difficult item verilerini gerçek statistics endpointlerinden yönetir. */
  private readonly statisticsFacade = inject(StatisticsFacade);

  /** Gerçek Keycloak logout akışını başlatır. */
  private readonly authFacade = inject(AuthFacade);

  protected readonly profile = this.profileFacade.profile;
  protected readonly profileLoading = this.profileFacade.isLoading;
  protected readonly profileError = this.profileFacade.error;
  protected readonly summary = this.statisticsFacade.learningSummary;
  protected readonly summaryStatus = this.statisticsFacade.learningSummaryStatus;
  protected readonly summaryError = this.statisticsFacade.learningSummaryError;
  protected readonly difficultItems = this.statisticsFacade.difficultItems;
  protected readonly difficultStatus = this.statisticsFacade.difficultItemsStatus;
  protected readonly difficultError = this.statisticsFacade.difficultItemsError;

  /** Sayfa açılışında profile, learning summary ve ilk üç difficult item isteğini başlatır. */
  ngOnInit(): void {
    if (!this.profileFacade.isLoaded() && !this.profileFacade.isLoading()) {
      this.profileFacade.load();
    }

    this.statisticsFacade.loadLearningSummary();
    this.statisticsFacade.loadDifficultItems({
      pageNumber: 1,
      pageSize: 3,
      source: 'both',
      sortBy: 'confidenceAsc',
    });
  }

  /** Route kapanırken kullanıcıya özel dashboard statistics state'ini temizler. */
  ngOnDestroy(): void {
    this.statisticsFacade.clear();
  }

  /** Summary endpointinde hata olduğunda gerçek backend isteğini yeniden başlatır. */
  protected retrySummary(): void {
    this.statisticsFacade.loadLearningSummary();
  }

  /** Difficult items endpointinde hata olduğunda ilk üç öğeyi yeniden ister. */
  protected retryDifficultItems(): void {
    this.statisticsFacade.loadDifficultItems({
      pageNumber: 1,
      pageSize: 3,
      source: 'both',
      sortBy: 'confidenceAsc',
    });
  }

  /** Profile state'ini temizleyip gerçek Keycloak session sonlandırma akışını başlatır. */
  protected logout(): void {
    this.profileFacade.clear();
    this.statisticsFacade.clear();
    this.authFacade.logout();
  }

  /** Backend oranını dashboard üzerinde tutarlı tam yüzde metnine dönüştürür. */
  protected percentage(value: number): string {
    return Math.round(value) + '%';
  }

  /** Learning status adedini toplam aktif öğe içinde güvenli progress genişliğine dönüştürür. */
  protected progressPercentage(value: number, total: number): number {
    if (total <= 0) {
      return 0;
    }

    return Math.min(100, Math.max(0, Math.round((value / total) * 100)));
  }
}
