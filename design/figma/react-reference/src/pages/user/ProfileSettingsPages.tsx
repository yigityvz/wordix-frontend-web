import { useState } from 'react';
import { LogOut, ExternalLink, ChevronDown, Sun, Moon, Monitor, Bell, Globe } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import type { AppView, Theme } from '../../types';

interface ProfilePageProps {
  onNavigate: (view: AppView) => void;
  onLogout: () => void;
  theme: Theme;
  onToggleTheme: () => void;
  username: string;
  email: string;
}

export function ProfilePage({ onNavigate, onLogout, theme, onToggleTheme, username, email }: ProfilePageProps) {
  const [showDebug, setShowDebug] = useState(false);
  const keycloakId = 'kc-8a2f3b91-c4d5-4e6f-a7b8-9c0d1e2f3a4b';

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <h1 className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>Profile</h1>

      {/* Avatar + info */}
      <Card>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black flex-shrink-0" style={{ background: 'var(--btn-primary-bg)' }}>
            {username[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-extrabold" style={{ color: 'var(--text-primary)' }}>{username}</h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="info">basic_user</Badge>
            </div>
          </div>
        </div>
        <div className="mt-5 pt-5 flex flex-col gap-2" style={{ borderTop: '1px solid var(--surface-border)' }}>
          <Button
            variant="secondary"
            fullWidth
            icon={<ExternalLink size={15} />}
            onClick={() => window.open('http://localhost:8080/realms/wordix/account', '_blank')}
          >
            Manage Keycloak Account
          </Button>
          <Button
            variant="danger"
            fullWidth
            icon={<LogOut size={15} />}
            onClick={onLogout}
          >
            Logout
          </Button>
        </div>
      </Card>

      {/* Debug info */}
      <Card>
        <button
          className="w-full flex items-center justify-between text-sm font-semibold"
          style={{ color: 'var(--text-muted)' }}
          onClick={() => setShowDebug(!showDebug)}
        >
          <span>Developer Info</span>
          <ChevronDown size={16} className={`transition-transform ${showDebug ? 'rotate-180' : ''}`} />
        </button>
        {showDebug && (
          <div className="mt-4 p-3 rounded-[12px]" style={{ background: 'var(--surface-2)', border: '1px solid var(--surface-border)' }}>
            <p className="text-xs font-mono mb-1" style={{ color: 'var(--text-muted)' }}>Keycloak ID</p>
            <p className="text-xs font-mono break-all" style={{ color: 'var(--text-secondary)' }}>{keycloakId}</p>
            <p className="text-xs font-mono mt-3 mb-1" style={{ color: 'var(--text-muted)' }}>Realm</p>
            <p className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>wordix</p>
            <p className="text-xs font-mono mt-3 mb-1" style={{ color: 'var(--text-muted)' }}>Client</p>
            <p className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>wordix-web</p>
          </div>
        )}
      </Card>
    </div>
  );
}

interface SettingsPageProps {
  theme: Theme;
  onSetTheme: (t: Theme) => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function SettingsPage({ theme, onSetTheme, onToast }: SettingsPageProps) {
  const [notifQuiz, setNotifQuiz] = useState(true);
  const [notifStreak, setNotifStreak] = useState(true);
  const [notifReview, setNotifReview] = useState(false);

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <h1 className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>Settings</h1>

      {/* Theme */}
      <Card>
        <h2 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Appearance</h2>
        <div className="grid grid-cols-3 gap-2">
          {([['light', <Sun size={16} />, 'Light'], ['dark', <Moon size={16} />, 'Dark'], ['system', <Monitor size={16} />, 'System']] as const).map(([v, icon, label]) => (
            <button
              key={v}
              onClick={() => onSetTheme(v === 'system' ? 'light' : v as Theme)}
              className="flex flex-col items-center gap-2 p-3 rounded-[12px] text-sm font-semibold transition-all"
              style={{ background: theme === v ? 'var(--nav-active)' : 'var(--surface-2)', color: theme === v ? 'var(--nav-active-text)' : 'var(--text-secondary)', border: `1px solid ${theme === v ? 'transparent' : 'var(--surface-border)'}` }}
            >
              {icon}{label}
            </button>
          ))}
        </div>
      </Card>

      {/* Quiz preferences */}
      <Card>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Quiz Preferences</h2>
          <Badge variant="warning">Coming soon</Badge>
        </div>
        <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Custom quiz defaults, spaced repetition tuning, and difficulty calibration will be available here.</p>
        <div className="space-y-3 opacity-50 pointer-events-none">
          {[{ label: 'Default quiz type', value: 'Multiple Choice' }, { label: 'Questions per session', value: '10' }, { label: 'Difficulty calibration', value: 'Automatic' }].map((s, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-[12px]" style={{ background: 'var(--surface-2)', border: '1px solid var(--surface-border)' }}>
              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{s.label}</p>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>{s.value}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <h2 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Notifications</h2>
        <div className="space-y-3">
          {[
            { label: 'Quiz reminders', sub: 'Remind me to take daily quizzes', val: notifQuiz, set: setNotifQuiz },
            { label: 'Streak alerts', sub: 'Warn me before losing my streak', val: notifStreak, set: setNotifStreak },
            { label: 'Review due', sub: 'Alert when items are due for review', val: notifReview, set: setNotifReview },
          ].map((n, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-[12px]" style={{ background: 'var(--surface-2)', border: '1px solid var(--surface-border)' }}>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{n.label}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{n.sub}</p>
              </div>
              <button
                onClick={() => { n.set(!n.val); onToast('Preference saved', 'success'); }}
                className={`relative w-11 h-6 rounded-full transition-all ${n.val ? 'bg-[#2c7da0]' : ''}`}
                style={{ background: n.val ? '#2c7da0' : 'var(--surface-border)' }}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${n.val ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
        <Button fullWidth size="sm" className="mt-4" onClick={() => onToast('Notification preferences saved', 'success')}>
          Save preferences
        </Button>
      </Card>

      {/* Language */}
      <Card>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Language &amp; Region</h2>
          <Badge variant="warning">Coming soon</Badge>
        </div>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Motivation messages, UI language, and regional preferences will be configurable here.</p>
      </Card>
    </div>
  );
}
