import { useState } from 'react';
import { BookOpen, Zap, BarChart3, Shield, ArrowRight, Sparkles } from 'lucide-react';
import ThemeToggle from '../../components/layout/ThemeToggle';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import type { Theme, AppView } from '../../types';

interface LoginPageProps {
  theme: Theme;
  onToggleTheme: () => void;
  onNavigate: (view: AppView) => void;
}

const features = [
  {
    icon: <Zap size={18} />,
    title: 'Smart Lookup',
    desc: 'Search any English word, phrase, or full sentence — get instant Turkish meanings with part-of-speech context.',
    color: 'from-[#014f86]/20 to-[#2c7da0]/10',
    iconBg: '#014f86',
  },
  {
    icon: <BookOpen size={18} />,
    title: 'Personal Dictionary',
    desc: 'Save items, write notes, flag favorites and difficult words. Track confidence with spaced repetition.',
    color: 'from-[#2a6f97]/20 to-[#468faf]/10',
    iconBg: '#2a6f97',
  },
  {
    icon: <Shield size={18} />,
    title: 'Adaptive Quizzes',
    desc: 'Multiple-choice and writing quizzes that adapt to your weakest items. Start from decks or your full dictionary.',
    color: 'from-[#013a63]/20 to-[#2c7da0]/10',
    iconBg: '#013a63',
  },
  {
    icon: <BarChart3 size={18} />,
    title: 'Progress Analytics',
    desc: 'Rich charts on accuracy trends, confidence distribution, and streak consistency.',
    color: 'from-[#01497c]/20 to-[#468faf]/10',
    iconBg: '#01497c',
  },
];

const stats = [
  { v: '14,829', l: 'Total lookups' },
  { v: '3,241',  l: 'Words saved' },
  { v: '84%',    l: 'Quiz completion' },
  { v: '5 days', l: 'Avg. streak' },
];

export default function LoginPage({ theme, onToggleTheme, onNavigate }: LoginPageProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      {/* ── Navbar ───────────────────────────────────────── */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-4 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--surface-border)', background: 'var(--nav-bg)', backdropFilter: 'blur(16px)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[10px] flex items-center justify-center text-white font-black"
            style={{ background: 'var(--btn-primary-bg)', boxShadow: '0 2px 10px var(--accent-glow)' }}>W</div>
          <span className="font-extrabold text-lg tracking-tight" style={{ color: 'var(--text-primary)' }}>Wordix</span>
          <Badge variant="info" size="xs">Beta</Badge>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <Button size="sm" onClick={() => onNavigate('auth/callback')}>
            Sign in
          </Button>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="flex-1 flex flex-col md:flex-row items-center gap-12 px-6 md:px-12 lg:px-20 py-16 max-w-7xl mx-auto w-full">
        {/* Left copy */}
        <div className="flex-1 max-w-xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs font-semibold"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--surface-border)', color: 'var(--text-secondary)' }}>
            <Sparkles size={12} style={{ color: 'var(--accent)' }} />
            English → Turkish Learning Platform
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.08] mb-5"
            style={{ color: 'var(--text-primary)' }}>
            Learn words,<br />
            phrases,&nbsp;&amp;&nbsp;sentences<br />
            <span className="gradient-text">with adaptive quizzes.</span>
          </h1>

          <p className="text-base md:text-lg mb-8 leading-relaxed max-w-md" style={{ color: 'var(--text-muted)' }}>
            Wordix builds a personal vocabulary engine from your searches — surfacing the right words exactly when you need them.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Button size="lg" onClick={() => onNavigate('auth/callback')}
              icon={<ArrowRight size={17} />} iconRight={undefined}>
              Continue with Wordix ID
            </Button>
            <Button size="lg" variant="secondary" onClick={() => onNavigate('user/dashboard')}>
              See demo flow
            </Button>
          </div>

          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            🔐 Authentication powered by Keycloak — no passwords stored in Wordix.
          </p>
        </div>

        {/* Feature cards 2×2 */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg w-full">
          {features.map((f, i) => (
            <div
              key={i}
              className={`rounded-[18px] p-5 cursor-default t-all ${hoveredCard === i ? '-translate-y-1' : ''}`}
              style={{
                background: `linear-gradient(135deg, var(--surface) 0%, var(--surface-2) 100%)`,
                border: '1px solid var(--surface-border)',
                boxShadow: hoveredCard === i ? 'var(--shadow-lg)' : 'var(--shadow)',
              }}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="w-9 h-9 rounded-[10px] flex items-center justify-center mb-3 text-white"
                style={{ background: `linear-gradient(135deg, ${f.iconBg}, #2c7da0)` }}>
                {f.icon}
              </div>
              <h3 className="text-sm font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats footer ─────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--surface-border)', background: 'var(--surface)' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex flex-wrap gap-8 items-center justify-between">
          <div className="flex flex-wrap gap-8">
            {stats.map((s, i) => (
              <div key={i}>
                <p className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>{s.v}</p>
                <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{s.l}</p>
              </div>
            ))}
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>© 2026 Wordix · English–Turkish Vocabulary Engine</p>
        </div>
      </footer>
    </div>
  );
}
