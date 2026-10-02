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
import styles from './noticias.module.css';

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
      <div className={styles.controlsBar}>
        <div className={styles.searchRow}>
          <div className={styles.searchWrap}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Pesquisar por título, palavra ou assunto..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <select
            className={styles.sortSelect}
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value)}
          >
            <option value="recente">Mais recentes</option>
            <option value="antigo">Mais antigas</option>
            <option value="titulo">Ordem alfabética (A-Z)</option>
          </select>
        </div>

        {/* Chips de Categorias */}
        <div className={styles.categoryChips}>
          <button
            type="button"
            className={`${styles.chip} ${!categoriaAtiva ? styles.chipActive : ''}`}
            onClick={() => setCategoriaAtiva('')}
          >
            Todas as Notícias
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`${styles.chip} ${categoriaAtiva === cat.slug ? styles.chipActive : ''}`}
              onClick={() => setCategoriaAtiva(cat.slug)}
            >
              {cat.nome}
            </button>
          ))}
        </div>
      </div>

      {/* NOTÍCIA EM DESTAQUE (Topo) */}
      {noticiaDestaque && (
        <Link href={`/noticias/${noticiaDestaque.slug}`} className={styles.featuredCard}>
          <div className={styles.featuredImageWrap}>
            {noticiaDestaque.imagem_capa ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={noticiaDestaque.imagem_capa}
                alt={noticiaDestaque.titulo}
                className={styles.featuredImage}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #8b1a1a, #5c0e0e)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                <Newspaper size={64} opacity={0.3} />
              </div>
            )}
          </div>
          <div className={styles.featuredContent}>
            <div className={styles.featuredMeta}>
              <span className={styles.categoryTag}>
                {noticiaDestaque.categoria?.nome || 'Diaconia'}
              </span>
              <span>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Calendar size={13} />
                {noticiaDestaque.publicado_em
                  ? new Date(noticiaDestaque.publicado_em).toLocaleDateString('pt-BR')
                  : 'Recente'}
              </span>
            </div>
            <h2 className={styles.featuredTitle}>{noticiaDestaque.titulo}</h2>
            <p className={styles.featuredExcerpt}>
              {noticiaDestaque.subtitulo || noticiaDestaque.resumo}
            </p>
            <span className={styles.readMoreLink}>
              Ler matéria completa <ArrowRight size={16} />
            </span>
          </div>
        </Link>
      )}

      {/* SEÇÃO PRINCIPAL: GRID DE NOTÍCIAS */}
      <div>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>
            {temFiltroAtivo ? 'Resultados da Busca' : 'Últimas Publicações'}
          </h3>
          <span style={{ fontSize: 13, color: '#6b7280' }}>
            {noticiasOrdenadas.length} {noticiasOrdenadas.length === 1 ? 'notícia' : 'notícias'}
          </span>
        </div>

        {noticiasOrdenadas.length === 0 ? (
          <div className={styles.emptyState}>
            <Frown className={styles.emptyIcon} />
            <h4 className={styles.emptyTitle}>Nenhuma notícia encontrada</h4>
            <p className={styles.emptyDesc}>
              Não encontramos nenhuma publicação correspondente aos filtros de busca selecionados.
            </p>
            <button
              type="button"
              className={styles.chip}
              style={{ background: 'var(--bordo)', color: '#fff', border: 'none', padding: '10px 20px' }}
              onClick={() => {
                setBusca('');
                setCategoriaAtiva('');
              }}
            >
              Ver todas as notícias
            </button>
          </div>
        ) : (
          <div className={styles.newsGrid}>
            {noticiasDemais.map((item) => (
              <Link key={item.id} href={`/noticias/${item.slug}`} className={styles.newsCard}>
                <div className={styles.cardImageWrap}>
                  {item.imagem_capa ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imagem_capa} alt={item.titulo} className={styles.cardImage} />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #8b1a1a, #2c1810)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'rgba(255,255,255,0.3)',
                      }}
                    >
                      <Newspaper size={40} />
                    </div>
                  )}
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardMeta}>
                    <span className={styles.categoryTag} style={{ fontSize: 11, padding: '2px 8px' }}>
                      {item.categoria?.nome || 'Diaconia'}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={12} />
                      {item.publicado_em
                        ? new Date(item.publicado_em).toLocaleDateString('pt-BR')
                        : 'Recente'}
                    </span>
                  </div>

                  <h4 className={styles.cardTitle}>{item.titulo}</h4>
                  <p className={styles.cardExcerpt}>{item.subtitulo || item.resumo}</p>

                  <div className={styles.cardFooter}>
                    <span>{item.autor_nome || 'Pascom'}</span>
                    <span style={{ color: '#b89a5a', fontWeight: 600 }}>Ler mais →</span>
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
