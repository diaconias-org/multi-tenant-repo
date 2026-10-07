'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Calendar,
  User,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Newspaper,
  Star,
  Frown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

export default function NoticiasClient({
  inicialNoticias = [],
  paginacao = {},
  categorias = [],
  destaqueInicial = null,
}) {
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('');
  const [ordenacao, setOrdenacao] = useState('recente');

  // Filtragem no cliente para resposta instantânea
  const noticiasFiltradas = inicialNoticias.filter((item) => {
    const matchBusca =
      !busca.trim() ||
      item.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      item.resumo?.toLowerCase().includes(busca.toLowerCase()) ||
      item.conteudo?.toLowerCase().includes(busca.toLowerCase());

    const matchCategoria = !categoriaAtiva || item.categoria?.slug === categoriaAtiva;

    return matchBusca && matchCategoria;
  });

  // Ordenação
  const noticiasOrdenadas = [...noticiasFiltradas].sort((a, b) => {
    if (ordenacao === 'antigo') {
      return new Date(a.publicado_em || a.criado_em) - new Date(b.publicado_em || b.criado_em);
    }
    if (ordenacao === 'titulo') {
      return a.titulo.localeCompare(b.titulo);
    }
    // recente
    return new Date(b.publicado_em || b.criado_em) - new Date(a.publicado_em || a.criado_em);
  });

  // Notícia em destaque: se o usuário não filtrou por busca ou categoria, exibe a notícia destacada no topo
  const temFiltroAtivo = Boolean(busca.trim() || categoriaAtiva);
  const noticiaDestaque =
    !temFiltroAtivo
      ? destaqueInicial || noticiasOrdenadas.find((n) => n.destaque) || noticiasOrdenadas[0]
      : null;

  // Demais notícias (exclui o destaque para não duplicar no grid principal)
  const noticiasDemais = noticiaDestaque
    ? noticiasOrdenadas.filter((n) => n.id !== noticiaDestaque.id)
    : noticiasOrdenadas;

  return (
    <>
      {/* Barra de Controles (Busca + Filtros + Ordenação) */}
      <div className="relative z-10 -mt-7 mb-10 flex flex-col gap-4 rounded-xl border border-accent/20 bg-card p-4 shadow-[0_4px_16px_rgb(44_24_16/0.06)] sm:p-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[280px] flex-[1_1_280px]">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary" />
            <Input
              type="text"
              placeholder="Pesquisar por título, palavra ou assunto..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="h-auto w-full border-[1.5px] border-input py-2.5 pl-10 pr-4 text-sm focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/10"
            />
          </div>

          <Select
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value)}
            className="h-auto py-2.5 text-sm"
          >
            <option value="recente">Mais recentes</option>
            <option value="antigo">Mais antigas</option>
            <option value="titulo">Ordem alfabética (A-Z)</option>
          </Select>
        </div>

        {/* Chips de Categorias */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            type="button"
            className={cn(
              'cursor-pointer whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-all',
              !categoriaAtiva
                ? 'border-primary bg-primary text-primary-foreground hover:bg-primary-dark'
                : 'border-input bg-card text-soft hover:border-accent hover:text-primary'
            )}
            onClick={() => setCategoriaAtiva('')}
          >
            Todas as Notícias
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={cn(
                'cursor-pointer whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-all',
                categoriaAtiva === cat.slug
                  ? 'border-primary bg-primary text-primary-foreground hover:bg-primary-dark'
                  : 'border-input bg-card text-soft hover:border-accent hover:text-primary'
              )}
              onClick={() => setCategoriaAtiva(cat.slug)}
            >
              {cat.nome}
            </button>
          ))}
        </div>
      </div>

      {/* NOTÍCIA EM DESTAQUE (Topo) */}
      {noticiaDestaque && (
        <Link
          href={`/noticias/${noticiaDestaque.slug}`}
          className="group mb-12 grid grid-cols-1 overflow-hidden rounded-2xl border border-accent/25 bg-card shadow-[0_6px_24px_rgb(44_24_16/0.08)] transition-all duration-250 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgb(44_24_16/0.12)] md:grid-cols-[1.2fr_1fr]"
        >
          <div className="relative min-h-[240px] overflow-hidden bg-neutral-900 md:min-h-[320px]">
            {noticiaDestaque.imagem_capa ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={noticiaDestaque.imagem_capa}
                alt={noticiaDestaque.titulo}
                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary to-primary-dark text-white">
                <Newspaper size={64} className="opacity-30" />
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-9">
            <div className="mb-3.5 flex items-center gap-3 text-[13px] text-muted-foreground">
              <span className="rounded-full bg-secondary px-2.5 py-1 text-[11.5px] font-bold uppercase tracking-wider text-primary">
                {noticiaDestaque.categoria?.nome || 'Diaconia'}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Calendar size={13} />
                {noticiaDestaque.publicado_em
                  ? new Date(noticiaDestaque.publicado_em).toLocaleDateString('pt-BR')
                  : 'Recente'}
              </span>
            </div>
            <h2 className="mb-3.5 font-heading text-[clamp(1.6rem,2.8vw,2.2rem)] font-bold leading-tight text-primary">
              {noticiaDestaque.titulo}
            </h2>
            <p className="mb-5 text-[15px] leading-relaxed text-soft">
              {noticiaDestaque.subtitulo || noticiaDestaque.resumo}
            </p>
            <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-bold text-accent transition-transform group-hover:translate-x-1">
              Ler matéria completa <ArrowRight size={16} />
            </span>
          </div>
        </Link>
      )}

      {/* SEÇÃO PRINCIPAL: GRID DE NOTÍCIAS */}
      <div>
        <div className="mb-6 flex items-center justify-between border-b-2 border-accent/25 pb-3">
          <h3 className="m-0 font-heading text-2xl font-bold text-primary">
            {temFiltroAtivo ? 'Resultados da Busca' : 'Últimas Publicações'}
          </h3>
          <span className="text-[13px] text-muted-foreground">
            {noticiasOrdenadas.length} {noticiasOrdenadas.length === 1 ? 'notícia' : 'notícias'}
          </span>
        </div>

        {noticiasOrdenadas.length === 0 ? (
          <div className="rounded-xl border border-dashed border-input bg-card px-5 py-16 text-center">
            <Frown className="mx-auto mb-4 size-14 text-accent" />
            <h4 className="mb-2 font-heading text-[22px] font-bold text-primary">Nenhuma notícia encontrada</h4>
            <p className="mb-5 text-sm text-muted-foreground">
              Não encontramos nenhuma publicação correspondente aos filtros de busca selecionados.
            </p>
            <Button
              type="button"
              onClick={() => {
                setBusca('');
                setCategoriaAtiva('');
              }}
              className="px-5 shadow-soft"
            >
              Ver todas as notícias
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {noticiasDemais.map((item) => (
              <Link
                key={item.id}
                href={`/noticias/${item.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-accent/20 bg-card shadow-[0_4px_14px_rgb(44_24_16/0.06)] transition-all duration-250 hover:-translate-y-1 hover:shadow-card"
              >
                <div className="relative h-[200px] overflow-hidden bg-muted">
                  {item.imagem_capa ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imagem_capa}
                      alt={item.titulo}
                      className="size-full object-cover transition-transform duration-400 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary to-neutral-900 text-white/30">
                      <Newspaper size={40} />
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-2.5 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                      {item.categoria?.nome || 'Diaconia'}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={12} />
                      {item.publicado_em
                        ? new Date(item.publicado_em).toLocaleDateString('pt-BR')
                        : 'Recente'}
                    </span>
                  </div>

                  <h4 className="mb-2.5 font-heading text-[19px] font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                    {item.titulo}
                  </h4>
                  <p className="mb-4 line-clamp-3 text-[13.5px] leading-relaxed text-soft">
                    {item.subtitulo || item.resumo}
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                    <span>{item.autor_nome || 'Pascom'}</span>
                    <span className="font-semibold text-accent transition-transform group-hover:translate-x-0.5">Ler mais →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
