'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Save,
  ArrowLeft,
  Upload,
  X,
  Lock,
  Unlock,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Star,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import RichTextEditor from './RichTextEditor';

function gerarSlugLocal(texto) {
  if (!texto) return '';
  return texto
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const cardClass = 'rounded-md p-5 shadow-none';
const cardTitleClass = 'mb-4 flex items-center gap-2 text-sm font-bold text-foreground';
const smallLabel = 'mb-1 block text-xs text-muted-foreground';
const fieldClass = 'h-auto rounded-md border-[1.5px] border-input px-3 py-2 text-[13px]';

export default function NoticiaForm({ noticia = null, categorias = [], autorPadrao = '' }) {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const isEdicao = Boolean(noticia?.id);

  // Estados dos campos
  const [titulo, setTitulo] = useState(noticia?.titulo || '');
  const [slug, setSlug] = useState(noticia?.slug || '');
  const [slugManual, setSlugManual] = useState(false);
  const [subtitulo, setSubtitulo] = useState(noticia?.subtitulo || '');
  const [resumo, setResumo] = useState(noticia?.resumo || '');
  const [conteudo, setConteudo] = useState(noticia?.conteudo || '');
  const [categoriaId, setCategoriaId] = useState(noticia?.categoria_id || '');
  const [autorNome, setAutorNome] = useState(noticia?.autor_nome || autorPadrao || '');
  const [status, setStatus] = useState(noticia?.status || 'rascunho');
  const [destaque, setDestaque] = useState(Boolean(noticia?.destaque));
  const [publicadoEm, setPublicadoEm] = useState(
    noticia?.publicado_em ? new Date(noticia.publicado_em).toISOString().slice(0, 16) : ''
  );

  // Imagem de capa
  const [imagemCapaFile, setImagemCapaFile] = useState(null);
  const [imagemCapaPreview, setImagemCapaPreview] = useState(noticia?.imagem_capa || null);
  const [removerImagem, setRemoverImagem] = useState(false);

  // Estados de envio e feedback
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  // Atualização automática do slug quando o título muda
  function handleTituloChange(e) {
    const novoTitulo = e.target.value;
    setTitulo(novoTitulo);
    if (!slugManual) {
      setSlug(gerarSlugLocal(novoTitulo));
    }
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErro('Por favor, selecione apenas arquivos de imagem (JPG, PNG, WEBP).');
      return;
    }

    setImagemCapaFile(file);
    setRemoverImagem(false);
    const reader = new FileReader();
    reader.onload = (ev) => setImagemCapaPreview(ev.target.result);
    reader.readAsDataURL(file);
  }

  function handleRemoverCapa() {
    setImagemCapaFile(null);
    setImagemCapaPreview(null);
    setRemoverImagem(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setSucesso(false);

    if (!titulo.trim()) {
      setErro('O título da notícia é obrigatório.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!conteudo.trim()) {
      setErro('O conteúdo da notícia não pode ficar vazio.');
      return;
    }

    try {
      setSalvando(true);
      const fd = new FormData();
      fd.append('titulo', titulo.trim());
      fd.append('slug', slug.trim() || gerarSlugLocal(titulo));
      if (subtitulo.trim()) fd.append('subtitulo', subtitulo.trim());
      if (resumo.trim()) fd.append('resumo', resumo.trim());
      fd.append('conteudo', conteudo);
      if (categoriaId) fd.append('categoriaId', String(categoriaId));
      if (autorNome.trim()) fd.append('autorNome', autorNome.trim());
      fd.append('status', status);
      fd.append('destaque', destaque ? 'true' : 'false');
      if (publicadoEm) fd.append('publicadoEm', new Date(publicadoEm).toISOString());

      if (imagemCapaFile) {
        fd.append('imagemCapa', imagemCapaFile);
      } else if (removerImagem) {
        fd.append('removerImagemCapa', 'true');
      }

      const url = isEdicao ? `/api/noticias/${noticia.id}` : '/api/noticias';
      const method = isEdicao ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.erro || 'Erro ao salvar notícia.');
      }

      setSucesso(true);
      setTimeout(() => {
        router.push('/admin/noticias');
        router.refresh();
      }, 1000);
    } catch (err) {
      setErro(err.message || 'Erro inesperado.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-[1100px] px-7 pb-[60px] pt-6 max-[600px]:px-4">
      {/* Barra Superior de Ações */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/noticias"
            className={cn(buttonVariants({ variant: 'outline' }), 'h-auto rounded-md border-gray-300 px-3.5 py-2 text-[13px] text-foreground shadow-none hover:text-foreground')}
          >
            <ArrowLeft size={16} /> Voltar às Notícias
          </Link>
          <h2 className="m-0 font-heading text-[22px] font-bold text-primary">
            {isEdicao ? 'Editar Notícia' : 'Nova Notícia'}
          </h2>
        </div>

        <div className="flex gap-2.5">
          <Button type="submit" disabled={salvando} className="h-auto rounded-md px-[22px] py-2.5 text-sm shadow-soft">
            <Save size={16} /> {salvando ? 'Salvando…' : 'Salvar Notícia'}
          </Button>
        </div>
      </div>

      {/* Mensagens de Feedback */}
      {erro && (
        <div className="mb-5 flex items-center gap-2.5 rounded-lg border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          <AlertCircle size={20} />
          <span>{erro}</span>
        </div>
      )}

      {sucesso && (
        <div className="mb-5 flex items-center gap-2.5 rounded-lg border border-emerald-400 bg-emerald-100 px-4 py-3 text-emerald-800">
          <CheckCircle2 size={20} />
          <span>Notícia salva com sucesso! Redirecionando…</span>
        </div>
      )}

      {/* Layout em Grid de 2 Colunas */}
      <div className="grid grid-cols-[1fr_340px] items-start gap-6 max-[900px]:grid-cols-1">
        {/* Coluna Principal (Conteúdo) */}
        <div className="flex flex-col gap-5">
          {/* Título & Slug */}
          <Card className="rounded-md p-6 shadow-none">
            <Label className="mb-1.5 block text-[13px] font-bold text-foreground">
              Título da Notícia *
            </Label>
            <Input
              type="text"
              value={titulo}
              onChange={handleTituloChange}
              placeholder="Ex: Paróquia celebra novenário com grande participação dos fiéis"
              className="h-auto border-[1.5px] border-input px-3.5 py-3 text-base font-semibold focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/10"
              required
            />

            {/* Slug URL */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>Link permanente:</span>
              <span className="font-semibold text-primary">/noticias/</span>
              {slugManual ? (
                <Input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(gerarSlugLocal(e.target.value))}
                  className="h-auto w-auto rounded px-2 py-1 text-xs text-foreground"
                />
              ) : (
                <code className="rounded bg-muted px-1.5 py-0.5 text-soft">
                  {slug || 'slug-automatico'}
                </code>
              )}
              <button
                type="button"
                onClick={() => setSlugManual(!slugManual)}
                className="inline-flex cursor-pointer items-center gap-1 p-0.5 text-[11px] text-gray-500"
                title={slugManual ? 'Bloquear slug automático' : 'Editar slug manualmente'}
              >
                {slugManual ? <Lock size={12} /> : <Unlock size={12} />}
                {slugManual ? 'Bloquear' : 'Editar'}
              </button>
            </div>
          </Card>

          {/* Subtítulo / Resumo */}
          <Card className="rounded-md p-6 shadow-none">
            <Label className="mb-1.5 block text-[13px] font-bold text-foreground">
              Subtítulo / Breve Descrição (Opcional)
            </Label>
            <Textarea
              value={subtitulo}
              onChange={(e) => setSubtitulo(e.target.value)}
              placeholder="Uma linha de introdução que aparece logo abaixo do título na notícia..."
              rows={2}
              className="resize-y border-[1.5px] border-input px-3.5 py-2.5 text-sm"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              Utilizado na página individual e nos cards de destaque. Se vazio, o sistema extrai o começo do texto.
            </p>
          </Card>

          {/* Editor de Conteúdo */}
          <Card className="rounded-md p-6 shadow-none">
            <Label className="mb-2 block text-[13px] font-bold text-foreground">
              Conteúdo da Notícia *
            </Label>
            <RichTextEditor
              value={conteudo}
              onChange={(novoHtml) => setConteudo(novoHtml)}
              placeholder="Escreva a notícia completa aqui. Use a barra para formatar títulos, negrito, listas e adicionar fotos..."
            />
          </Card>
        </div>

        {/* Coluna Lateral (Configurações e Metadados) */}
        <div className="flex flex-col gap-5">
          {/* Card: Status e Publicação */}
          <Card className={cardClass}>
            <h3 className={cardTitleClass}>
              <Calendar size={16} className="text-primary" /> Publicação
            </h3>

            {/* Status */}
            <div className="mb-4">
              <Label className={smallLabel}>Status</Label>
              <Select value={status} onChange={(e) => setStatus(e.target.value)} className="h-auto w-full px-3 py-2">
                <option value="rascunho">Rascunho (Privado)</option>
                <option value="publicada">Publicada (Visível a todos)</option>
                <option value="agendada">Agendada</option>
                <option value="arquivada">Arquivada</option>
              </Select>
            </div>

            {/* Data de publicação */}
            <div className="mb-4">
              <Label className={smallLabel}>Data de Publicação</Label>
              <Input
                type="datetime-local"
                value={publicadoEm}
                onChange={(e) => setPublicadoEm(e.target.value)}
                className="h-auto rounded-md border-[1.5px] border-input px-2.5 py-2 text-xs"
              />
              <small className="text-[11px] text-muted-foreground">
                Se vazio ao publicar, usa a data/hora atual.
              </small>
            </div>

            {/* Destaque */}
            <div className="flex items-center gap-2.5 border-t border-gray-100 py-2.5">
              <input
                type="checkbox"
                id="check-destaque"
                checked={destaque}
                onChange={(e) => setDestaque(e.target.checked)}
                className="size-4 cursor-pointer accent-primary"
              />
              <Label htmlFor="check-destaque" className="flex cursor-pointer items-center gap-1.5 text-[13px] text-foreground">
                <Star size={14} className="text-accent" fill={destaque ? 'currentColor' : 'none'} />
                Notícia em Destaque
              </Label>
            </div>
          </Card>

          {/* Card: Imagem de Capa */}
          <Card className={cardClass}>
            <h3 className={cardTitleClass}>
              <Upload size={16} className="text-primary" /> Imagem de Capa
            </h3>

            {imagemCapaPreview ? (
              <div className="relative mb-3 overflow-hidden rounded-lg border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagemCapaPreview}
                  alt="Prévia da capa"
                  className="block h-40 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoverCapa}
                  className="absolute right-2 top-2 flex size-[26px] cursor-pointer items-center justify-center rounded-full bg-black/70 text-white"
                  title="Remover capa"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="mb-3 cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-neutral-50 px-4 py-6 text-center"
              >
                <Upload size={24} className="mx-auto mb-2 text-gray-400" />
                <span className="block text-[13px] font-semibold text-primary">
                  Clique para selecionar capa
                </span>
                <small className="text-[11px] text-gray-400">JPG, PNG ou WEBP (máx. 10MB)</small>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </Card>

          {/* Card: Categoria e Autor */}
          <Card className={cardClass}>
            <h3 className={cardTitleClass}>
              <FileText size={16} className="text-primary" /> Metadados
            </h3>

            {/* Categoria */}
            <div className="mb-4">
              <Label className={smallLabel}>Categoria</Label>
              <Select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} className="h-auto w-full px-3 py-2">
                <option value="">Sem categoria</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nome}
                  </option>
                ))}
              </Select>
              <Link
                href="/admin/noticias/categorias"
                className="mt-1 inline-block text-[11px] text-primary"
              >
                + Gerenciar categorias
              </Link>
            </div>

            {/* Autor */}
            <div>
              <Label className={smallLabel}>Nome do Autor / Pastoral</Label>
              <Input
                type="text"
                value={autorNome}
                onChange={(e) => setAutorNome(e.target.value)}
                placeholder="Ex: Pascom, Padre Raimundo..."
                className={fieldClass}
              />
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}
