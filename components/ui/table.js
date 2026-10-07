import * as React from 'react';
import { cn } from '@/lib/utils';

function Table({ className, wrapperClassName, ...props }) {
  return (
    <div className={cn('overflow-auto rounded-md border border-border bg-card shadow-soft', wrapperClassName)}>
      <table className={cn('w-full border-collapse text-sm', className)} {...props} />
    </div>
  );
}

function TableHeader({ className, ...props }) {
  return (
    <thead
      className={cn('[&_tr]:border-b-2 [&_tr]:border-border [&_tr]:bg-secondary', className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }) {
  return <tbody className={cn('[&_tr:last-child]:border-b-0', className)} {...props} />;
}

function TableRow({ className, ...props }) {
  return (
    <tr
      className={cn('border-b border-secondary transition-all duration-250 hover:bg-primary/[0.03]', className)}
      {...props}
    />
  );
}

function TableHead({ className, ...props }) {
  return (
    <th
      className={cn(
        'px-[18px] py-[13px] text-left text-[11.5px] font-bold uppercase tracking-[1px] text-soft',
        className
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }) {
  return <td className={cn('px-[18px] py-[13px] text-foreground', className)} {...props} />;
}

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
