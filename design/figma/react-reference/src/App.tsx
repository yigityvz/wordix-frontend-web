import { useState, useCallback, useEffect } from 'react';
import AppShell from './components/layout/AppShell';
import { ToastContainer, type ToastData } from './components/ui/Toast';
import { OfflineBanner } from './pages/system/ErrorPages';

import LoginPage from './pages/auth/LoginPage';
import AuthCallback from './pages/auth/AuthCallback';
import { UnauthorizedPage, ForbiddenPage } from './pages/auth/ErrorPages';

import DashboardPage from './pages/user/DashboardPage';
import LookupPage from './pages/user/LookupPage';
import DictionaryPage from './pages/user/DictionaryPage';
import DictionaryDetailPage from './pages/user/DictionaryDetailPage';
import DecksPage from './pages/user/DecksPage';
import { QuizStartPage, QuizActivePage, QuizSummaryPage } from './pages/user/QuizPages';
import StatisticsPage from './pages/user/StatisticsPage';
import { ProfilePage, SettingsPage } from './pages/user/ProfileSettingsPages';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTopLookups from './pages/admin/AdminTopLookups';
import AdminProviderPage from './pages/admin/AdminProviderPage';
import { AdminMostSavedPage, AdminQuizInsightsPage, AdminSystemHealthPage } from './pages/admin/AdminExtraPages';
import { NotFoundPage, ServerErrorPage } from './pages/system/ErrorPages';

import type { AppView, Theme, QuizAnswer, QuizConfig, DictionaryItem } from './types';
import { mockDecks, mockDictionaryItems as allDictItems } from './data/mockData';

const pageTitles: Partial<Record<AppView, string>> = {
  'user/dashboard':        'Dashboard',
  'user/lookup':           'Lookup',
  'user/dictionary':       'Dictionary',
  'user/dictionary/detail':'Word Detail',
  'user/decks':            'Decks',
  'user/decks/detail':     'Deck Detail',
  'user/quiz/start':       'Start Quiz',
  'user/quiz/active':      'Quiz',
  'user/quiz/summary':     'Quiz Summary',
  'user/statistics':       'Statistics',
  'user/profile':          'Profile',
  'user/settings':         'Settings',
  'admin/dashboard':       'Admin Dashboard',
  'admin/lookups':         'Top Lookups',
  'admin/most-saved':      'Most Saved',
  'admin/quiz-insights':   'Quiz Insights',
  'admin/provider':        'Provider / Import',
  'admin/users':           'Users Overview',
  'admin/health':          'System Health',
};

