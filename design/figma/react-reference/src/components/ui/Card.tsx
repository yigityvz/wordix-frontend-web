import type { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  glow?: boolean;
  gradient?: boolean;
  as?: 'div' | 'section' | 'article';
}

const pad = { none: '', sm: 'p-4', md: 'p-5', lg: 'p-6' };

export default function Card({
  children, padding = 'md', hover = false, glow = false, gradient = false,
  as: Tag = 'div', className = '', style, ...props
}: CardProps) {
  return (
    <Tag
      className={`card ${pad[padding]} ${hover ? 'hover:-translate-y-0.5 cursor-pointer' : ''} ${glow ? 'card-glow' : ''} ${className}`}
      style={{
        ...(gradient ? { background: 'linear-gradient(135deg, var(--surface) 0%, var(--surface-2) 100%)' } : {}),
        ...style,
      }}
      {...(props as any)}
    >
      {children}
    </Tag>
  );
}
