/** Bu dosya, most wrong analytics ekranının gerçek tarih filtresi ve lifecycle state'ini yönetir. */
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ErrorState } from '@shared/components/error-state/error-state';
import { Spinner } from '@shared/components/spinner/spinner';
import { AdminAnalyticsFacade } from '../../facades/admin-analytics.facade';
import { createAdminListQuery } from '../../mappers/admin-analytics-query.mapper';

/** En çok yanlış cevaplanan learning itemları canlı admin endpointinden sunar. */
@Component({ selector: 'wx-most-wrong-page', imports: [ErrorState, Spinner], templateUrl: './most-wrong-page.html', changeDetection: ChangeDetectionStrategy.OnPush })
export class MostWrongPage implements OnInit {
  /** State ve backend intentlerini facade üzerinden yönetir. */
  private readonly facade = inject(AdminAnalyticsFacade);
  protected readonly dateRangeDays = signal(30);
  protected readonly status = this.facade.mostWrongStatus;
  protected readonly analytics = this.facade.mostWrong;
  protected readonly error = this.facade.mostWrongError;

  /** Sayfa açılışında canonical limit ile gerçek endpointi çağırır. */
  ngOnInit(): void { this.load(); }

  /** Tarih filtresini değiştirip backend sorgusunu yeniler. */
  protected selectDateRange(days: number): void { this.dateRangeDays.set(days); this.load(); }

  /** Mevcut tarih filtresiyle gerçek most-wrong isteğini gönderir. */
  protected load(): void { this.facade.loadMostWrong(createAdminListQuery(this.dateRangeDays(), 20)); }

  /** Backend oranını okunabilir tam yüzde metnine dönüştürür. */
  protected percentage(value: number): string { return Math.round(value) + '%'; }

  /** Backend response süresini okunabilir millisecond metnine dönüştürür. */
  protected milliseconds(value: number): string { return Math.round(value) + ' ms'; }
}
