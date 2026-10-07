'use client';

import { useState } from 'react';
import { Share2, Link as LinkIcon, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  const btnBase =
    'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-semibold text-white transition-all duration-150 hover:-translate-y-px hover:opacity-90';

  return (
    <div className="mx-auto mb-12 flex max-w-[760px] flex-wrap items-center justify-between gap-4 rounded-xl border border-accent/25 bg-card p-5">
      <span className="inline-flex items-center gap-1.5 text-[13.5px] font-bold text-foreground">
        <Share2 size={16} className="text-primary" /> Compartilhar esta matéria:
      </span>
      <div className="flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={compartilharWhatsApp}
          className={cn(btnBase, 'bg-[#25d366]')}
          title="Compartilhar no WhatsApp"
        >
          WhatsApp
        </button>
        <button
          type="button"
          onClick={compartilharFacebook}
          className={cn(btnBase, 'bg-[#1877f2]')}
          title="Compartilhar no Facebook"
        >
          Facebook
        </button>
        <button
          type="button"
          onClick={compartilharTwitter}
          className={cn(btnBase, 'bg-black')}
          title="Compartilhar no X (Twitter)"
        >
          X (Twitter)
        </button>
        <button
          type="button"
          onClick={copiarLink}
          className={cn(btnBase, 'bg-gray-600')}
          title="Copiar link"
        >
          {copiado ? <Check size={14} /> : <LinkIcon size={14} />}
          {copiado ? 'Copiado!' : 'Copiar link'}
        </button>
      </div>
    </div>
  );
}
