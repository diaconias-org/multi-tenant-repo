'use client';

import { useState } from 'react';
import { Share2, Link as LinkIcon, Check } from 'lucide-react';
import styles from './noticias.module.css';

export default function ShareButtons({ titulo, url }) {
  const [copiado, setCopiado] = useState(false);

  function compartilharWhatsApp() {
    const texto = encodeURIComponent(`${titulo}\n\n${url}`);
    window.open(`https://api.whatsapp.com/send?text=${texto}`, '_blank');
  }

  function compartilharFacebook() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  }

  function compartilharTwitter() {
    const texto = encodeURIComponent(titulo);
    window.open(`https://twitter.com/intent/tweet?text=${texto}&url=${encodeURIComponent(url)}`, '_blank');
  }

  async function copiarLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    }
  }

  return (
    <div className={styles.shareBar}>
      <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <Share2 size={16} color="var(--bordo)" /> Compartilhar esta matéria:
      </span>
      <div className={styles.shareButtons}>
        <button
          type="button"
          onClick={compartilharWhatsApp}
          className={`${styles.shareBtn} ${styles.btnWhatsapp}`}
          title="Compartilhar no WhatsApp"
        >
          WhatsApp
        </button>
        <button
          type="button"
          onClick={compartilharFacebook}
          className={`${styles.shareBtn} ${styles.btnFacebook}`}
          title="Compartilhar no Facebook"
        >
          Facebook
        </button>
        <button
          type="button"
          onClick={compartilharTwitter}
          className={`${styles.shareBtn} ${styles.btnTwitter}`}
          title="Compartilhar no X (Twitter)"
        >
          X (Twitter)
        </button>
        <button
          type="button"
          onClick={copiarLink}
          className={`${styles.shareBtn} ${styles.btnCopy}`}
          title="Copiar link"
        >
          {copiado ? <Check size={14} /> : <LinkIcon size={14} />}
          {copiado ? 'Copiado!' : 'Copiar link'}
        </button>
      </div>
    </div>
  );
}
