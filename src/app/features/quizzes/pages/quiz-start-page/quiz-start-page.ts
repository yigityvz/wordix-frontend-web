/** Bu dosya, backend tarafından desteklenen quiz ayarlarını gerçek start facade akışıyla birleştirir. */
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DeckFacade } from '@features/decks/facades/deck.facade';
import { Button } from '@shared/components/button/button';
import { Card } from '@shared/components/card/card';
import { ErrorState } from '@shared/components/error-state/error-state';
import { Spinner } from '@shared/components/spinner/spinner';

import { QuizFacade } from '../../facades/quiz.facade';
import {
  SupportedQuizContentMode,
  SupportedQuizSourceType,
  SupportedQuizType,
} from '../../models/quiz-request.models';

/** Form seçim butonlarında kullanılan salt-okunur label/value sözleşmesidir. */
interface QuizFormOption<TValue extends string> {
  readonly value: TValue;
  readonly label: string;
  readonly description: string;
}

/** Backend validatorının kabul ettiği quiz tipi seçenekleridir. */
const QUIZ_TYPE_OPTIONS: readonly QuizFormOption<SupportedQuizType>[] = [
  {
    value: 'Test',
    label: 'Multiple choice',
    description: 'Choose the correct answer from backend-generated options.',
  },
  {
    value: 'Writing',
    label: 'Writing',
    description: 'Type each answer and let the backend evaluate it.',
  },
];

/** Backend validatorının kabul ettiği canonical quiz kaynaklarıdır. */
const QUIZ_SOURCE_OPTIONS: readonly QuizFormOption<SupportedQuizSourceType>[] = [
  {
    value: 'UserDictionary',
    label: 'My dictionary',
    description: 'Practice from all eligible items saved in your dictionary.',
  },
  {
    value: 'Deck',
    label: 'A specific deck',
    description: 'Create the quiz from one of your real decks.',
  },
];

/** Backend validatorının kabul ettiği içerik modu seçenekleridir. */
const QUIZ_CONTENT_OPTIONS: readonly QuizFormOption<SupportedQuizContentMode>[] = [
  { value: 'Mixed', label: 'Mixed', description: 'Use every supported content type.' },
  { value: 'WordsOnly', label: 'Words', description: 'Use word items only.' },
  { value: 'PhrasesOnly', label: 'Phrases', description: 'Use phrase items only.' },
  {
    value: 'SentencesOnly',
    label: 'Sentences',
    description: 'Available only for writing quizzes.',
  },
];

