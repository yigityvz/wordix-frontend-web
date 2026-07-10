export type Theme = 'light' | 'dark';
export type UserRole = 'basic_user' | 'admin';

export interface User {
  username: string;
  email: string;
  roles: UserRole[];
  keycloakId: string;
}

export interface DictionaryItem {
  id: string;
  text: string;
  type: 'word' | 'phrase' | 'sentence';
  meanings: string[];
  partOfSpeech?: string;
  confidence: number;
  status: 'new' | 'learning' | 'review' | 'mastered';
  isFavorite: boolean;
  isDifficult: boolean;
  nextReview?: string;
  addedAt: string;
  notes: Note[];
  deckIds: string[];
}

export interface Note {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  accuracy?: number;
  lastPracticed?: string;
  createdAt: string;
}

export interface QuizConfig {
  type: 'Test' | 'Writing';
  source: 'UserDictionary' | 'Deck' | 'DifficultItems' | 'SystemRecommendations';
  contentMode: 'WordsOnly' | 'PhrasesOnly' | 'SentencesOnly' | 'Mixed';
  difficulty: 'Beginner' | 'Intermediate' | 'Hard' | 'Mixed';
  questionCount: number;
  deckId?: string;
  includeRecommendations: boolean;
}

export interface QuizQuestion {
  id: string;
  text: string;
  type: 'multiple_choice' | 'writing';
  options?: string[];
  correctAnswer: string;
  itemType: 'word' | 'phrase' | 'sentence';
}

export interface QuizAnswer {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  responseTime: number;
}

export type AppView =
  | 'auth/login'
  | 'auth/callback'
  | 'auth/unauthorized'
  | 'auth/forbidden'
  | 'user/dashboard'
  | 'user/lookup'
  | 'user/lookup/result'
  | 'user/dictionary'
  | 'user/dictionary/detail'
  | 'user/decks'
  | 'user/decks/detail'
  | 'user/quiz/start'
  | 'user/quiz/active'
  | 'user/quiz/summary'
  | 'user/statistics'
  | 'user/profile'
  | 'user/settings'
  | 'admin/dashboard'
  | 'admin/lookups'
  | 'admin/most-saved'
  | 'admin/quiz-insights'
  | 'admin/provider'
  | 'admin/users'
  | 'admin/health'
  | 'system/404'
  | 'system/500';
