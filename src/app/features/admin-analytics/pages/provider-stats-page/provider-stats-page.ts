/** Bu dosya, provider stats ekranının gerçek tarih filtresi ve lifecycle state'ini yönetir. */
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ErrorState } from '@shared/components/error-state/error-state';
import { Spinner } from '@shared/components/spinner/spinner';
import { AdminAnalyticsFacade } from '../../facades/admin-analytics.facade';
import { createAdminDateRangeQuery } from '../../mappers/admin-analytics-query.mapper';

/** Provider, cache ve import metriklerini canlı admin endpointinden sunar. */
@Component({
  selector: 'wx-provider-stats-page',
  imports: [ErrorState, Spinner],
  templateUrl: './provider-stats-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProviderStatsPage implements OnInit {
  /** State ve backend intentlerini facade üzerinden yönetir. */
  private readonly facade = inject(AdminAnalyticsFacade);
  protected readonly dateRangeDays = signal(30);
  protected readonly status = this.facade.providerStatsStatus;
  protected readonly analytics = this.facade.providerStats;
  protected readonly error = this.facade.providerStatsError;

  /** Sayfa açılışında gerçek provider-stats endpointini çağırır. */
  ngOnInit(): void {
    this.load();
  }

  /** Tarih filtresini değiştirip backend sorgusunu yeniler. */
  protected selectDateRange(days: number): void {
    this.dateRangeDays.set(days);
    this.load();
  }

  /** Mevcut tarih filtresiyle gerçek provider-stats isteğini gönderir. */
  protected load(): void {
    this.facade.loadProviderStats(createAdminDateRangeQuery(this.dateRangeDays()));
  }

  /** Backend response süresini okunabilir millisecond metnine dönüştürür. */
  protected milliseconds(value: number): string {
    return Math.round(value) + ' ms';
  }
}
