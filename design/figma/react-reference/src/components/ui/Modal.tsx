import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  noScroll?: boolean;
}

const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl' };

export default function Modal({ open, onClose, title, children, footer, size = 'md', noScroll }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ background: 'rgba(0,9,15,0.65)', backdropFilter: 'blur(6px)' }} />

      {/* Sheet */}
      <div
        className={`relative w-full ${sizes[size]} rounded-[20px] bounce-in shadow-2xl`}
        style={{
          background: 'var(--surface-solid)',
          border: '1px solid var(--surface-border)',
          maxHeight: 'calc(100dvh - 2rem)',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--surface-border)' }}>
          <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-[10px] hover:bg-[var(--surface-2)] t-all"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className={`px-5 py-4 flex-1 ${noScroll ? '' : 'overflow-y-auto'}`}>{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-5 py-4 flex items-center justify-end gap-3 flex-shrink-0"
            style={{ borderTop: '1px solid var(--surface-border)' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
