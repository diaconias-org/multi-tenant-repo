import { cn } from '@/lib/utils';

/** Fundo/página padrão das telas administrativas. */
export function AdminPage({ className, ...props }) {
  return <div className={cn('min-h-screen bg-secondary', className)} {...props} />;
}

/** Área principal de conteúdo das telas administrativas. */
export function AdminMain({ className, ...props }) {
  return (
    <main
      className={cn('mx-auto max-w-[1100px] px-7 pb-[60px] pt-8 max-[600px]:px-4 max-[600px]:pb-10 max-[600px]:pt-5', className)}
      {...props}
    />
  );
}
