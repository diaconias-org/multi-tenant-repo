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
    <form onSubmit={handleSubmit} style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 28px 60px' }}>
      {/* Barra Superior de Ações */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link
            href="/admin/noticias"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 6,
              background: '#fff',
              border: '1px solid #d1d5db',
              color: 'var(--text)',
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={16} /> Voltar às Notícias
          </Link>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--bordo)', margin: 0, fontFamily: 'var(--font-cormorant)' }}>
            {isEdicao ? 'Editar Notícia' : 'Nova Notícia'}
          </h2>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="submit"
            disabled={salvando}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 22px',
              background: 'var(--bordo)',
              color: '#fff',
              borderRadius: 6,
              border: 'none',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Save size={16} /> {salvando ? 'Salvando…' : 'Salvar Notícia'}
          </button>
        </div>
      </div>

      {/* Mensagens de Feedback */}
      {erro && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: '#fee2e2', border: '1px solid #f87171', borderRadius: 8, color: '#b91c1c', marginBottom: 20 }}>
          <AlertCircle size={20} />
          <span>{erro}</span>
        </div>
      )}

      {sucesso && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: '#d1fae5', border: '1px solid #34d399', borderRadius: 8, color: '#065f46', marginBottom: 20 }}>
          <CheckCircle2 size={20} />
          <span>Notícia salva com sucesso! Redirecionando…</span>
        </div>
      )}

      {/* Layout em Grid de 2 Colunas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
        {/* Coluna Principal (Conteúdo) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Título & Slug */}
          <div style={{ background: '#fff', padding: 24, borderRadius: 'var(--radius-md)', border: '1px solid var(--cream-dark)' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
              Título da Notícia *
            </label>
            <input
              type="text"
              value={titulo}
              onChange={handleTituloChange}
              placeholder="Ex: Paróquia celebra novenário com grande participação dos fiéis"
              style={{
                width: '100%',
                padding: '12px 14px',
                fontSize: 16,
                fontWeight: 600,
                border: '1.5px solid var(--gray-border)',
                borderRadius: 'var(--radius-sm)',
                outline: 'none',
              }}
              required
            />

            {/* Slug URL */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, fontSize: 12, color: 'var(--text-light)' }}>
              <span>Link permanente:</span>
              <span style={{ color: 'var(--bordo)', fontWeight: 600 }}>/noticias/</span>
              {slugManual ? (
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(gerarSlugLocal(e.target.value))}
                  style={{
                    padding: '4px 8px',
                    fontSize: 12,
                    borderRadius: 4,
                    border: '1px solid #d1d5db',
                    color: 'var(--text)',
                  }}
                />
              ) : (
                <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 4, color: '#374151' }}>
                  {slug || 'slug-automatico'}
                </code>
              )}
              <button
                type="button"
                onClick={() => setSlugManual(!slugManual)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 11,
                  padding: 2,
                }}
                title={slugManual ? 'Bloquear slug automático' : 'Editar slug manualmente'}
              >
                {slugManual ? <Lock size={12} /> : <Unlock size={12} />}
                {slugManual ? 'Bloquear' : 'Editar'}
              </button>
            </div>
          </div>

          {/* Subtítulo / Resumo */}
          <div style={{ background: '#fff', padding: 24, borderRadius: 'var(--radius-md)', border: '1px solid var(--cream-dark)' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
              Subtítulo / Breve Descrição (Opcional)
            </label>
            <textarea
              value={subtitulo}
              onChange={(e) => setSubtitulo(e.target.value)}
              placeholder="Uma linha de introdução que aparece logo abaixo do título na notícia..."
              rows={2}
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: 14,
                border: '1.5px solid var(--gray-border)',
                borderRadius: 'var(--radius-sm)',
                outline: 'none',
                resize: 'vertical',
              }}
            />
            <p style={{ fontSize: 11, color: 'var(--text-light)', margin: '4px 0 0' }}>
              Utilizado na página individual e nos cards de destaque. Se vazio, o sistema extrai o começo do texto.
            </p>
          </div>

          {/* Editor de Conteúdo */}
          <div style={{ background: '#fff', padding: 24, borderRadius: 'var(--radius-md)', border: '1px solid var(--cream-dark)' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
              Conteúdo da Notícia *
            </label>
            <RichTextEditor
              value={conteudo}
              onChange={(novoHtml) => setConteudo(novoHtml)}
              placeholder="Escreva a notícia completa aqui. Use a barra para formatar títulos, negrito, listas e adicionar fotos..."
            />
          </div>
        </div>

        {/* Coluna Lateral (Configurações e Metadados) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Card: Status e Publicação */}
          <div style={{ background: '#fff', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid var(--cream-dark)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calendar size={16} color="var(--bordo)" /> Publicação
            </h3>

            {/* Status */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-light)', marginBottom: 4 }}>
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1.5px solid var(--gray-border)',
                  fontSize: 13,
                  background: '#fff',
                }}
              >
                <option value="rascunho">Rascunho (Privado)</option>
                <option value="publicada">Publicada (Visível a todos)</option>
                <option value="agendada">Agendada</option>
                <option value="arquivada">Arquivada</option>
              </select>
            </div>

            {/* Data de publicação */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-light)', marginBottom: 4 }}>
                Data de Publicação
              </label>
              <input
                type="datetime-local"
                value={publicadoEm}
                onChange={(e) => setPublicadoEm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 6,
                  border: '1.5px solid var(--gray-border)',
                  fontSize: 12,
                }}
              />
              <small style={{ fontSize: 11, color: 'var(--text-light)' }}>
                Se vazio ao publicar, usa a data/hora atual.
              </small>
            </div>

            {/* Destaque */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderTop: '1px solid #f3f4f6' }}>
              <input
                type="checkbox"
                id="check-destaque"
                checked={destaque}
                onChange={(e) => setDestaque(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: 'var(--bordo)', cursor: 'pointer' }}
              />
              <label htmlFor="check-destaque" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Star size={14} color="#b89a5a" fill={destaque ? '#b89a5a' : 'none'} />
                Notícia em Destaque
              </label>
            </div>
          </div>

          {/* Card: Imagem de Capa */}
          <div style={{ background: '#fff', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid var(--cream-dark)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Upload size={16} color="var(--bordo)" /> Imagem de Capa
            </h3>

            {imagemCapaPreview ? (
              <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid #e5e7eb', marginBottom: 12 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagemCapaPreview}
                  alt="Prévia da capa"
                  style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
                />
                <button
                  type="button"
                  onClick={handleRemoverCapa}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: 'rgba(0,0,0,0.7)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: 26,
                    height: 26,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  title="Remover capa"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed #d1d5db',
                  borderRadius: 8,
                  padding: '24px 16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: '#fafafa',
                  marginBottom: 12,
                }}
              >
                <Upload size={24} style={{ margin: '0 auto 8px', color: '#9ca3af' }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--bordo)', display: 'block' }}>
                  Clique para selecionar capa
                </span>
                <small style={{ fontSize: 11, color: '#9ca3af' }}>JPG, PNG ou WEBP (máx. 10MB)</small>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>

          {/* Card: Categoria e Autor */}
          <div style={{ background: '#fff', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid var(--cream-dark)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileText size={16} color="var(--bordo)" /> Metadados
            </h3>

            {/* Categoria */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-light)', marginBottom: 4 }}>
                Categoria
              </label>
              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1.5px solid var(--gray-border)',
                  fontSize: 13,
                  background: '#fff',
                }}
              >
                <option value="">Sem categoria</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nome}
                  </option>
                ))}
              </select>
              <Link
                href="/admin/noticias/categorias"
                style={{ fontSize: 11, color: 'var(--bordo)', textDecoration: 'none', display: 'inline-block', marginTop: 4 }}
              >
                + Gerenciar categorias
              </Link>
            </div>

            {/* Autor */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-light)', marginBottom: 4 }}>
                Nome do Autor / Pastoral
              </label>
              <input
                type="text"
                value={autorNome}
                onChange={(e) => setAutorNome(e.target.value)}
                placeholder="Ex: Pascom, Padre Raimundo..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1.5px solid var(--gray-border)',
                  fontSize: 13,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
