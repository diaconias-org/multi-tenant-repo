import Link from 'next/link';
import { Newspaper, Heart, Home } from 'lucide-react';
import styles from '@/app/home.module.css';

export default function PublicNav() {
  return (
    <nav className={styles.nav}>
      <div className={styles.navInner}>
        <Link href="/" className={styles.navBrand} style={{ textDecoration: 'none' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-diaconia.png" alt="Logo Diaconia" className={styles.navLogo} />
          <div>
            <span className={styles.navEyebrow}>Diaconia Territorial</span>
            <span className={styles.navName}>São Raimundo Nonato</span>
          </div>
        </Link>
        <div className={styles.navLinks}>
          <Link href="/" className={styles.navLink} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <Home size={15} /> Início
          </Link>
          <Link href="/noticias" className={styles.navLink} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--bordo)', fontWeight: 700 }}>
            <Newspaper size={15} /> Notícias
          </Link>
          <Link href="/#agenda" className={styles.navLink}>
            Agenda
          </Link>
          <Link href="/comprovante" className={styles.btnHeroPix} style={{ padding: '8px 18px', fontSize: 13, textDecoration: 'none' }}>
            <Heart size={14} fill="currentColor" /> Devolver Dízimo
          </Link>
        </div>
      </div>
    </nav>
  );
}
