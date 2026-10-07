import * as React from 'react';
import { cn } from '@/lib/utils';

function Label({ className, ...props }) {
  return (
    <label
      className={cn('text-[12.5px] font-semibold text-soft', className)}
      {...props}
    />
  );
}

export { Label };
