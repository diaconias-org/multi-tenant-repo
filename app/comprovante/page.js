'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Heart, ClipboardCopy, CheckCircle2, CloudUpload, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PIX_KEY = process.env.NEXT_PUBLIC_PIX_KEY || '86995982235';

const headerBtnClass = cn(
  buttonVariants({ variant: 'outline' }),
  'h-auto rounded-full border-[1.5px] border-input px-[18px] py-[9px] text-[13px] text-soft shadow-none hover:-translate-y-px hover:border-primary hover:shadow-soft'
);

const fieldClass =
  'h-auto border-[1.5px] border-input px-3.5 py-[11px] text-sm placeholder:opacity-70 focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/10';

export default function ComprovantePage() {
  const [nome, setNome]             = useState('');
  const [telefone, setTelefone]     = useState('');
  const [fotoFile, setFotoFile]     = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [salvando, setSalvando]     = useState(false);
  const [enviado, setEnviado]       = useState(false);
  const [feedback, setFeedback]     = useState({ msg: '', tipo: '' });
  const [toastMsg, setToastMsg]     = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const fileInputRef = useRef(null);

  /* ── TOAST ── */
  function showToast(msg, duration = 3200) {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), duration);
  }

  /* ── COPIAR PIX ── */
  async function copyPix() {
    try {
      await navigator.clipboard.writeText(PIX_KEY);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = PIX_KEY;
      ta.style.cssText = 'position:fixed;opacity:0;';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    showToast('Chave Pix copiada!');
  }

  /* ── MÁSCARA DE TELEFONE ── */
  function handleTelefoneChange(e) {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 0) v = '(' + v;
    if (v.length > 3) v = v.slice(0, 3) + ') ' + v.slice(3);
    if (v.length > 9) v = v.slice(0, 10) + '-' + v.slice(10);
    setTelefone(v.slice(0, 15));
  }

  /* ── SELEÇÃO DE FOTO ── */
  function handleFotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setFotoFile(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => setFotoPreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setFotoPreview('pdf');
    }
    showToast('Comprovante selecionado!');
  }

  function removerFoto(e) {
    e.preventDefault();
    e.stopPropagation();
    setFotoFile(null);
    setFotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  /* ── SALVAR REGISTRO ── */
  async function handleSalvar(e) {
    e.preventDefault();
    setFeedback({ msg: '', tipo: '' });
    if (!nome.trim()) {
      setFeedback({ msg: 'Por favor, informe seu nome completo.', tipo: 'error' });
      return;
    }
    if (!fotoFile) {
      setFeedback({ msg: 'Por favor, anexe o comprovante (foto ou PDF).', tipo: 'error' });
      return;
    }
    setSalvando(true);
    try {
      const fd = new FormData();
      fd.append('nome', nome.trim());
      if (telefone) fd.append('telefone', telefone);
      fd.append('foto', fotoFile);

      const res = await fetch('/api/comprovantes', { method: 'POST', body: fd });
      const data = await res.json();

      if (!res.ok) throw new Error(data.erro || 'Erro ao salvar');
      
      // Limpa os campos
      setNome('');
      setTelefone('');
      setFotoFile(null);
      setFotoPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      setEnviado(true);
      showToast('Informações salvas!');
    } catch (err) {
      setFeedback({ msg: err.message, tipo: 'error' });
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 z-[100] border-b border-border bg-card shadow-soft">
        <div className="mx-auto flex max-w-[860px] items-center justify-between gap-4 px-6 py-3.5">
          <div className="flex items-center gap-[13px]">
            <div className="flex size-[46px] shrink-0 items-center justify-center rounded-full border-2 border-input bg-gradient-to-br from-muted to-border text-primary">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold uppercase tracking-[1.8px] text-primary">Devolução do Dízimo</span>
              <span className="text-[14.5px] font-bold text-foreground">Diaconia Territorial</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Link href="/" className={headerBtnClass}>← Início</Link>
            <button className={headerBtnClass} onClick={() => document.getElementById('pix-section').scrollIntoView({ behavior: 'smooth', block: 'center' })}>
              <Heart size={16} fill="currentColor" /> Devolva seu dízimo
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-[620px] px-6 pb-10 pt-16 text-center max-[600px]:[&_h1]:text-[26px]">
        <p className="mb-3.5 block text-[11.5px] font-semibold uppercase tracking-[2.5px] text-primary">Um gesto de comunhão</p>
        <h1 className="mb-[18px] font-heading text-[clamp(28px,4.5vw,46px)] font-bold leading-[1.2] tracking-[-0.5px] text-foreground">Diaconia Territorial São Raimundo Nonato</h1>
        <p className="mx-auto max-w-[480px] text-[15px] leading-[1.75] text-soft">
          Copie a chave Pix abaixo para realizar a devolução do dízimo.
          Depois, envie o comprovante pelo WhatsApp.
        </p>
      </section>

      {/* CARD PRINCIPAL */}
      <main className="mx-auto mb-[60px] max-w-[780px] px-5">
        <div className="overflow-hidden rounded-[32px] border border-border bg-card shadow-card">

          {/* CHAVE PIX NO TOPO */}
          <section className="mb-6 px-8 pt-8 max-[600px]:px-5" id="pix-section">
            <div className="mb-[18px] rounded-md border-[1.5px] border-accent-light bg-[linear-gradient(135deg,color-mix(in_oklab,var(--accent)_8%,white),color-mix(in_oklab,var(--accent)_16%,white))] px-6 py-5">
              <div className="flex items-center justify-between gap-4 max-[600px]:flex-col max-[600px]:items-start max-[600px]:gap-3">
                <div>
                  <p className="mb-[5px] text-[10px] font-bold uppercase tracking-[2px] text-accent">Chave Pix</p>
                  <p className="text-[28px] font-bold tabular-nums text-foreground max-[600px]:text-[22px]">{PIX_KEY}</p>
                </div>
                <button
                  className="inline-flex shrink-0 items-center gap-[7px] whitespace-nowrap rounded-full border-[1.5px] border-accent-light bg-card px-4 py-[9px] text-[12.5px] font-semibold text-accent transition-all duration-250 hover:-translate-y-px hover:border-accent hover:bg-accent hover:text-white"
                  onClick={copyPix}
                >
                  <ClipboardCopy size={18} /> Toque para copiar
                </button>
              </div>
            </div>
          </section>

          {/* PASSOS */}
          <section className="px-8 pb-8 pt-9 max-[600px]:px-5">
            <h2 className="mb-7 text-center text-[17px] font-bold text-foreground">Como realizar a devolução</h2>
            <div className="flex flex-wrap justify-center gap-2.5 max-[600px]:gap-2">
              {[
                'Copiar a chave Pix',
                'Abrir o app do seu banco e fazer o Pix',
                'Registrar suas informações',
                'Salvar o comprovante',
                'Voltar ao site',
              ].map((label, i) => (
                <div
                  key={i}
                  className="flex w-32 flex-col items-center gap-2.5 rounded-md border border-border bg-secondary px-3.5 py-[18px] text-center transition-all duration-250 hover:-translate-y-[3px] hover:border-primary hover:bg-primary/5 hover:shadow-soft max-[600px]:w-[calc(33%-6px)] max-[600px]:px-2 max-[600px]:py-3.5"
                >
                  <div className="flex size-[34px] items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-[0_3px_10px_color-mix(in_oklab,var(--primary)_30%,transparent)]">{i + 1}</div>
                  <p className="text-[11.5px] font-semibold leading-[1.4] text-primary max-[600px]:text-[10.5px]">{label}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="mx-7 h-px bg-muted" />

          {/* FORMULÁRIO DE REGISTRO E UPLOAD */}
          <section className="px-8 pb-7 pt-8 max-[600px]:px-5">
            <h2 className="mb-2 text-lg font-bold text-foreground">Registrar informações</h2>
            <p className="mb-[22px] text-[13px] leading-[1.65] text-muted-foreground">
              Preencha seus dados para salvar nesta experiência.
              O acesso aos dados fica restrito ao administrador.
            </p>

            {enviado ? (
              <div className="mt-4 flex animate-scale-in flex-col items-center justify-center rounded-md border-[1.5px] border-green-200 bg-green-50 px-6 py-9 text-center">
                <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-green-500 text-white shadow-[0_4px_14px_rgb(34_197_94/0.3)]"><CheckCircle2 size={48} /></div>
                <h3 className="mb-2 text-lg font-bold text-green-800">Comprovante salvo com sucesso!</h3>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-7 h-auto rounded-full border-[1.5px] border-green-300 bg-white px-[22px] py-3 text-[13.5px] text-green-800 shadow-soft hover:-translate-y-px hover:border-green-400 hover:bg-green-100 hover:text-green-800"
                  onClick={() => {
                    setEnviado(false);
                    setFeedback({ msg: '', tipo: '' });
                  }}
                >
                  Enviar outro comprovante
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSalvar} className="flex flex-col gap-[18px]" noValidate>
                <div className="grid grid-cols-2 gap-4 max-[600px]:grid-cols-1">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="r-nome">Nome completo</Label>
                    <Input
                      id="r-nome"
                      type="text"
                      placeholder="Seu nome completo"
                      value={nome}
                      onChange={e => setNome(e.target.value)}
                      autoComplete="name"
                      required
                      className={fieldClass}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="r-tel">Telefone (opcional)</Label>
                    <Input
                      id="r-tel"
                      type="tel"
                      placeholder="(86) 90000-0000"
                      value={telefone}
                      onChange={handleTelefoneChange}
                      maxLength={15}
                      className={fieldClass}
                    />
                  </div>
                </div>
                
                {/* Upload do comprovante */}
                <div className="mb-3 mt-6">
                  <span className="mb-2 block text-[12.5px] font-semibold text-soft">Anexar comprovante</span>
                  <label
                    className={cn(
                      'relative flex min-h-[110px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-input bg-secondary px-4 py-6 text-center transition-all duration-250 hover:border-primary hover:bg-primary/5 focus-visible:border-primary focus-visible:bg-primary/5 focus-visible:outline-none',
                      fotoFile && 'border-primary bg-primary/5 p-0'
                    )}
                    htmlFor="r-foto"
                    tabIndex={0}
                    onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); fileInputRef.current?.click(); }}}
                  >
                    {!fotoFile ? (
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-primary/60"><CloudUpload size={24} /></span>
                        <span className="text-[13.5px] font-semibold text-soft">Toque para selecionar a foto</span>
                        <small className="text-[11.5px] text-muted-foreground">JPG, PNG ou PDF</small>
                      </div>
                    ) : fotoPreview === 'pdf' ? (
                      <div className="flex h-[140px] flex-col items-center justify-center gap-2.5 text-[13px] font-semibold text-soft">
                        <FileText size={42} color="#c0392b" />
                        <span>{fotoFile.name}</span>
                      </div>
                    ) : (
                      <div className="relative max-h-60 min-h-40 w-full overflow-hidden rounded-[calc(var(--radius-md)-2px)]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={fotoPreview} alt="Prévia do comprovante" className="block size-full object-cover" />
                        <button
                          type="button"
                          className="absolute right-2.5 top-2.5 flex size-[30px] items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-all duration-250 hover:bg-primary/85"
                          onClick={removerFoto}
                          aria-label="Remover imagem"
                        ><X size={16} /></button>
                      </div>
                    )}
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="r-foto"
                    accept="image/*,application/pdf"
                    capture="environment"
                    className="hidden"
                    onChange={handleFotoChange}
                  />
                </div>

                {feedback.msg && (
                  <p className={cn('text-[13px] font-medium', feedback.tipo === 'error' ? 'text-primary' : 'text-green-700')}>
                    {feedback.msg}
                  </p>
                )}
                <Button type="submit" variant="brand" size="lg" className="w-full text-[15px] font-bold" disabled={salvando}>
                  {salvando ? 'Salvando…' : 'Salvar informações'}
                </Button>
              </form>
            )}
            
            <div className="mb-2 mt-9 flex items-center justify-center gap-3" aria-hidden="true">
              <span className="h-px max-w-[120px] flex-1 bg-border" />
              <span className="text-primary opacity-60"><Heart size={16} fill="currentColor" /></span>
              <span className="h-px max-w-[120px] flex-1 bg-border" />
            </div>
          </section>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="p-6 text-center text-[12.5px] text-muted-foreground">
        <p>© {new Date().getFullYear()} Diaconia Territorial São Raimundo Nonato — Curralinhos, PI</p>
      </footer>

      {/* TOAST */}
      <div
        className={cn(
          'pointer-events-none fixed bottom-8 left-1/2 z-[9999] flex -translate-x-1/2 translate-y-20 items-center gap-[9px] whitespace-nowrap rounded-full bg-foreground px-[22px] py-3 text-sm font-semibold text-white opacity-0 shadow-card transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
          toastVisible && 'translate-y-0 opacity-100'
        )}
        role="status"
        aria-live="polite"
      >
        <CheckCircle2 size={18} /> <span>{toastMsg}</span>
      </div>
    </>
  );
}
