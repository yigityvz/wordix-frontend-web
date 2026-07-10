import { LayoutDashboard, Search, BookOpen, GraduationCap, User } from 'lucide-react';
import type { AppView } from '../../types';

interface BottomNavProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

const items = [
  { id: 'user/dashboard' as AppView, label: 'Home', icon: LayoutDashboard },
  { id: 'user/lookup' as AppView, label: 'Lookup', icon: Search },
  { id: 'user/dictionary' as AppView, label: 'Dictionary', icon: BookOpen },
  { id: 'user/quiz/start' as AppView, label: 'Quiz', icon: GraduationCap },
  { id: 'user/profile' as AppView, label: 'Profile', icon: User },
];

export default function BottomNav({ currentView, onNavigate }: BottomNavProps) {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 flex items-center justify-around px-2 z-40"
      style={{ height: '64px', background: 'var(--surface)', borderTop: '1px solid var(--surface-border)', backdropFilter: 'blur(12px)' }}
    >
      {items.map(item => {
        const active = currentView.startsWith(item.id.replace('/start', ''));
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-[12px] transition-all"
            style={{ color: active ? 'var(--accent)' : 'var(--text-muted)' }}
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            <span className="text-[10px] font-semibold">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
