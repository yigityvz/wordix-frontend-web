import { useState } from 'react';
import { Search, Bell, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import Badge from '../ui/Badge';
import type { Theme, AppView } from '../../types';

interface TopbarProps {
  theme: Theme;
  onToggleTheme: () => void;
  username: string;
  isAdmin?: boolean;
  onNavigate: (view: AppView) => void;
  onSearch?: (q: string) => void;
  pageTitle?: string;
}

export default function Topbar({ theme, onToggleTheme, username, isAdmin, onNavigate, onSearch, pageTitle }: TopbarProps) {
  const [q, setQ] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);

  const notifs = [
    { id: '1', text: '8 items due for review today', time: 'Just now',  unread: true },
    { id: '2', text: '🔥 5-day streak — keep it up!',  time: '1h ago',  unread: true },
    { id: '3', text: '"resilience" added to difficult', time: '3h ago',  unread: false },
  ];
  const unreadCount = notifs.filter(n => n.unread).length;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) { onSearch?.(q); onNavigate('user/lookup'); }
  };

  return (
    <header
      className="flex items-center gap-3 px-4 md:px-6 flex-shrink-0 sticky top-0 z-40"
      style={{
        height: 'var(--topbar-h)',
        background: 'var(--nav-bg)',
        borderBottom: '1px solid var(--surface-border)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      {/* Mobile wordmark */}
      <div className="md:hidden flex items-center gap-2 flex-shrink-0">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-xs"
          style={{ background: 'var(--btn-primary-bg)' }}>W</div>
        <span className="font-extrabold text-sm" style={{ color: 'var(--text-primary)' }}>Wordix</span>
      </div>

      {/* Page title on desktop */}
      {pageTitle && (
        <h1 className="hidden md:block text-base font-bold flex-shrink-0 truncate"
          style={{ color: 'var(--text-primary)' }}>{pageTitle}</h1>
      )}

      {/* Search */}
      <form onSubmit={submit} className="flex-1 max-w-sm hidden sm:block">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--text-muted)' }} />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search words, phrases…"
            className="w-full pl-9 pr-8 py-2 text-sm rounded-[11px] outline-none t-all"
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--surface-border)',
              color: 'var(--text-primary)',
            }}
            onFocus={e => (e.target.style.borderColor = 'var(--ring)')}
            onBlur={e => (e.target.style.borderColor = 'var(--surface-border)')}
          />
          {q && (
            <button type="button" onClick={() => setQ('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--text-muted)' }}>
              <X size={13} />
            </button>
          )}
        </div>
      </form>

      <div className="flex items-center gap-2 ml-auto">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-8 h-8 flex items-center justify-center rounded-[10px] t-all hover:bg-[var(--surface-2)]"
            style={{ border: '1px solid var(--surface-border)', color: 'var(--text-secondary)' }}
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 pulse-dot" />
            )}
          </button>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-10 w-72 rounded-[16px] z-50 shadow-2xl overflow-hidden"
                style={{ background: 'var(--surface-solid)', border: '1px solid var(--surface-border)' }}>
                <div className="px-4 py-3 flex items-center justify-between"
                  style={{ borderBottom: '1px solid var(--surface-border)' }}>
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Notifications</p>
                  <Badge variant="warning" size="xs">{unreadCount} new</Badge>
                </div>
                {notifs.map(n => (
                  <div key={n.id}
                    className={`flex gap-3 px-4 py-3 t-all hover:bg-[var(--surface-2)] cursor-pointer ${!n.unread ? 'opacity-55' : ''}`}
                    style={{ borderBottom: '1px solid var(--surface-border)' }}>
                    {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] flex-shrink-0 mt-1.5" />}
                    <div className={n.unread ? '' : 'ml-3.5'}>
                      <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{n.text}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{n.time}</p>
                    </div>
                  </div>
                ))}
                <div className="px-4 py-2.5">
                  <button
                    onClick={() => setNotifOpen(false)}
                    className="text-xs font-semibold t-all hover:opacity-70"
                    style={{ color: 'var(--accent)' }}>
                    Mark all as read
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Avatar */}
        <button
          onClick={() => onNavigate('user/profile')}
          className="flex items-center gap-2 px-2 py-1.5 rounded-[10px] t-all hover:bg-[var(--surface-2)]"
          style={{ border: '1px solid var(--surface-border)' }}
        >
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: 'var(--btn-primary-bg)' }}>
            {username[0]?.toUpperCase()}
          </div>
          <span className="hidden md:block text-sm font-semibold max-w-[100px] truncate"
            style={{ color: 'var(--text-primary)' }}>{username}</span>
          {isAdmin && <Badge variant="admin" size="xs">Admin</Badge>}
        </button>
      </div>
    </header>
  );
}
