import * as React from 'react';
import { cn } from '@/lib/utils';

function Select({ className, children, ...props }) {
  return (
    <select
      className={cn(
        'h-10 cursor-pointer rounded-md border-[1.5px] border-input bg-card px-3.5 py-2 text-[13px] text-foreground transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export { Select };
