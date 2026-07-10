import type { ReactNode } from 'react';

type BadgeVariant =
  | 'default' | 'word' | 'phrase' | 'sentence'
  | 'new' | 'learning' | 'review' | 'mastered'
  | 'difficult' | 'favorite' | 'admin' | 'super'
  | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  size?: 'xs' | 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

const styles: Record<BadgeVariant, string> = {
  default:   'bg-[var(--surface-2)]  text-[var(--text-secondary)]  border-[var(--surface-border)]',
  word:      'bg-[#014f86]/14  text-[#1ea0fe]  border-[#014f86]/28',
  phrase:    'bg-[#2a6f97]/14  text-[#6baed5]  border-[#2a6f97]/28',
  sentence:  'bg-[#2c7da0]/14  text-[#89c2d9]  border-[#2c7da0]/28',
  new:       'bg-[#2c7da0]/14  text-[#89c2d9]  border-[#2c7da0]/22',
  learning:  'bg-[#d97706]/12  text-[#f59e0b]  border-[#d97706]/28',
  review:    'bg-[#7c3aed]/12  text-[#a78bfa]  border-[#7c3aed]/28',
  mastered:  'bg-[#059669]/12  text-[#10b981]  border-[#059669]/28',
  difficult: 'bg-[#dc2626]/12  text-[#f87171]  border-[#dc2626]/28',
  favorite:  'bg-[#d97706]/12  text-[#f59e0b]  border-[#d97706]/28',
  admin:     'bg-[#014f86]/18  text-[#1ea0fe]  border-[#014f86]/35',
  super:     'bg-gradient-to-r from-[#014f86]/20 to-[#2c7da0]/20 text-[#89c2d9] border-[#2c7da0]/30',
  success:   'bg-[#059669]/12  text-[#10b981]  border-[#059669]/28',
  warning:   'bg-[#d97706]/12  text-[#f59e0b]  border-[#d97706]/28',
  error:     'bg-[#dc2626]/12  text-[#f87171]  border-[#dc2626]/28',
  info:      'bg-[#2c7da0]/14  text-[#89c2d9]  border-[#2c7da0]/28',
};

const sizeStyles = {
  xs: 'text-[10px] px-1.5 py-0.5 gap-1',
  sm: 'text-xs     px-2   py-0.5 gap-1',
  md: 'text-sm     px-2.5 py-1   gap-1.5',
};

export default function Badge({ variant = 'default', children, size = 'sm', dot = false, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full font-semibold border ${sizeStyles[size]} ${styles[variant]} ${className}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 pulse-dot" />}
      {children}
    </span>
  );
}
