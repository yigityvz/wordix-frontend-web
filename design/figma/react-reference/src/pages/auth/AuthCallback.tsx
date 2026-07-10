import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import type { AppView } from '../../types';

interface AuthCallbackProps {
  onNavigate: (view: AppView) => void;
}

const steps = [
  { id: 1, label: 'Validating token', sublabel: 'Verifying Keycloak session...' },
  { id: 2, label: 'Loading profile', sublabel: 'Fetching user data from API...' },
  { id: 3, label: 'Preparing dashboard', sublabel: 'Setting up your workspace...' },
];

export default function AuthCallback({ onNavigate }: AuthCallbackProps) {
  const [step, setStep] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setStep(1), 600));
    timers.push(setTimeout(() => setStep(2), 1400));
    timers.push(setTimeout(() => setStep(3), 2200));
    timers.push(setTimeout(() => onNavigate('user/dashboard'), 3000));
    return () => timers.forEach(clearTimeout);
  }, [onNavigate]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6" style={{ background: 'var(--bg)' }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'var(--error-bg)' }}>
          <XCircle size={32} className="text-red-400" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Authentication Failed</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>We couldn't verify your session. Please try signing in again.</p>
        </div>
        <Button onClick={() => onNavigate('auth/login')}>Back to Login</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-6" style={{ background: 'var(--bg)' }}>
      {/* Logo */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black" style={{ background: 'var(--btn-primary-bg)', boxShadow: 'var(--shadow-lg)' }}>
          W
        </div>
        <span className="font-extrabold text-xl tracking-tight" style={{ color: 'var(--text-primary)' }}>Wordix</span>
      </div>

      <div className="text-center">
        <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Signing you in...</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Please wait while we set up your session.</p>
      </div>

      {/* Steps */}
      <div className="w-full max-w-sm space-y-3">
        {steps.map((s, i) => {
          const done = step > s.id;
          const active = step === s.id;
          return (
            <div
              key={s.id}
              className="flex items-center gap-4 px-4 py-3 rounded-[14px] transition-all duration-300"
              style={{
                background: active ? 'var(--surface)' : 'transparent',
                border: `1px solid ${active ? 'var(--ring)' : 'transparent'}`,
                opacity: step < s.id ? 0.35 : 1,
              }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                {done ? (
                  <CheckCircle2 size={20} className="text-emerald-400" />
                ) : active ? (
                  <Loader2 size={20} className="animate-spin" style={{ color: 'var(--accent)' }} />
                ) : (
                  <div className="w-5 h-5 rounded-full" style={{ border: '2px solid var(--surface-border)' }} />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{s.label}</p>
                {active && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.sublabel}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
