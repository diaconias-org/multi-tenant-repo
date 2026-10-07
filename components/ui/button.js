import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary-light',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline: 'border border-border bg-card shadow-sm hover:bg-secondary hover:text-primary',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-border',
        ghost: 'hover:bg-secondary hover:text-primary',
        link: 'text-primary underline-offset-4 hover:underline',
        gold: 'bg-accent text-accent-foreground shadow hover:bg-accent-light',
        brand: 'bg-gradient-to-br from-primary to-primary-dark text-primary-foreground shadow-md hover:-translate-y-0.5 hover:shadow-lg',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-lg px-8 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({ className, variant, size, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
