import type { ReactNode } from 'react';
import Button from './Button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
}

export default function EmptyState({ icon, title, description, action, secondaryAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {icon && (
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}>
          {icon}
        </div>
      )}
      <h3 className="text-lg font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      {description && <p className="text-sm max-w-xs" style={{ color: 'var(--text-muted)' }}>{description}</p>}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3 mt-5">
          {action && <Button onClick={action.onClick}>{action.label}</Button>}
          {secondaryAction && <Button variant="secondary" onClick={secondaryAction.onClick}>{secondaryAction.label}</Button>}
        </div>
      )}
    </div>
  );
}
