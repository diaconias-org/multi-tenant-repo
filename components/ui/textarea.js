import * as React from 'react';
import { cn } from '@/lib/utils';

function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded-md border border-input bg-card px-3 py-2 text-sm placeholder:text-muted-foreground transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
