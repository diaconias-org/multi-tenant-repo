import Link from 'next/link';
import { Newspaper, Heart, Home } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const navLinkClass =
  'rounded-full px-3.5 py-[7px] text-[13px] font-semibold text-soft transition-all duration-250 hover:bg-border hover:text-primary';

export default function PublicNav() {
  return (
    <nav className="sticky top-0 z-[100] border-b border-input bg-white/95 shadow-[0_2px_16px_rgb(80_40_10/0.07)]">
      <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-4 px-7 py-3">
        <Link href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-diaconia.png" alt="Logo Diaconia" className="size-11 shrink-0 rounded-full border-2 border-input bg-secondary object-cover" />
          <div className="flex flex-col">
            <span className="text-[9.5px] font-bold uppercase leading-tight tracking-[2px] text-primary">Diaconia Territorial</span>
            <span className="text-sm font-bold leading-snug text-foreground">São Raimundo Nonato</span>
          </div>
        </Link>
        <div className="flex items-center gap-1.5 max-[840px]:hidden">
          <Link href="/" className={cn(navLinkClass, 'inline-flex items-center gap-[5px]')}>
            <Home size={15} /> Início
          </Link>
          <Link href="/noticias" className={cn(navLinkClass, 'inline-flex items-center gap-[5px] font-bold text-primary')}>
            <Newspaper size={15} /> Notícias
          </Link>
          <Link href="/#agenda" className={navLinkClass}>
            Agenda
          </Link>
          <Link href="/comprovante" className={cn(buttonVariants({ variant: 'gold' }), 'h-auto rounded-full px-[18px] py-2 text-[13px]')}>
            <Heart size={14} fill="currentColor" /> Devolver Dízimo
          </Link>
        </div>
      </div>
    </nav>
  );
}
