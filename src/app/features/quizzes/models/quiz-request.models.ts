/** Bu dosya, canlı Swagger'daki quiz mutation request gövdelerini ownership alanı eklemeden tanımlar. */

/** Backend StartQuizCommandValidator tarafından gerçekten desteklenen quiz tipleridir. */
export type SupportedQuizType = 'Test' | 'Writing';

/** Backend StartQuizCommandValidator tarafından gerçekten desteklenen canonical kaynak tipleridir. */
export type SupportedQuizSourceType = 'UserDictionary' | 'Deck';

/** Backend StartQuizCommandValidator tarafından gerçekten desteklenen içerik modlarıdır. */
export type SupportedQuizContentMode = 'WordsOnly' | 'PhrasesOnly' | 'SentencesOnly' | 'Mixed';

/** Yeni quiz session oluşturmak için backend sözleşmesinin kabul ettiği request modelidir. */
export interface StartQuizRequest {
  readonly quizType: SupportedQuizType;
  readonly quizSourceType: SupportedQuizSourceType;
  readonly quizContentMode: SupportedQuizContentMode;
  readonly questionCount: number;
  readonly deckId: string | null;
  readonly includeSystemRecommendations: boolean;
}

/** Tek quiz sorusuna verilen cevabı backend değerlendirmesine gönderen request modelidir. */
export interface SubmitQuizAnswerRequest {
  readonly quizQuestionId: string | null;
  readonly selectedQuizOptionId: string | null;
  readonly userAnswer: string | null;
  readonly questionResponseTimeInMilliseconds: number | null;
}