// ─── Inline DeckDetail ───────────────────────────────────────────────────────
function DeckDetailPage({ onNavigate, onToast }: {
  onNavigate: (v: AppView) => void;
  onToast: (m: string, t?: 'success' | 'error' | 'info') => void;
}) {
  const deck = mockDecks[0];
  const items = allDictItems.filter(i => i.deckIds.includes(deck.id));
  const [localItems, setLocalItems] = useState(items);

  return (
    <div className="max-w-2xl mx-auto space-y-5 page-enter">
      <button
        className="flex items-center gap-2 text-sm font-semibold hover:opacity-70 t-all"
        style={{ color: 'var(--accent)' }}
        onClick={() => onNavigate('user/decks')}
      >
        ← Back to Decks
      </button>

      {/* Deck hero */}
      <div
        className="rounded-[22px] p-6 relative overflow-hidden"
        style={{ background: 'var(--btn-primary-bg)', boxShadow: '0 8px 32px var(--accent-glow)' }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.07), transparent 60%)' }} />
        <div className="relative">
          <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">Deck</p>
          <h1 className="text-2xl font-extrabold text-white mb-1">{deck.name}</h1>
          <p className="text-white/70 text-sm mb-4">{deck.description}</p>
          <div className="flex gap-5 mb-5">
            <div>
              <p className="text-2xl font-black text-white">{deck.itemCount}</p>
              <p className="text-xs text-white/60">Items</p>
            </div>
            {deck.accuracy && (
              <div>
                <p className="text-2xl font-black text-white">{deck.accuracy}%</p>
                <p className="text-xs text-white/60">Accuracy</p>
              </div>
            )}
            {deck.lastPracticed && (
              <div>
                <p className="text-sm font-bold text-white">{deck.lastPracticed}</p>
                <p className="text-xs text-white/60">Last practiced</p>
              </div>
            )}
          </div>
          <button
            onClick={() => onNavigate('user/quiz/start')}
            className="px-5 py-2.5 text-sm font-bold rounded-[12px] bg-white text-[#013a63] hover:bg-white/90 t-all"
          >
            🎯 Start Quiz
          </button>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-2">
        {localItems.map(item => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-4 rounded-[14px] group cursor-pointer t-all hover:bg-[var(--surface-2)]"
            style={{ background: 'var(--surface)', border: '1px solid var(--surface-border)' }}
            onClick={() => onNavigate('user/dictionary/detail')}
          >
            <div className="w-8 h-8 rounded-[10px] flex items-center justify-center text-xs font-black flex-shrink-0"
              style={{ background: 'var(--surface-2)', color: 'var(--accent)' }}>
              {item.text[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{item.text}</p>
              <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{item.meanings[0]}</p>
            </div>
            <button
              onClick={e => {
                e.stopPropagation();
                setLocalItems(p => p.filter(i => i.id !== item.id));
                onToast('Item removed from deck', 'info');
              }}
              className="opacity-0 group-hover:opacity-100 text-xs font-semibold text-red-400 hover:text-red-500 t-all px-2 py-1 rounded-lg hover:bg-red-500/10"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button
        className="w-full py-3.5 rounded-[14px] text-sm font-semibold t-all hover:scale-[1.01]"
        style={{ background: 'var(--surface-2)', border: '2px dashed var(--surface-border)', color: 'var(--text-muted)' }}
        onClick={() => onToast('Open dictionary to select items for this deck', 'info')}
      >
        + Add from Dictionary
      </button>
    </div>
  );
}

// ─── Admin Users placeholder ─────────────────────────────────────────────────
function AdminUsersPage({ onNavigate }: { onNavigate: (v: AppView) => void }) {
  return (
    <div className="space-y-6 page-enter">
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>Users Overview</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
          User management is handled via Keycloak Admin Console
        </p>
      </div>

      <div className="rounded-[20px] p-8 text-center"
        style={{ background: 'var(--surface)', border: '1px solid var(--surface-border)' }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: 'var(--surface-2)' }}>
          <span className="text-2xl">🔐</span>
        </div>
        <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Managed via Keycloak
        </h2>
        <p className="text-sm max-w-sm mx-auto mb-5" style={{ color: 'var(--text-muted)' }}>
          All user accounts, roles, and access are managed in the Keycloak Admin Console.
          This panel shows aggregated activity data only.
        </p>
        <button
          onClick={() => window.open('http://localhost:8080/admin/master/console/#/wordix', '_blank')}
          className="px-5 py-2.5 text-sm font-bold rounded-[12px] text-white hover:opacity-90 t-all"
          style={{ background: 'var(--btn-primary-bg)' }}
        >
          Open Keycloak Admin ↗
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { l: 'Total Users',    v: '247' },
          { l: 'Active Today',   v: '38'  },
          { l: 'Admins',         v: '3'   },
          { l: 'New This Week',  v: '12'  },
        ].map((s, i) => (
          <div key={i} className="card p-5">
            <p className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{s.v}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Root App ────────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [view, setView] = useState<AppView>('auth/login');
  const [isAdmin, setIsAdmin] = useState(false);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([]);
  const [quizType, setQuizType] = useState<'Test' | 'Writing'>('Test');
  const [selectedDictItem, setSelectedDictItem] = useState<DictionaryItem | undefined>(undefined);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  const navigate = useCallback((v: AppView) => {
    if (v.startsWith('admin/') && !isAdmin) { setView('auth/forbidden'); return; }
    setView(v);
    window.scrollTo(0, 0);
  }, [isAdmin]);

  const addToast = useCallback((message: string, type: ToastData['type'] = 'success', description?: string) => {
    const id = `t${Date.now()}`;
    setToasts(p => [...p, { id, type, message, description }]);
  }, []);

  const removeToast = useCallback((id: string) => setToasts(p => p.filter(t => t.id !== id)), []);
  const toast = useCallback((msg: string, type: 'success' | 'error' | 'info' = 'success') => addToast(msg, type), [addToast]);

  const handleLogout = () => { setView('auth/login'); setIsAdmin(false); addToast('Signed out successfully', 'info'); };
  const handleStartQuiz = (cfg: QuizConfig) => setQuizType(cfg.type);
  const handleQuizComplete = (ans: QuizAnswer[]) => setQuizAnswers(ans);

  const isAuthView = view.startsWith('auth/') || view.startsWith('system/');
  const username = isAdmin ? 'admin.user' : 'ali.yilmaz';
  const email = isAdmin ? 'admin@wordix.io' : 'ali.yilmaz@example.com';

  const renderPage = () => {
    switch (view) {
      // User
      case 'user/dashboard':        return <DashboardPage onNavigate={navigate} username={username} />;
      case 'user/lookup':           return <LookupPage onNavigate={navigate} onToast={toast} />;
      case 'user/lookup/result':    return <LookupPage onNavigate={navigate} onToast={toast} />;
      case 'user/dictionary':       return <DictionaryPage onNavigate={navigate} onToast={toast} onSelectItem={setSelectedDictItem} />;
      case 'user/dictionary/detail':return <DictionaryDetailPage onNavigate={navigate} onToast={toast} item={selectedDictItem} />;
      case 'user/decks':            return <DecksPage onNavigate={navigate} onToast={toast} />;
      case 'user/decks/detail':     return <DeckDetailPage onNavigate={navigate} onToast={toast} />;
      case 'user/quiz/start':       return <QuizStartPage onNavigate={navigate} onStartQuiz={handleStartQuiz} />;
      case 'user/quiz/active':      return <QuizActivePage onNavigate={navigate} quizType={quizType} onComplete={handleQuizComplete} />;
      case 'user/quiz/summary':     return <QuizSummaryPage onNavigate={navigate} answers={quizAnswers} onToast={toast} />;
      case 'user/statistics':       return <StatisticsPage onNavigate={navigate} />;
      case 'user/profile':          return <ProfilePage onNavigate={navigate} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} username={username} email={email} />;
      case 'user/settings':         return <SettingsPage theme={theme} onSetTheme={setTheme} onToast={toast} />;
      // Admin
      case 'admin/dashboard':       return <AdminDashboard onNavigate={navigate} onToast={toast} />;
      case 'admin/lookups':         return <AdminTopLookups onNavigate={navigate} />;
      case 'admin/most-saved':      return <AdminMostSavedPage onNavigate={navigate} />;
      case 'admin/quiz-insights':   return <AdminQuizInsightsPage onNavigate={navigate} />;
      case 'admin/provider':        return <AdminProviderPage onNavigate={navigate} onToast={toast} />;
      case 'admin/users':           return <AdminUsersPage onNavigate={navigate} />;
      case 'admin/health':          return <AdminSystemHealthPage onToast={toast} />;
      // System
      case 'system/404':            return <NotFoundPage onNavigate={navigate} />;
      case 'system/500':            return <ServerErrorPage onNavigate={navigate} />;
      default:                      return <DashboardPage onNavigate={navigate} username={username} />;
    }
  };

  // Auth / system views — no shell
  if (isAuthView) {
    return (
      <>
        <OfflineBanner />
        {view === 'auth/login'        && <LoginPage theme={theme} onToggleTheme={toggleTheme} onNavigate={navigate} />}
        {view === 'auth/callback'     && <AuthCallback onNavigate={navigate} />}
        {view === 'auth/unauthorized' && <UnauthorizedPage onNavigate={navigate} />}
        {view === 'auth/forbidden'    && <ForbiddenPage onNavigate={navigate} />}
        {view === 'system/404'        && <NotFoundPage onNavigate={navigate} />}
        {view === 'system/500'        && <ServerErrorPage onNavigate={navigate} />}

        {/* Demo launcher */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full"
          style={{ background: 'var(--surface-solid)', border: '1px solid var(--surface-border)', boxShadow: 'var(--shadow-lg)' }}>
          <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Demo:</span>
          <button onClick={() => { setIsAdmin(false); navigate('user/dashboard'); }}
            className="text-xs font-bold px-3 py-1 rounded-full t-all"
            style={{ background: 'var(--surface-2)', color: 'var(--accent)' }}>User App</button>
          <button onClick={() => { setIsAdmin(true); navigate('admin/dashboard'); }}
            className="text-xs font-bold px-3 py-1 rounded-full t-all"
            style={{ background: 'var(--surface-2)', color: 'var(--accent)' }}>Admin App</button>
          <button onClick={toggleTheme}
            className="text-xs font-bold px-3 py-1 rounded-full t-all"
            style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}>
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </>
    );
  }

  return (
    <>
      <OfflineBanner />
      <AppShell
        currentView={view}
        onNavigate={navigate}
        theme={theme}
        onToggleTheme={toggleTheme}
        username={username}
        isAdmin={isAdmin}
        onLogout={handleLogout}
        pageTitle={pageTitles[view]}
      >
        {renderPage()}
      </AppShell>

      {/* Persistent demo switcher */}
      <div
        className="fixed bottom-[72px] md:bottom-4 left-4 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
        style={{ background: 'var(--surface-solid)', border: '1px solid var(--surface-border)', boxShadow: 'var(--shadow-lg)', opacity: 0.92 }}
      >
        <span className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>Demo</span>
        <button
          onClick={() => { setIsAdmin(false); navigate('user/dashboard'); }}
          className="text-[10px] font-bold px-2 py-0.5 rounded-full t-all"
          style={{ background: !isAdmin ? 'var(--nav-active-bg)' : 'var(--surface-2)', color: !isAdmin ? 'white' : 'var(--text-muted)' }}
        >User</button>
        <button
          onClick={() => { setIsAdmin(true); navigate('admin/dashboard'); }}
          className="text-[10px] font-bold px-2 py-0.5 rounded-full t-all"
          style={{ background: isAdmin ? 'var(--nav-active-bg)' : 'var(--surface-2)', color: isAdmin ? 'white' : 'var(--text-muted)' }}
        >Admin</button>
        <button onClick={() => navigate('system/404')}
          className="text-[10px] font-bold px-2 py-0.5 rounded-full t-all"
          style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}>404</button>
        <button onClick={() => navigate('system/500')}
          className="text-[10px] font-bold px-2 py-0.5 rounded-full t-all"
          style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}>500</button>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
