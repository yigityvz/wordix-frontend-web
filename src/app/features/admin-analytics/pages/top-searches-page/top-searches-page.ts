/** Bu dosya, top searches analytics ekranının gerçek tarih filtresi ve lifecycle state'ini yönetir. */
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ErrorState } from '@shared/components/error-state/error-state';
import { Spinner } from '@shared/components/spinner/spinner';
import { AdminAnalyticsFacade } from '../../facades/admin-analytics.facade';
import { createAdminListQuery } from '../../mappers/admin-analytics-query.mapper';

/** En çok aranan sorguları canlı admin endpointinden sunar. */
@Component({ selector: 'wx-top-searches-page', imports: [ErrorState, Spinner], templateUrl: './top-searches-page.html', changeDetection: ChangeDetectionStrategy.OnPush })
export class TopSearchesPage implements OnInit {
  /** State ve backend intentlerini facade üzerinden yönetir. */
  private readonly facade = inject(AdminAnalyticsFacade);
  protected readonly dateRangeDays = signal(30);
  protected readonly status = this.facade.topSearchesStatus;
  protected readonly analytics = this.facade.topSearches;
  protected readonly error = this.facade.topSearchesError;

  /** Sayfa açılışında canonical limit ile gerçek endpointi çağırır. */
  ngOnInit(): void { this.load(); }

  /** Tarih filtresini değiştirip backend sorgusunu yeniler. */
  protected selectDateRange(days: number): void { this.dateRangeDays.set(days); this.load(); }

  /** Mevcut tarih filtresiyle gerçek top-searches isteğini gönderir. */
  protected load(): void { this.facade.loadTopSearches(createAdminListQuery(this.dateRangeDays(), 20)); }
}
