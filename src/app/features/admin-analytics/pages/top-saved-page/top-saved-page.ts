/** Bu dosya, top saved analytics ekranının gerçek tarih filtresi ve lifecycle state'ini yönetir. */
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ErrorState } from '@shared/components/error-state/error-state';
import { Spinner } from '@shared/components/spinner/spinner';
import { AdminAnalyticsFacade } from '../../facades/admin-analytics.facade';
import { createAdminListQuery } from '../../mappers/admin-analytics-query.mapper';

/** En çok kaydedilen learning itemları canlı admin endpointinden sunar. */
@Component({ selector: 'wx-top-saved-page', imports: [ErrorState, Spinner], templateUrl: './top-saved-page.html', changeDetection: ChangeDetectionStrategy.OnPush })
export class TopSavedPage implements OnInit {
  /** State ve backend intentlerini facade üzerinden yönetir. */
  private readonly facade = inject(AdminAnalyticsFacade);
  protected readonly dateRangeDays = signal(30);
  protected readonly status = this.facade.topSavedStatus;
  protected readonly analytics = this.facade.topSaved;
  protected readonly error = this.facade.topSavedError;

  /** Sayfa açılışında canonical limit ile gerçek endpointi çağırır. */
  ngOnInit(): void { this.load(); }

  /** Tarih filtresini değiştirip backend sorgusunu yeniler. */
  protected selectDateRange(days: number): void { this.dateRangeDays.set(days); this.load(); }

  /** Mevcut tarih filtresiyle gerçek top-saved isteğini gönderir. */
  protected load(): void { this.facade.loadTopSaved(createAdminListQuery(this.dateRangeDays(), 20)); }
}
