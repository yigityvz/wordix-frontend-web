import { Lock, AlertTriangle, ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import type { AppView } from '../../types';

interface ErrorPageProps {
  onNavigate: (view: AppView) => void;
}

export function UnauthorizedPage({ onNavigate }: ErrorPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6" style={{ background: 'var(--bg)' }}>
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: 'var(--warning-bg)' }}>
        <Lock size={36} className="text-amber-400" />
      </div>
      <div className="text-center max-w-sm">
        <p className="text-xs font-mono font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>401 UNAUTHORIZED</p>
        <h1 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>Session Expired</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Your session has expired or is invalid. Please sign in again to continue.</p>
      </div>
      <Button onClick={() => onNavigate('auth/login')}>Sign in again</Button>
    </div>
  );
}

export function ForbiddenPage({ onNavigate }: ErrorPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6" style={{ background: 'var(--bg)' }}>
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: 'var(--error-bg)' }}>
        <AlertTriangle size={36} className="text-red-400" />
      </div>
      <div className="text-center max-w-sm">
        <p className="text-xs font-mono font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>403 FORBIDDEN</p>
        <h1 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>Access Denied</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>You do not have permission to access this area. This section is restricted to administrators.</p>
      </div>
      <div className="flex gap-3">
        <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => onNavigate('user/dashboard')}>
          Go to Dashboard
        </Button>
        <Button onClick={() => onNavigate('auth/login')}>Sign in with different account</Button>
      </div>
    </div>
  );
}
