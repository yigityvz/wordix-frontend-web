/** Bu dosya, tek summary sorusunun backend tarafından hesaplanan cevap durumunu gösterir. */
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Badge } from '@shared/components/badge/badge';
import { QuizSummaryQuestion } from '../../models/quiz.models';

/** Summary question breakdown verisini değiştirmeden sunan reusable componenttir. */
@Component({
  selector: 'wx-quiz-summary-question',
  imports: [Badge],
  templateUrl: './quiz-summary-question.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizSummaryQuestionComponent {
  /** Backend summary responseundaki tek question sonucudur. */
  readonly question = input.required<QuizSummaryQuestion>();
  /** Nullable response time değerini kullanıcı dostu süreye dönüştürür. */
  protected formatResponseTime(milliseconds: number | null): string {
    if (milliseconds === null) return 'Not measured';
    if (milliseconds < 1000) return `${milliseconds} ms`;
    return `${(milliseconds / 1000).toFixed(1)} s`;
  }
}
