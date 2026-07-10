import { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertTriangle, Search, Home, RefreshCw } from 'lucide-react';
import Button from '../../components/ui/Button';
import type { AppView } from '../../types';

interface NavProp { onNavigate: (v: AppView) => void; }

// ─── 404 Not Found ────────────────────────────────────────────────────────────
export function NotFoundPage({ onNavigate }: NavProp) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 page-enter"
      style={{ background: 'var(--bg)' }}>
      <div className="relative">
        <p className="text-[120px] font-black leading-none select-none"
          style={{ color: 'var(--surface-border)', fontVariantNumeric: 'tabular-nums' }}>
          404
        </p>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'var(--surface)', border: '1px solid var(--surface-border)', boxShadow: 'var(--shadow-lg)' }}>
            <Search size={28} style={{ color: 'var(--text-muted)' }} />
          </div>
        </div>
      </div>
      <div className="text-center max-w-sm">
        <h1 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>Page not found</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="secondary" icon={<RefreshCw size={14} />} onClick={() => window.history.back()}>Go back</Button>
        <Button icon={<Home size={14} />} onClick={() => onNavigate('user/dashboard')}>Dashboard</Button>
      </div>
    </div>
  );
}

// ─── 500 Server Error ─────────────────────────────────────────────────────────
export function ServerErrorPage({ onNavigate }: NavProp) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 page-enter"
      style={{ background: 'var(--bg)' }}>
      <div className="relative">
        <p className="text-[120px] font-black leading-none select-none"
          style={{ color: 'var(--surface-border)' }}>500</p>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'var(--error-bg)', border: '1px solid var(--error-border)', boxShadow: 'var(--shadow-lg)' }}>
            <AlertTriangle size={28} className="text-red-400" />
          </div>
        </div>
      </div>
      <div className="text-center max-w-sm">
        <p className="text-xs font-mono font-bold mb-2" style={{ color: 'var(--text-muted)' }}>500 INTERNAL SERVER ERROR</p>
        <h1 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>Something went wrong</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          The server encountered an unexpected error. This has been logged automatically.
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="secondary" icon={<RefreshCw size={14} />} onClick={() => window.location.reload()}>Retry</Button>
        <Button icon={<Home size={14} />} onClick={() => onNavigate('user/dashboard')}>Dashboard</Button>
      </div>
      <p className="text-xs font-mono" style={{ color: 'var(--text-faint)' }}>Error ID: WDX-20260710-1438-a9f3</p>
    </div>
  );
}

// ─── Offline Banner ───────────────────────────────────────────────────────────
export function OfflineBanner() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const on  = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online',  on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  if (online) return null;

  return (
    <div className="offline-banner fixed top-0 left-0 right-0 z-[300] flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold"
      style={{ background: '#d97706', color: 'white' }}>
      <WifiOff size={15} />
      You're offline — some features may be unavailable
    </div>
  );
}
