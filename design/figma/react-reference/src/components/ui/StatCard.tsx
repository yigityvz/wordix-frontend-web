import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: ReactNode;
  trend?: { value: number; label: string };
  accent?: boolean;
  onClick?: () => void;
  mini?: boolean;
}

export default function StatCard({ label, value, sub, icon, trend, accent, onClick, mini }: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={`card relative overflow-hidden ${mini ? 'p-4' : 'p-5'} ${onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''} ${accent ? 'card-glow' : ''}`}
    >
      {accent && (
        <div className="absolute inset-0 pointer-events-none opacity-50"
          style={{ background: 'linear-gradient(135deg, rgba(44,125,160,0.10) 0%, transparent 70%)' }} />
      )}
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5 truncate" style={{ color: 'var(--text-muted)' }}>{label}</p>
          <p className={`font-black leading-none ${mini ? 'text-2xl' : 'text-3xl'}`} style={{ color: 'var(--text-primary)' }}>{value}</p>
          {sub && <p className="text-xs mt-1.5 truncate" style={{ color: 'var(--text-muted)' }}>{sub}</p>}
          {trend && (
            <p className={`text-xs font-bold mt-2 ${trend.value > 0 ? 'text-emerald-400' : trend.value < 0 ? 'text-red-400' : ''}`}
              style={trend.value === 0 ? { color: 'var(--text-muted)' } : {}}>
              {trend.value > 0 ? '↑' : trend.value < 0 ? '↓' : '→'} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--surface-2)', color: 'var(--accent)' }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
