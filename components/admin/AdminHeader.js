'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Receipt, Newspaper, Tag, LogOut, ArrowLeft, Plus } from 'lucide-react';
import styles from './admin.module.css';

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
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <div>
          <h1 className={styles.headerTitle}>Painel Administrativo</h1>
          <p className={styles.headerSub}>Diaconia Territorial São Raimundo Nonato</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{usuarioNome}</span>
            <span className={styles.userEmail}>{usuarioEmail}</span>
          </div>
          <Link
            href="/"
            className={styles.btnLogout}
            style={{ textDecoration: 'none', background: 'var(--cream)', color: 'var(--bordo)' }}
          >
            <ArrowLeft size={14} style={{ display: 'inline', marginRight: 4 }} />
            Início
          </Link>
          <button
            className={styles.btnLogout}
            onClick={handleLogout}
            disabled={saindo}
          >
            <LogOut size={14} style={{ display: 'inline', marginRight: 4 }} />
            {saindo ? 'Saindo…' : 'Sair'}
          </button>
        </div>
      </div>

      {/* Barra de Navegação de Módulos */}
      <div style={{ background: 'rgba(0,0,0,0.15)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px', display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
          <nav style={{ display: 'flex', gap: 8 }}>
            <Link
              href="/admin"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '12px 16px',
                fontSize: 13,
                fontWeight: 600,
                color: '#fff',
                textDecoration: 'none',
                borderBottom: isComprovantes ? '3px solid #b89a5a' : '3px solid transparent',
                opacity: isComprovantes ? 1 : 0.75,
              }}
            >
              <Receipt size={16} /> Comprovantes
            </Link>
            <Link
              href="/admin/noticias"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '12px 16px',
                fontSize: 13,
                fontWeight: 600,
                color: '#fff',
                textDecoration: 'none',
                borderBottom: isNoticias ? '3px solid #b89a5a' : '3px solid transparent',
                opacity: isNoticias ? 1 : 0.75,
              }}
            >
              <Newspaper size={16} /> Notícias
            </Link>
            <Link
              href="/admin/noticias/categorias"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '12px 16px',
                fontSize: 13,
                fontWeight: 600,
                color: '#fff',
                textDecoration: 'none',
                borderBottom: isCategorias ? '3px solid #b89a5a' : '3px solid transparent',
                opacity: isCategorias ? 1 : 0.75,
              }}
            >
              <Tag size={16} /> Categorias
            </Link>
          </nav>

          {isNoticias && !pathname.endsWith('/novo') && (
            <Link
              href="/admin/noticias/novo"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                background: '#b89a5a',
                color: '#fff',
                borderRadius: '9999px',
                fontSize: 12,
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              <Plus size={14} /> Nova Notícia
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
