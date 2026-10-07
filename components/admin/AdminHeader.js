'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Receipt, Newspaper, Tag, LogOut, ArrowLeft, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';

const tabClass = (active) =>
  cn(
    'inline-flex items-center gap-1.5 border-b-[3px] px-4 py-3 text-[13px] font-semibold text-white transition-opacity',
    active ? 'border-accent opacity-100' : 'border-transparent opacity-75 hover:opacity-100'
  );

const headerBtnClass =
  'h-auto rounded-full border-[1.5px] border-white/30 bg-white/15 px-[18px] py-[9px] text-[13px] text-white shadow-none hover:-translate-y-px hover:bg-white/25 hover:text-white';

export default function AdminHeader({ usuarioNome, usuarioEmail }) {
  const pathname = usePathname();
  const [saindo, setSaindo] = useState(false);

  async function handleLogout() {
    setSaindo(true);
    await signOut({ callbackUrl: '/login' });
  }

  const isComprovantes = pathname === '/admin';
  const isNoticias = pathname.startsWith('/admin/noticias') && !pathname.includes('/categorias');
  const isCategorias = pathname.includes('/categorias');

  return (
    <header className="bg-gradient-to-br from-primary to-primary-dark text-primary-foreground">
      <div className="mx-auto flex max-w-[1100px] items-center justify-between px-7 py-5 max-[600px]:flex-col max-[600px]:items-start max-[600px]:gap-3.5">
        <div>
          <h1 className="mb-0.5 font-heading text-2xl font-bold">Painel Administrativo</h1>
          <p className="text-[13px] opacity-80">Diaconia Territorial São Raimundo Nonato</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-white">{usuarioNome}</span>
            <span className="text-[11.5px] text-white/65">{usuarioEmail}</span>
          </div>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'h-auto rounded-full border-[1.5px] border-white/30 bg-secondary px-[18px] py-[9px] text-[13px] text-primary shadow-none hover:-translate-y-px'
            )}
          >
            <ArrowLeft size={14} />
            Início
          </Link>
          <Button variant="ghost" className={headerBtnClass} onClick={handleLogout} disabled={saindo}>
            <LogOut size={14} />
            {saindo ? 'Saindo…' : 'Sair'}
          </Button>
        </div>
      </div>

      {/* Barra de Navegação de Módulos */}
      <div className="border-t border-white/10 bg-black/15">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-3 px-7">
          <nav className="flex gap-2">
            <Link href="/admin" className={tabClass(isComprovantes)}>
              <Receipt size={16} /> Comprovantes
            </Link>
            <Link href="/admin/noticias" className={tabClass(isNoticias)}>
              <Newspaper size={16} /> Notícias
            </Link>
            <Link href="/admin/noticias/categorias" className={tabClass(isCategorias)}>
              <Tag size={16} /> Categorias
            </Link>
          </nav>

          {isNoticias && !pathname.endsWith('/novo') && (
            <Link
              href="/admin/noticias/novo"
              className={cn(buttonVariants({ variant: 'gold' }), 'h-auto rounded-full px-3.5 py-1.5 text-xs shadow-[0_2px_4px_rgb(0_0_0/0.2)]')}
            >
              <Plus size={14} /> Nova Notícia
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
