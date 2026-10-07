import { cn } from '@/lib/utils';

/** Contêiner central das seções do site público. */
export function SectionContainer({ className, ...props }) {
  return <div className={cn('mx-auto max-w-[1100px] px-7', className)} {...props} />;
}

/** Cabeçalho padrão de seção (eyebrow + título + descrição). */
export function SectionHeading({ eyebrow, title, desc, className, descClassName }) {
  return (
    <div className={className}>
      {eyebrow && (
        <span className="mb-2.5 block text-[11px] font-bold uppercase tracking-[3px] text-primary">
          {eyebrow}
        </span>
      )}
      <h2 className="mb-3.5 font-heading text-[clamp(28px,3.5vw,42px)] font-bold tracking-[-0.3px] text-foreground">
        {title}
      </h2>
      {desc && (
        <p
          className={cn(
            'mb-[52px] max-w-[560px] text-[15.5px] leading-[1.7] text-soft max-[840px]:mb-9',
            descClassName
          )}
        >
          {desc}
        </p>
      )}
    </div>
  );
}