/** Quiz start requestini desteklenmeyen demo alanları olmadan üreten protected route sayfasıdır. */
@Component({
  selector: 'wx-quiz-start-page',
  imports: [Button, Card, ErrorState, RouterLink, Spinner],
  templateUrl: './quiz-start-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizStartPage implements OnInit {
  /** Quiz session state ve gerçek start intentini facade üzerinden yönetir. */
  private readonly quizFacade = inject(QuizFacade);

  /** Gerçek session oluşturulduğunda kullanıcıyı canonical play route'una taşır. */
  private readonly router = inject(Router);

  /** Eski session state'inin kendiliğinden navigation üretmesini engelleyen local intent bayrağıdır. */
  private readonly startRequested = signal(false);

  /** Deck kaynak seçimi için gerçek authenticated collectionı facade üzerinden yönetir. */
  private readonly deckFacade = inject(DeckFacade);

  /** Kullanıcının seçtiği backend-supported quiz tipini local form state'inde tutar. */
  protected readonly quizType = signal<SupportedQuizType>('Test');

  /** Kullanıcının seçtiği backend-supported source tipini local form state'inde tutar. */
  protected readonly quizSourceType = signal<SupportedQuizSourceType>('UserDictionary');

  /** Kullanıcının seçtiği backend-supported content modunu local form state'inde tutar. */
  protected readonly quizContentMode = signal<SupportedQuizContentMode>('Mixed');

  /** Backend validatorının 1–20 aralığındaki soru sayısını local form state'inde tutar. */
  protected readonly questionCount = signal(10);

  /** Deck source için zorunlu canonical deck UUID değerini tutar. */
  protected readonly deckId = signal<string | null>(null);

  /** Backend start requestindeki gerçek recommendation bayrağını local form state'inde tutar. */
  protected readonly includeSystemRecommendations = signal(true);

  /** Template'in backend-supported quiz tipi seçeneklerini render etmesini sağlar. */
  protected readonly quizTypeOptions = QUIZ_TYPE_OPTIONS;

  /** Template'in backend-supported quiz source seçeneklerini render etmesini sağlar. */
  protected readonly quizSourceOptions = QUIZ_SOURCE_OPTIONS;

  /** Template'in backend-supported content seçeneklerini render etmesini sağlar. */
  protected readonly quizContentOptions = QUIZ_CONTENT_OPTIONS;

  /** Authenticated kullanıcının gerçek deck özetlerini source select alanına sunar. */
  protected readonly decks = this.deckFacade.decks;

  /** Deck collection loading durumunu yalnızca ilgili form alanına bağlar. */
  protected readonly areDecksLoading = this.deckFacade.isCollectionLoading;

  /** Deck collection hatasını gerçek retry yüzeyine bağlar. */
  protected readonly deckError = this.deckFacade.collectionError;

  /** Quiz start mutation loading durumunu bütün form kontrollerine bağlar. */
  protected readonly isStarting = this.quizFacade.isStarting;

  /** Normalize start API hatasını formun üst seviye hata yüzeyine bağlar. */
  protected readonly startError = this.quizFacade.sessionError;

  /** Backend tarafından gerçekten oluşturulan session sonucunu template'e sunar. */
  protected readonly session = this.quizFacade.session;

  /** Yalnızca bu sayfadan başlatılan başarılı session için play navigationını çalıştırır. */
  private readonly navigateToCreatedSession = effect(() => {
    const session = this.session();
    if (!this.startRequested() || this.quizFacade.sessionStatus() !== 'loaded' || !session) {
      return;
    }

    this.startRequested.set(false);
    void this.router.navigate(['/quizzes', session.quizSessionId, 'play']);
  });

  /** Deck zorunluluğu ve backend kombinasyon kurallarına göre form geçerliliğini türetir. */
  protected readonly isFormValid = computed(
    () =>
      this.questionCount() >= 1 &&
      this.questionCount() <= 20 &&
      !(this.quizType() === 'Test' && this.quizContentMode() === 'SentencesOnly') &&
      (this.quizSourceType() !== 'Deck' || !!this.deckId()),
  );

  /** Start route açıldığında eski session yoksa stale mutation mesajlarını temizler. */
  ngOnInit(): void {
    this.quizFacade.clear();
  }

  /** Quiz tipi değiştiğinde geçersiz Test + SentencesOnly kombinasyonunu Mixed'e çeker. */
  protected selectQuizType(value: SupportedQuizType): void {
    this.quizType.set(value);
    if (value === 'Test' && this.quizContentMode() === 'SentencesOnly') {
      this.quizContentMode.set('Mixed');
    }
  }

  /** Quiz kaynağını değiştirir ve Deck seçildiğinde gerçek collectionı gerektiğinde yükler. */
  protected selectQuizSource(value: SupportedQuizSourceType): void {
    this.quizSourceType.set(value);
    if (value !== 'Deck') {
      this.deckId.set(null);
      return;
    }

    if (this.deckFacade.collectionStatus() === 'idle') {
      this.deckFacade.loadCollection();
    }
  }

  /** Backend validatorıyla uyumlu content mode seçimini local form state'ine yazar. */
  protected selectContentMode(value: SupportedQuizContentMode): void {
    if (value !== 'SentencesOnly' || this.quizType() === 'Writing') {
      this.quizContentMode.set(value);
    }
  }

  /** Native select değerini boşsa null, doluysa canonical deck UUID olarak saklar. */
  protected selectDeck(value: string): void {
    this.deckId.set(value || null);
  }

  /** Range input değerini backend validatorının 1–20 sınırları içinde saklar. */
  protected setQuestionCount(value: number): void {
    this.questionCount.set(Math.min(20, Math.max(1, Math.round(value))));
  }

  /** Recommendation bayrağını gerçek start requesti için tersine çevirir. */
  protected toggleRecommendations(): void {
    this.includeSystemRecommendations.update((value) => !value);
  }

  /** Recoverable deck collection hatasında aynı gerçek requesti yeniden başlatır. */
  protected retryDecks(): void {
    this.deckFacade.loadCollection();
  }

  /** Geçerli form state'ini canonical StartQuizRequest olarak gerçek effecte gönderir. */
  protected startQuiz(): void {
    if (!this.isFormValid() || this.quizFacade.isStarting() || this.quizFacade.session()) {
      return;
    }

    this.startRequested.set(true);
    this.quizFacade.startQuiz({
      quizType: this.quizType(),
      quizSourceType: this.quizSourceType(),
      quizContentMode: this.quizContentMode(),
      questionCount: this.questionCount(),
      deckId: this.quizSourceType() === 'Deck' ? this.deckId() : null,
      includeSystemRecommendations: this.includeSystemRecommendations(),
    });
  }
}
