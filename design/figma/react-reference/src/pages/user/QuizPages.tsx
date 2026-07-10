import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, X, CheckCircle2, XCircle, ChevronRight, GraduationCap, RotateCcw, Home, BookOpen, AlertCircle, Timer } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';
import Modal from '../../components/ui/Modal';
import { mockQuizQuestions } from '../../data/mockData';
import type { AppView, QuizConfig, QuizAnswer } from '../../types';

// ─── Quiz Start ─────────────────────────────────────────────────────────────
interface QuizStartProps {
  onNavigate: (view: AppView) => void;
  onStartQuiz: (config: QuizConfig) => void;
}

export function QuizStartPage({ onNavigate, onStartQuiz }: QuizStartProps) {
  const [config, setConfig] = useState<QuizConfig>({
    type: 'Test',
    source: 'UserDictionary',
    contentMode: 'Mixed',
    difficulty: 'Mixed',
    questionCount: 10,
    includeRecommendations: true,
  });

  const handleStart = () => {
    if (config.source === 'Deck' && !config.deckId) return;
    onStartQuiz(config);
    onNavigate('user/quiz/active');
  };

  const setField = <K extends keyof QuizConfig>(key: K, val: QuizConfig[K]) =>
    setConfig(p => ({ ...p, [key]: val }));

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold mb-1" style={{ color: 'var(--text-primary)' }}>Start a Quiz</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Configure your practice session.</p>
      </div>

      <Card>
        <div className="space-y-5">
          {/* Quiz type */}
          <div>
            <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Quiz Type</label>
            <div className="grid grid-cols-2 gap-2">
              {(['Test', 'Writing'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setField('type', t)}
                  className="p-3 rounded-[12px] text-sm font-semibold text-left transition-all"
                  style={{ background: config.type === t ? 'var(--nav-active)' : 'var(--surface-2)', color: config.type === t ? 'var(--nav-active-text)' : 'var(--text-secondary)', border: `1px solid ${config.type === t ? 'transparent' : 'var(--surface-border)'}` }}
                >
                  {t === 'Test' ? '🎯 Multiple Choice' : '✍️ Writing'}
                </button>
              ))}
            </div>
          </div>

          {/* Source */}
          <div>
            <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Source</label>
            <div className="grid grid-cols-2 gap-2">
              {(['UserDictionary', 'Deck', 'DifficultItems', 'SystemRecommendations'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setField('source', s)}
                  className="p-2.5 rounded-[12px] text-xs font-semibold text-left transition-all"
                  style={{ background: config.source === s ? 'var(--nav-active)' : 'var(--surface-2)', color: config.source === s ? 'var(--nav-active-text)' : 'var(--text-secondary)', border: `1px solid ${config.source === s ? 'transparent' : 'var(--surface-border)'}` }}
                >
                  {{ UserDictionary: '📚 My Dictionary', Deck: '🗂️ Deck', DifficultItems: '⚠️ Difficult Items', SystemRecommendations: '✨ Recommended' }[s]}
                </button>
              ))}
            </div>
            {config.source === 'Deck' && (
              <select
                value={config.deckId || ''}
                onChange={e => setField('deckId', e.target.value)}
                className="mt-2 w-full px-3 py-2 text-sm rounded-[12px] outline-none"
                style={{ background: 'var(--surface-2)', border: `1px solid ${!config.deckId ? 'var(--error)' : 'var(--surface-border)'}`, color: 'var(--text-primary)' }}
              >
                <option value="">Select a deck…</option>
                <option value="deck1">Career &amp; Success (18 items)</option>
                <option value="deck2">Daily Conversation (31 items)</option>
                <option value="deck3">Academic English (12 items)</option>
              </select>
            )}
          </div>

          {/* Content mode */}
          <div>
            <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Content</label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['Mixed', 'WordsOnly', 'PhrasesOnly', 'SentencesOnly'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setField('contentMode', m)}
                  className="p-2 rounded-[10px] text-xs font-semibold transition-all"
                  style={{ background: config.contentMode === m ? 'var(--nav-active)' : 'var(--surface-2)', color: config.contentMode === m ? 'var(--nav-active-text)' : 'var(--text-secondary)', border: `1px solid ${config.contentMode === m ? 'transparent' : 'var(--surface-border)'}` }}
                >
                  {m.replace('Only', '')}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Difficulty</label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['Mixed', 'Beginner', 'Intermediate', 'Hard'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setField('difficulty', d)}
                  className="p-2 rounded-[10px] text-xs font-semibold transition-all"
                  style={{ background: config.difficulty === d ? 'var(--nav-active)' : 'var(--surface-2)', color: config.difficulty === d ? 'var(--nav-active-text)' : 'var(--text-secondary)', border: `1px solid ${config.difficulty === d ? 'transparent' : 'var(--surface-border)'}` }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          <div>
            <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Questions: <span style={{ color: 'var(--text-primary)' }}>{config.questionCount}</span></label>
            <input
              type="range" min={5} max={30} step={5}
              value={config.questionCount}
              onChange={e => setField('questionCount', Number(e.target.value))}
              className="w-full accent-[#2c7da0]"
            />
            <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              <span>5</span><span>10</span><span>15</span><span>20</span><span>25</span><span>30</span>
            </div>
          </div>

          {/* Recommendations toggle */}
          <div className="flex items-center justify-between p-3 rounded-[12px]" style={{ background: 'var(--surface-2)', border: '1px solid var(--surface-border)' }}>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Include system recommendations</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Mix in algorithmically suggested items</p>
            </div>
            <button
              onClick={() => setField('includeRecommendations', !config.includeRecommendations)}
              className={`relative w-11 h-6 rounded-full transition-all ${config.includeRecommendations ? 'bg-[#2c7da0]' : 'bg-[var(--surface-border)]'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${config.includeRecommendations ? 'left-5' : 'left-0.5'}`} />
            </button>
          </div>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => onNavigate('user/dashboard')}>Cancel</Button>
        <Button fullWidth icon={<GraduationCap size={16} />} onClick={handleStart}
          disabled={config.source === 'Deck' && !config.deckId}>
          Start Quiz
        </Button>
      </div>
      {config.source === 'Deck' && !config.deckId && (
        <p className="text-xs text-red-400 flex items-center gap-1 -mt-2"><AlertCircle size={12} /> Please select a deck to continue.</p>
      )}
    </div>
  );
}

