'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Modal / Dialog leve (sem dependências externas).
 * Fecha ao clicar no overlay ou pressionar Esc.
 */
function Dialog({ onClose, className, overlayClassName, children }) {
  React.useEffect(() => {
    if (!onClose) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-5 backdrop-blur-[6px]',
        overlayClassName
      )}
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        className={cn('relative w-full rounded-[20px] bg-card shadow-lift', className)}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function DialogTitle({ className, ...props }) {
  return <h3 className={cn('text-lg font-bold text-foreground', className)} {...props} />;
}

function DialogDescription({ className, ...props }) {
  return <p className={cn('text-[14.5px] leading-relaxed text-soft', className)} {...props} />;
}

export { Dialog, DialogTitle, DialogDescription };
