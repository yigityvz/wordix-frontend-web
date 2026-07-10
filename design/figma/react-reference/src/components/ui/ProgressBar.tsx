interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'xs' | 'sm' | 'md';
  color?: 'auto' | 'blue' | 'green' | 'amber' | 'red';
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

const colorFn = {
  auto: (pct: number) =>
    pct >= 70 ? 'linear-gradient(90deg,#059669,#10b981)'
    : pct >= 40 ? 'linear-gradient(90deg,#2c7da0,#61a5c2)'
    : 'linear-gradient(90deg,#d97706,#f59e0b)',
  blue:  () => 'linear-gradient(90deg,#013a63,#2c7da0)',
  green: () => 'linear-gradient(90deg,#059669,#10b981)',
  amber: () => 'linear-gradient(90deg,#d97706,#f59e0b)',
  red:   () => 'linear-gradient(90deg,#dc2626,#f87171)',
};

const heights = { xs: 'h-1', sm: 'h-1.5', md: 'h-2.5' };

export default function ProgressBar({ value, max = 100, size = 'sm', color = 'auto', showLabel = false, animated = true, className = '' }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const bg = colorFn[color](pct);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`flex-1 rounded-full overflow-hidden ${heights[size]}`} style={{ background: 'var(--surface-2)' }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: bg, transition: animated ? 'width 0.6s cubic-bezier(0.4,0,0.2,1)' : 'none' }}
        />
      </div>
      {showLabel && (
        <span className="font-mono text-xs font-semibold w-8 text-right flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
}