// ─── Active Quiz ─────────────────────────────────────────────────────────────
interface QuizActiveProps {
  onNavigate: (view: AppView) => void;
  quizType: 'Test' | 'Writing';
  onComplete: (answers: QuizAnswer[]) => void;
}

export function QuizActivePage({ onNavigate, quizType, onComplete }: QuizActiveProps) {
  const questions = mockQuizQuestions.filter(q => quizType === 'Writing' ? q.type === 'writing' : q.type === 'multiple_choice');
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [writingAnswer, setWritingAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [exitModal, setExitModal] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)), 1000);
    return () => clearInterval(t);
  }, [current]);

  useEffect(() => {
    startRef.current = Date.now();
    setElapsed(0);
  }, [current]);

  const q = questions[current];
  const isCorrect = submitted && (quizType === 'Test' ? selected === q?.correctAnswer : writingAnswer.trim().toLowerCase() === q?.correctAnswer.toLowerCase());
  const progress = ((current) / questions.length) * 100;

  const submit = () => {
    if (!submitted && q) {
      const ans = quizType === 'Test' ? selected || '' : writingAnswer;
      setAnswers(prev => [...prev, {
        questionId: q.id,
        answer: ans,
        isCorrect: ans.trim().toLowerCase() === q.correctAnswer.toLowerCase(),
        responseTime: elapsed,
      }]);
      setSubmitted(true);
    }
  };

  const next = () => {
    if (current + 1 >= questions.length) {
      onComplete(answers);
      onNavigate('user/quiz/summary');
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setWritingAnswer('');
      setSubmitted(false);
    }
  };

  if (!q) return null;

  return (
    <div className="max-w-lg mx-auto space-y-4">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <button onClick={() => setExitModal(true)} className="w-8 h-8 flex items-center justify-center rounded-[10px] transition-all hover:bg-[var(--surface-2)]" style={{ color: 'var(--text-muted)' }}>
          <X size={18} />
        </button>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Question {current + 1} of {questions.length}</p>
            <div className="flex items-center gap-1 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              <Timer size={12} /> {elapsed}s
            </div>
          </div>
          <ProgressBar value={progress} size="md" color="blue" />
        </div>
      </div>

      {/* Question card */}
      <Card glow>
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant={q.itemType}>{q.itemType}</Badge>
            <Badge variant={quizType === 'Writing' ? 'info' : 'default'}>{quizType === 'Writing' ? '✍️ Writing' : '🎯 Multiple Choice'}</Badge>
          </div>
          <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{q.text}</p>
        </div>

        {quizType === 'Test' && q.options ? (
          <div className="space-y-2.5">
            {q.options.map(option => {
              let style: React.CSSProperties = { background: 'var(--surface-2)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)' };
              if (submitted) {
                if (option === q.correctAnswer) style = { background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.4)', color: '#10b981' };
                else if (option === selected && option !== q.correctAnswer) style = { background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.4)', color: '#f87171' };
              } else if (selected === option) {
                style = { background: 'rgba(44,125,160,0.15)', border: '1px solid #2c7da0', color: 'var(--text-primary)' };
              }
              return (
                <button
                  key={option}
                  onClick={() => !submitted && setSelected(option)}
                  disabled={submitted}
                  className="w-full flex items-center gap-3 p-3.5 rounded-[12px] text-sm font-semibold text-left transition-all hover:scale-[1.01] disabled:cursor-default disabled:hover:scale-100"
                  style={style}
                >
                  <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-xs" style={{ borderColor: 'currentColor' }}>
                    {submitted && option === q.correctAnswer ? '✓' : submitted && option === selected && option !== q.correctAnswer ? '✗' : option[0].toUpperCase()}
                  </span>
                  {option}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            <input
              value={writingAnswer}
              onChange={e => !submitted && setWritingAnswer(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !submitted && writingAnswer.trim() && submit()}
              placeholder="Type your answer in Turkish…"
              className="w-full px-4 py-3 text-sm rounded-[12px] outline-none font-semibold"
              style={{
                background: submitted ? (isCorrect ? 'rgba(16,185,129,0.1)' : 'rgba(248,113,113,0.1)') : 'var(--surface-2)',
                border: `1px solid ${submitted ? (isCorrect ? 'rgba(16,185,129,0.5)' : 'rgba(248,113,113,0.5)') : 'var(--surface-border)'}`,
                color: 'var(--text-primary)',
              }}
              disabled={submitted}
              autoFocus
            />
            {submitted && (
              <div className={`p-3 rounded-[12px] ${isCorrect ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                <p className={`text-sm font-semibold ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isCorrect ? '✓ Correct!' : `✗ Correct answer: ${q.correctAnswer}`}
                </p>
              </div>
            )}
          </div>
        )}

        {submitted && (
          <div className={`mt-4 p-3 rounded-[12px] flex items-center gap-2 ${isCorrect ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
            {isCorrect ? <CheckCircle2 size={16} className="text-emerald-400" /> : <XCircle size={16} className="text-red-400" />}
            <span className={`text-sm font-semibold ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
              {isCorrect ? 'Great job! +5 confidence' : `Correct: ${q.correctAnswer}`}
            </span>
          </div>
        )}
      </Card>

      <div className="flex gap-3">
        {!submitted ? (
          <Button
            fullWidth
            onClick={submit}
            disabled={quizType === 'Test' ? !selected : !writingAnswer.trim()}
          >
            Submit Answer
          </Button>
        ) : (
          <Button
            fullWidth
            icon={current + 1 >= questions.length ? <GraduationCap size={16} /> : <ChevronRight size={16} />}
            onClick={next}
          >
            {current + 1 >= questions.length ? 'Finish Quiz' : 'Next Question'}
          </Button>
        )}
      </div>

      <Modal
        open={exitModal}
        onClose={() => setExitModal(false)}
        title="Exit Quiz?"
        size="sm"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setExitModal(false)}>Continue quiz</Button>
            <Button variant="danger" size="sm" onClick={() => { setExitModal(false); onNavigate('user/dashboard'); }}>Exit</Button>
          </>
        }
      >
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Your progress will be lost if you exit now. Are you sure?</p>
      </Modal>
    </div>
  );
}

// ─── Quiz Summary ─────────────────────────────────────────────────────────────
interface QuizSummaryProps {
  onNavigate: (view: AppView) => void;
  answers?: QuizAnswer[];
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function QuizSummaryPage({ onNavigate, answers = [], onToast }: QuizSummaryProps) {
  const mockAnswers: QuizAnswer[] = answers.length > 0 ? answers : [
    { questionId: 'q1', answer: 'başarmak', isCorrect: true, responseTime: 4 },
    { questionId: 'q2', answer: 'devam etmek', isCorrect: false, responseTime: 7 },
    { questionId: 'q4', answer: 'mücadele etmek', isCorrect: true, responseTime: 5 },
  ];
  const correct = mockAnswers.filter(a => a.isCorrect).length;
  const total = mockAnswers.length;
  const accuracy = Math.round((correct / total) * 100);
  const avgTime = Math.round(mockAnswers.reduce((s, a) => s + a.responseTime, 0) / total);
  const [savedRecommended, setSavedRecommended] = useState(false);

  const questions = mockQuizQuestions;
  const wrongAnswers = mockAnswers.filter(a => !a.isCorrect);

  return (
    <div className="max-w-lg mx-auto space-y-5">
      {/* Score card */}
      <Card glow>
        <div className="text-center py-4">
          <div className="text-6xl mb-3">{accuracy >= 80 ? '🎉' : accuracy >= 60 ? '👍' : '💪'}</div>
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--text-primary)' }}>{accuracy}%</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{correct}/{total} correct answers</p>
          <div className="mt-4 max-w-xs mx-auto">
            <ProgressBar value={accuracy} size="md" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-5 pt-5" style={{ borderTop: '1px solid var(--surface-border)' }}>
          <div className="text-center">
            <p className="text-xl font-black text-emerald-400">{correct}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Correct</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-black text-red-400">{total - correct}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Wrong</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-black font-mono" style={{ color: 'var(--text-primary)' }}>{avgTime}s</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Avg. time</p>
          </div>
        </div>
      </Card>

      {/* Wrong items + recommendations */}
      {wrongAnswers.length > 0 && (
        <Card>
          <h2 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <XCircle size={16} className="text-red-400" /> Items to review
          </h2>
          <div className="space-y-2 mb-4">
            {wrongAnswers.map(a => {
              const q = questions.find(q => q.id === a.questionId);
              return q ? (
                <div key={a.questionId} className="flex items-center gap-3 p-3 rounded-[12px]" style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)' }}>
                  <XCircle size={14} className="text-red-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{q.correctAnswer}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Your answer: {a.answer || '(empty)'}</p>
                  </div>
                </div>
              ) : null;
            })}
          </div>
          {!savedRecommended ? (
            <Button fullWidth variant="secondary" size="sm" icon={<BookOpen size={14} />} onClick={() => { setSavedRecommended(true); onToast('Recommended items saved to dictionary', 'success'); }}>
              Save all to Dictionary
            </Button>
          ) : (
            <Button fullWidth variant="success" size="sm" icon={<CheckCircle2 size={14} />} disabled>
              Saved to Dictionary
            </Button>
          )}
        </Card>
      )}

      {/* Answer review */}
      <Card>
        <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Question Review</h2>
        <div className="space-y-2">
          {mockAnswers.map((a, i) => {
            const q = questions.find(q => q.id === a.questionId);
            return (
              <div key={i} className="flex items-center gap-3 p-3 rounded-[12px]" style={{ background: 'var(--surface-2)' }}>
                {a.isCorrect ? <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" /> : <XCircle size={16} className="text-red-400 flex-shrink-0" />}
                <p className="text-sm flex-1 truncate" style={{ color: 'var(--text-primary)' }}>{q?.text.slice(0, 50) || 'Unknown question'}</p>
                <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{a.responseTime}s</span>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="flex gap-3">
        <Button variant="secondary" icon={<Home size={15} />} onClick={() => onNavigate('user/dashboard')}>Dashboard</Button>
        <Button fullWidth icon={<RotateCcw size={15} />} onClick={() => onNavigate('user/quiz/start')}>New Quiz</Button>
      </div>
    </div>
  );
}
