import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import BottomNav from './BottomNav';
import type { Theme, AppView } from '../../types';

interface AppShellProps {
  children: ReactNode;
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  theme: Theme;
  onToggleTheme: () => void;
  username: string;
  isAdmin?: boolean;
  onLogout: () => void;
  pageTitle?: string;
}

export default function AppShell({ children, currentView, onNavigate, theme, onToggleTheme, username, isAdmin, onLogout, pageTitle }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      <Sidebar
        currentView={currentView}
        onNavigate={onNavigate}
        isAdmin={isAdmin}
        username={username}
        onLogout={onLogout}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar
          theme={theme}
          onToggleTheme={onToggleTheme}
          username={username}
          isAdmin={isAdmin}
          onNavigate={onNavigate}
          pageTitle={pageTitle}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
          <div className="max-w-6xl mx-auto page-enter">
            {children}
          </div>
        </main>
      </div>
      <BottomNav currentView={currentView} onNavigate={onNavigate} />
    </div>
  );
}
