/** Bu dosya, quiz start sayfasının backend-supported seçeneklerden canonical request ürettiğini doğrular. */
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { DeckFacade } from '@features/decks/facades/deck.facade';
import { Button } from '@shared/components/button/button';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { QuizFacade } from '../../facades/quiz.facade';
import { QuizStartPage } from './quiz-start-page';

/** Page formunun demo alanı üretmediğini ve facade request sınırını koruduğunu sınar. */
describe('QuizStartPage', () => {
  /** Her testte standalone start page fixture'ını tutar. */
  let fixture: ComponentFixture<QuizStartPage>;
  const startQuiz = vi.fn();
  const clear = vi.fn();
  const loadCollection = vi.fn();
  const collectionStatus = signal<'idle' | 'loading' | 'loaded' | 'error'>('idle');

  /** Her testte boş mutation state ve kontrollü facade mocklarıyla sayfayı oluşturur. */
  beforeEach(() => {
    startQuiz.mockClear();
    clear.mockClear();
    loadCollection.mockClear();
    collectionStatus.set('idle');

    TestBed.configureTestingModule({
      imports: [QuizStartPage],
      providers: [
        provideRouter([]),
        {
          provide: QuizFacade,
          useValue: {
            sessionStatus: signal('idle'),
            isStarting: signal(false),
            sessionError: signal(null),
            session: signal(null),
            startQuiz,
            clear,
          },
        },
        {
          provide: DeckFacade,
          useValue: {
            decks: signal([
              {
                deckId: '11111111-1111-1111-1111-111111111111',
                name: 'Core Words',
                itemCount: 8,
              },
            ]),
            collectionStatus,
            isCollectionLoading: signal(false),
            collectionError: signal(null),
            loadCollection,
          },
        },
      ],
    });

    fixture = TestBed.createComponent(QuizStartPage);
    fixture.detectChanges();
  });

  /** Varsayılan formun canonical UserDictionary requestini gerçek facade'a gönderdiğini doğrular. */
  it('starts a canonical dictionary quiz', () => {
    activateStartButton(fixture);

    expect(startQuiz).toHaveBeenCalledWith({
      quizType: 'Test',
      quizSourceType: 'UserDictionary',
      quizContentMode: 'Mixed',
      questionCount: 10,
      deckId: null,
      includeSystemRecommendations: true,
    });
  });

  /** Backendde desteklenmeyen difficulty ve source seçeneklerinin render edilmediğini doğrular. */
  it('does not render unsupported backend options', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).not.toContain('Difficulty');
    expect(text).not.toContain('Difficult Items');
    expect(text).not.toContain('Recommended source');
  });

  /** Deck source seçildiğinde gerçek collectionın yüklenip deck seçilmeden startın kapandığını doğrular. */
  it('requires a real deck id for deck quizzes', () => {
    clickNativeButton(fixture, 'A specific deck');
    fixture.detectChanges();

    expect(loadCollection).toHaveBeenCalledOnce();
    activateStartButton(fixture);
    expect(startQuiz).not.toHaveBeenCalled();

    const select = fixture.debugElement.query(By.css('#quiz-deck'))
      .nativeElement as HTMLSelectElement;
    select.value = '11111111-1111-1111-1111-111111111111';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    activateStartButton(fixture);

    expect(startQuiz).toHaveBeenCalledWith(
      expect.objectContaining({
        quizSourceType: 'Deck',
        deckId: '11111111-1111-1111-1111-111111111111',
      }),
    );
  });

  /** Test quiz seçiliyken backendin reddettiği SentencesOnly butonunun disabled olduğunu doğrular. */
  it('disables sentence-only content for multiple choice quizzes', () => {
    const sentenceButton = fixture.debugElement
      .queryAll(By.css('button'))
      .find((button) => (button.nativeElement.textContent ?? '').includes('Sentences'))!;

    expect((sentenceButton.nativeElement as HTMLButtonElement).disabled).toBe(true);
  });
});

/** Shared start Button componentinin activated outputunu kullanıcı niyeti gibi yayar. */
function activateStartButton(fixture: ComponentFixture<QuizStartPage>): void {
  const button = fixture.debugElement
    .queryAll(By.directive(Button))
    .find((item) => (item.nativeElement.textContent ?? '').includes('Start Quiz'))!;
  (button.componentInstance as Button).activated.emit(new MouseEvent('click'));
}

/** Metni eşleşen native seçim butonuna gerçek click eventi gönderir. */
function clickNativeButton(fixture: ComponentFixture<QuizStartPage>, label: string): void {
  const button = fixture.debugElement
    .queryAll(By.css('button'))
    .find((item) => (item.nativeElement.textContent ?? '').includes(label))!;
  (button.nativeElement as HTMLButtonElement).click();
}
