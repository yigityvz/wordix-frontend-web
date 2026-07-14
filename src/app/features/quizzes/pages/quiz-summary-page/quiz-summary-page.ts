/** Bu dosya, quiz summary route'unu gerçek backend aggregate ve question breakdown verisine bağlar. */
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Badge } from '@shared/components/badge/badge';
import { Button } from '@shared/components/button/button';
import { Card } from '@shared/components/card/card';
import { ErrorState } from '@shared/components/error-state/error-state';
import { Spinner } from '@shared/components/spinner/spinner';
import { QuizSummaryQuestionComponent } from '../../components/quiz-summary-question/quiz-summary-question';
import { QuizFacade } from '../../facades/quiz.facade';

/** Ownership kontrollü summary endpointinin gerçek sonuç ekranıdır. */
@Component({
  selector: 'wx-quiz-summary-page',
  imports: [Badge, Card, ErrorState, QuizSummaryQuestionComponent, RouterLink, Spinner],
  templateUrl: './quiz-summary-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizSummaryPage implements OnInit, OnDestroy {
  /** Canonical session UUID'sini route paramından okur. */
  private readonly route = inject(ActivatedRoute);
  /** Summary read lifecycleını facade üzerinden yönetir. */
  private readonly quizFacade = inject(QuizFacade);
  /** Endpoint çağrısında kullanılacak route session kimliğidir. */
  protected readonly quizSessionId = this.route.snapshot.paramMap.get('quizSessionId') ?? '';
  /** Summary loading durumunu template'e sunar. */
  protected readonly isLoading = this.quizFacade.isSummaryLoading;
  /** Normalize summary hatasını retry yüzeyine sunar. */
  protected readonly error = this.quizFacade.summaryError;
  /** Yalnızca route UUID'siyle eşleşen backend summary sonucunu seçer. */
  protected readonly summary = computed(() => {
    const value = this.quizFacade.summary();
    return value?.quizSessionId === this.quizSessionId ? value : null;
  });

  /** Route açıldığında stale summary state'ini temizleyip gerçek GET isteğini başlatır. */
  ngOnInit(): void {
    this.loadSummary();
  }
  /** Route kapanırken başka sessiona summary sızmasını engeller. */
  ngOnDestroy(): void {
    this.quizFacade.clearSummary();
  }
  /** İlk yükleme ve retry için aynı gerçek summary requestini dispatch eder. */
  protected loadSummary(): void {
    if (!this.quizSessionId || this.quizFacade.isSummaryLoading()) return;
    this.quizFacade.clearSummary();
    this.quizFacade.loadSummary(this.quizSessionId);
  }
  /** Backend oranını güvenli yüzde metnine dönüştürür. */
  protected formatRate(rate: number): string {
    return `${Math.max(0, Math.min(100, rate)).toFixed(0)}%`;
  }
  /** Nullable milisaniye değerini okunabilir süreye dönüştürür. */
  protected formatDuration(milliseconds: number | null): string {
    if (milliseconds === null) return '—';
    if (milliseconds < 1000) return `${milliseconds} ms`;
    return `${(milliseconds / 1000).toFixed(1)} s`;
  }
}
