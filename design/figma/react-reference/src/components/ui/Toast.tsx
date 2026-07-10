import { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X, Wifi } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
}

const cfg: Record<ToastType, { icon: typeof CheckCircle2; color: string; bar: string }> = {
  success: { icon: CheckCircle2, color: '#10b981', bar: '#059669' },
  error:   { icon: AlertCircle,  color: '#f87171', bar: '#dc2626' },
  warning: { icon: AlertTriangle,color: '#f59e0b', bar: '#d97706' },
  info:    { icon: Info,         color: '#61a5c2', bar: '#2c7da0' },
};

function ToastItem({ toast, onRemove }: { toast: ToastData; onRemove: (id: string) => void }) {
  const [exiting, setExiting] = useState(false);
  const { icon: Icon, color, bar } = cfg[toast.type];

  useEffect(() => {
    const t1 = setTimeout(() => setExiting(true), 3700);
    const t2 = setTimeout(() => onRemove(toast.id), 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [toast.id, onRemove]);

  return (
    <div
      className={`${exiting ? 'toast-exit' : 'toast-enter'} flex items-start gap-3 px-4 py-3 min-w-[280px] max-w-xs shadow-xl`}
      style={{
        background: 'var(--surface-solid)',
        border: '1px solid var(--surface-border)',
        borderRadius: '14px',
        borderTopColor: bar,
        borderTopWidth: '2px',
      }}
    >
      <Icon size={16} className="mt-0.5 flex-shrink-0" style={{ color }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{toast.message}</p>
        {toast.description && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{toast.description}</p>}
      </div>
      <button
        onClick={() => { setExiting(true); setTimeout(() => onRemove(toast.id), 220); }}
        className="flex-shrink-0 mt-0.5 opacity-40 hover:opacity-80 t-all"
        style={{ color: 'var(--text-muted)' }}
      >
        <X size={13} />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onRemove }: { toasts: ToastData[]; onRemove: (id: string) => void }) {
  return (
    <div className="fixed bottom-6 right-4 z-[200] flex flex-col gap-2.5 items-end pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onRemove={onRemove} />
        </div>
      ))}
    </div>
  );
}
