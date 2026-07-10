import { BookOpen, Search, Target, Clock, Star, AlertTriangle, TrendingUp, GraduationCap, ArrowRight, Brain, Flame, BarChart3, Zap } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ProgressBar from '../../components/ui/ProgressBar';
import EmptyState from '../../components/ui/EmptyState';
import { mockDictionaryItems } from '../../data/mockData';
import type { AppView } from '../../types';

interface DashboardPageProps {
  onNavigate: (view: AppView) => void;
  username: string;
  isEmpty?: boolean;
}

const dueItems      = mockDictionaryItems.filter(i => i.nextReview === '2026-07-10').slice(0, 3);
const difficultItems = mockDictionaryItems.filter(i => i.isDifficult).slice(0, 3);
const recentItems   = mockDictionaryItems.slice(0, 5);

// Mini sparkline bar component
function SparkBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="w-1.5 rounded-full flex-shrink-0" style={{ height: `${Math.max(4, pct * 0.32)}px`, background: color, alignSelf: 'flex-end' }} />
  );
}

const sparkData = [62, 71, 68, 75, 70, 78, 76];

export default function DashboardPage({ onNavigate, username, isEmpty = false }: DashboardPageProps) {
  if (isEmpty) {
    return (
      <div className="space-y-6 page-enter">
        {/* Welcome for new user */}
        <div className="rounded-[20px] p-6 md:p-8 relative overflow-hidden"
          style={{ background: 'var(--btn-primary-bg)' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)' }} />
          <p className="text-white/70 text-sm mb-1 font-medium">Welcome to Wordix 👋</p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-3">Hello, {username}!</h1>
          <p className="text-white/75 text-sm mb-5">Start your English learning journey by searching for your first word.</p>
          <Button size="sm" onClick={() => onNavigate('user/lookup')} className="!bg-white !text-[#013a63] hover:!bg-white/90">
            <Search size={14} /> Search your first word
          </Button>
        </div>
        <EmptyState
          icon={<BookOpen size={28} />}
          title="Your dictionary is empty"
          description="Search for English words, phrases, or sentences and save them here to begin."
          action={{ label: 'Go to Lookup', onClick: () => onNavigate('user/lookup') }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 page-enter">
      {/* ── Welcome hero ─────────────────────────────────────── */}
      <div
        className="rounded-[22px] p-6 md:p-8 relative overflow-hidden"
        style={{ background: 'var(--btn-primary-bg)', boxShadow: '0 8px 32px var(--accent-glow)' }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, white, transparent)', transform: 'translate(25%,-25%)' }} />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full pointer-events-none opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, white, transparent)', transform: 'translate(-50%,40%)' }} />

        <div className="relative flex flex-col md:flex-row md:items-center gap-5">
          <div className="flex-1">
            <p className="text-white/65 text-sm font-medium mb-0.5">Good afternoon</p>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-4">{username} 👋</h1>
            <div className="flex flex-wrap gap-5 mb-5">
              {[
                { v: '5', u: 'day streak', icon: '🔥' },
                { v: '42', u: 'words saved', icon: '📚' },
                { v: '76%', u: 'accuracy', icon: '🎯' },
              ].map((s, i) => (
                <div key={i}>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">{s.icon}</span>
                    <p className="text-2xl font-black text-white leading-none">{s.v}</p>
                  </div>
                  <p className="text-xs text-white/60 mt-0.5 font-medium">{s.u}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2.5 flex-wrap">
              <Button size="sm" onClick={() => onNavigate('user/quiz/start')}
                className="!bg-white !text-[#013a63] hover:!bg-white/90 font-bold">
                <GraduationCap size={14} /> Start Review
              </Button>
              <Button size="sm" onClick={() => onNavigate('user/lookup')}
                className="!bg-white/15 !text-white !border-white/20 hover:!bg-white/25">
                <Search size={14} /> Search Word
              </Button>
            </div>
          </div>

          {/* Mini accuracy sparkline */}
          <div className="hidden md:flex flex-col items-end gap-1.5 flex-shrink-0">
            <p className="text-xs text-white/50 font-semibold">7-day accuracy</p>
            <div className="flex items-end gap-1 h-12">
              {sparkData.map((v, i) => (
                <SparkBar key={i} pct={v} color={i === sparkData.length - 1 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)'} />
              ))}
            </div>
            <p className="text-lg font-black text-white">76%</p>
          </div>
        </div>
      </div>

      {/* ── Stats grid ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Saved Items"   value="42"   sub="in dictionary"         icon={<BookOpen size={17} />}      onClick={() => onNavigate('user/dictionary')} />
        <StatCard label="Due Review"    value="8"    sub="need practice today"   icon={<Clock size={17} />}        accent onClick={() => onNavigate('user/quiz/start')} />
        <StatCard label="Quiz Accuracy" value="76%"  sub="last 7 quizzes"       icon={<Target size={17} />}       trend={{ value: 4, label: 'this week' }} />
        <StatCard label="Avg. Confidence" value="63%" sub="across all words"    icon={<Brain size={17} />} />
      </div>

      {/* ── Main 2-col grid ──────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Due for review */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Clock size={15} style={{ color: 'var(--accent)' }} /> Due for Review
            </h2>
            <Badge variant="warning" size="xs">{dueItems.length} items</Badge>
          </div>
          <div className="space-y-2.5">
            {dueItems.map(item => (
              <button
                key={item.id}
                className="w-full flex items-center gap-3 p-3 rounded-[12px] text-left t-all hover:bg-[var(--surface-2)]"
                onClick={() => onNavigate('user/dictionary/detail')}
              >
                <div className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0 text-xs font-black"
                  style={{ background: 'var(--surface-2)', color: 'var(--accent)' }}>
                  {item.text[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{item.text}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{item.meanings[0]}</p>
                </div>
                <ProgressBar value={item.confidence} showLabel className="w-20" />
              </button>
            ))}
          </div>
          <Button fullWidth variant="secondary" size="sm" className="mt-4"
            onClick={() => onNavigate('user/quiz/start')}>
            Start Review Session
          </Button>
        </Card>

        {/* Difficult items */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <AlertTriangle size={15} className="text-amber-400" /> Difficult Items
            </h2>
            <Badge variant="difficult" size="xs">{difficultItems.length} flagged</Badge>
          </div>
          <div className="space-y-2.5">
            {difficultItems.map(item => (
              <button
                key={item.id}
                className="w-full flex items-center gap-3 p-3 rounded-[12px] text-left t-all hover:bg-[var(--surface-2)]"
                onClick={() => onNavigate('user/dictionary/detail')}
              >
                <div className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--error-bg)' }}>
                  <AlertTriangle size={13} className="text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{item.text}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{item.meanings[0]}</p>
                </div>
                <ProgressBar value={item.confidence} showLabel className="w-20" />
              </button>
            ))}
          </div>
          <Button fullWidth variant="secondary" size="sm" className="mt-4"
            onClick={() => onNavigate('user/quiz/start')}>
            Practice Difficult
          </Button>
        </Card>

        {/* Recent items */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <BookOpen size={15} style={{ color: 'var(--accent)' }} /> Recently Added
            </h2>
            <button
              className="text-xs font-semibold flex items-center gap-0.5 hover:opacity-70 t-all"
              style={{ color: 'var(--accent)' }}
              onClick={() => onNavigate('user/dictionary')}
            >
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-1.5">
            {recentItems.map(item => (
              <button
                key={item.id}
                className="w-full flex items-center gap-3 px-2.5 py-2 rounded-[10px] text-left t-all hover:bg-[var(--surface-2)]"
                onClick={() => onNavigate('user/dictionary/detail')}
              >
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <span className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{item.text}</span>
                  <Badge variant={item.type} size="xs">{item.type}</Badge>
                  {item.isFavorite && <Star size={11} className="text-amber-400 fill-amber-400 flex-shrink-0" />}
                </div>
                <Badge variant={item.status} size="xs">{item.status}</Badge>
              </button>
            ))}
          </div>
        </Card>

        {/* Recommended actions */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Zap size={15} style={{ color: 'var(--accent)' }} /> Recommended
            </h2>
          </div>
          <div className="space-y-2">
            {[
              {
                icon: <GraduationCap size={15} />,
                title: 'Quiz Difficult Items',
                sub: '3 flagged items ready',
                view: 'user/quiz/start' as AppView,
                bg: 'var(--error-bg)',
                iconColor: 'var(--error)',
              },
              {
                icon: <Clock size={15} />,
                title: 'Daily Review',
                sub: '8 items due today',
                view: 'user/quiz/start' as AppView,
                bg: 'var(--warning-bg)',
                iconColor: 'var(--warning)',
              },
              {
                icon: <Search size={15} />,
                title: 'Explore New Words',
                sub: 'Expand vocabulary',
                view: 'user/lookup' as AppView,
                bg: 'var(--surface-2)',
                iconColor: 'var(--accent)',
              },
              {
                icon: <BarChart3 size={15} />,
                title: 'View Statistics',
                sub: 'Check learning trends',
                view: 'user/statistics' as AppView,
                bg: 'var(--surface-2)',
                iconColor: 'var(--accent)',
              },
            ].map((a, i) => (
              <button
                key={i}
                className="w-full flex items-center gap-3 p-3 rounded-[12px] text-left t-all hover:scale-[1.01]"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--surface-border)' }}
                onClick={() => onNavigate(a.view)}
              >
                <div className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
                  style={{ background: a.bg, color: a.iconColor }}>
                  {a.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{a.title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{a.sub}</p>
                </div>
                <ArrowRight size={13} style={{ color: 'var(--text-muted)' }} />
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
