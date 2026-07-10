import type { ReactNode, ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'warning';
type Size = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

const variants: Record<Variant, { className: string; style?: Record<string, string> }> = {
  primary:   { className: 'text-white border-transparent shadow-sm active:scale-[0.97]' },
  secondary: { className: 'border active:scale-[0.97]' },
  ghost:     { className: 'border-transparent active:scale-[0.97]' },
  danger:    { className: 'border active:scale-[0.97]' },
  success:   { className: 'border active:scale-[0.97]' },
  warning:   { className: 'border active:scale-[0.97]' },
};

const sizes: Record<Size, string> = {
  xs: 'px-2.5 py-1   text-xs  gap-1   rounded-[8px]',
  sm: 'px-3   py-1.5 text-sm  gap-1.5 rounded-[10px]',
  md: 'px-4   py-2.5 text-sm  gap-2   rounded-[12px]',
  lg: 'px-6   py-3   text-base gap-2.5 rounded-[14px]',
};

export default function Button({
  variant = 'primary', size = 'md', children, loading = false,
  icon, iconRight, fullWidth = false, className = '', disabled, style, ...props
}: ButtonProps) {
  const inlineStyle: React.CSSProperties = { ...style };
  let variantStyle = '';

  if (variant === 'primary') {
    inlineStyle.background = 'var(--btn-primary-bg)';
  } else if (variant === 'secondary') {
    inlineStyle.background = 'var(--surface-2)';
    inlineStyle.borderColor = 'var(--surface-border)';
    inlineStyle.color = 'var(--text-primary)';
  } else if (variant === 'ghost') {
    inlineStyle.color = 'var(--text-secondary)';
  } else if (variant === 'danger') {
    inlineStyle.background = 'var(--error-bg)';
    inlineStyle.borderColor = 'var(--error-border)';
    inlineStyle.color = 'var(--error)';
  } else if (variant === 'success') {
    inlineStyle.background = 'var(--success-bg)';
    inlineStyle.borderColor = 'var(--success-border)';
    inlineStyle.color = 'var(--success)';
  } else if (variant === 'warning') {
    inlineStyle.background = 'var(--warning-bg)';
    inlineStyle.borderColor = 'var(--warning-border)';
    inlineStyle.color = 'var(--warning)';
  }

  return (
    <button
      style={inlineStyle}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-semibold border transition-all duration-150
        hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none
        ${variants[variant].className}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${variant === 'ghost' ? 'hover:bg-[var(--nav-hover-bg)]' : ''}
        ${className}
      `}
      {...props}
    >
      {loading
        ? <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent spin" />
        : icon}
      <span>{children}</span>
      {!loading && iconRight}
    </button>
  );
}
