import { useState } from 'react';
import {
  LayoutDashboard, Search, BookOpen, Layers, GraduationCap,
  BarChart3, User, Settings, ChevronLeft, ChevronRight, LogOut,
  TrendingUp, Cloud, Users, ArrowLeft, Activity, Star, Brain
} from 'lucide-react';
import Badge from '../ui/Badge';
import type { AppView, UserRole } from '../../types';

interface NavItem {
  id: AppView;
  label: string;
  icon: React.FC<{ size?: number; className?: string }>;
  badge?: string;
}

const userNav: NavItem[] = [
  { id: 'user/dashboard',      label: 'Dashboard',  icon: LayoutDashboard },
  { id: 'user/lookup',         label: 'Lookup',     icon: Search },
  { id: 'user/dictionary',     label: 'Dictionary', icon: BookOpen },
  { id: 'user/decks',          label: 'Decks',      icon: Layers },
  { id: 'user/quiz/start',     label: 'Quiz',       icon: GraduationCap },
  { id: 'user/statistics',     label: 'Statistics', icon: BarChart3 },
  { id: 'user/profile',        label: 'Profile',    icon: User },
  { id: 'user/settings',       label: 'Settings',   icon: Settings },
];

const adminNav: NavItem[] = [
  { id: 'admin/dashboard',     label: 'Dashboard',       icon: LayoutDashboard },
  { id: 'admin/lookups',       label: 'Top Lookups',     icon: TrendingUp },
  { id: 'admin/most-saved',    label: 'Most Saved',      icon: Star },
  { id: 'admin/quiz-insights', label: 'Quiz Insights',   icon: Brain },
  { id: 'admin/provider',      label: 'Provider / Import', icon: Cloud },
  { id: 'admin/users',         label: 'Users Overview',  icon: Users },
  { id: 'admin/health',        label: 'System Health',   icon: Activity },
];

interface SidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  isAdmin?: boolean;
  username: string;
  onLogout: () => void;
}

function NavButton({ item, active, collapsed, onClick }: {
  item: NavItem; active: boolean; collapsed: boolean; onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-semibold
        transition-all duration-150 group relative
        ${active ? 'nav-glow-active text-white' : 'hover:bg-[var(--nav-hover-bg)]'}
        ${collapsed ? 'justify-center' : ''}
      `}
      style={active ? {} : { color: 'var(--text-muted)' }}
    >
      {/* Active indicator bar */}
      {active && !collapsed && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-white/60" />
      )}
      <Icon size={17} className="flex-shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
      {!collapsed && item.badge && (
        <Badge variant="error" size="xs" className="ml-auto flex-shrink-0">{item.badge}</Badge>
      )}
    </button>
  );
}

export default function Sidebar({ currentView, onNavigate, isAdmin = false, username, onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const nav = isAdmin ? adminNav : userNav;
  const w = collapsed ? '68px' : '248px';

  const isActive = (id: AppView) => {
    if (currentView === id) return true;
    // fuzzy match for sub-routes
    const base = id.replace('/start', '').replace('/active', '').replace('/summary', '');
    return currentView.startsWith(base) && base !== 'user/' && base !== 'admin/';
  };

  return (
    <aside
      className="hidden md:flex flex-col flex-shrink-0 relative"
      style={{
        width: w,
        minHeight: '100vh',
        background: 'var(--nav-bg)',
        borderRight: '1px solid var(--surface-border)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 py-5"
        style={{ borderBottom: '1px solid var(--surface-border)' }}
      >
        <div
          className="w-8 h-8 rounded-[10px] flex items-center justify-center text-white font-black text-sm flex-shrink-0"
          style={{ background: 'var(--btn-primary-bg)', boxShadow: '0 2px 8px var(--accent-glow)' }}
        >
          W
        </div>
        {!collapsed && (
          <>
            <span className="font-extrabold text-[15px] tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Wordix
            </span>
            {isAdmin && <Badge variant="admin" size="xs">Admin</Badge>}
          </>
        )}
      </div>

      {/* Admin → User switch */}
      {!collapsed && isAdmin && (
        <div className="px-3 pt-3">
          <button
            onClick={() => onNavigate('user/dashboard')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-[10px] text-xs font-semibold t-all hover:opacity-80"
            style={{ background: 'var(--surface-2)', color: 'var(--text-secondary)', border: '1px solid var(--surface-border)' }}
          >
            <ArrowLeft size={13} />
            Back to User App
          </button>
        </div>
      )}

      {/* Section label */}
      {!collapsed && (
        <p className="px-5 pt-5 pb-1.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-faint)' }}>
          {isAdmin ? 'Analytics' : 'Navigation'}
        </p>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-1 space-y-0.5 overflow-y-auto scrollbar-hide">
        {nav.map(item => (
          <NavButton
            key={item.id}
            item={item}
            active={isActive(item.id)}
            collapsed={collapsed}
            onClick={() => onNavigate(item.id)}
          />
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-3 pt-2 space-y-0.5" style={{ borderTop: '1px solid var(--surface-border)' }}>
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: 'var(--btn-primary-bg)' }}>
              {username[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>{username}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{isAdmin ? 'Administrator' : 'Basic User'}</p>
            </div>
          </div>
        )}
        <button
          onClick={onLogout}
          title={collapsed ? 'Logout' : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-semibold t-all hover:bg-red-500/10 hover:text-red-400 ${collapsed ? 'justify-center' : ''}`}
          style={{ color: 'var(--text-muted)' }}
        >
          <LogOut size={16} className="flex-shrink-0" />
          {!collapsed && 'Logout'}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[74px] w-6 h-6 rounded-full flex items-center justify-center z-10 t-all hover:scale-110"
        style={{
          background: 'var(--surface-solid)',
          border: '1px solid var(--surface-border)',
          color: 'var(--text-muted)',
          boxShadow: 'var(--shadow)',
        }}
      >
        {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
      </button>
    </aside>
  );
}
