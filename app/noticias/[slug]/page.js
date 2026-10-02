import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, User, Clock, ChevronRight, ChevronLeft, ArrowLeft, Tag } from 'lucide-react';
import { obterNoticiaPorSlug } from '@/services/noticia.service';
import PublicNav from '@/components/site/PublicNav';
import ShareButtons from '@/components/noticias/ShareButtons';
import styles from '@/components/noticias/noticias.module.css';

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const noticia = await obterNoticiaPorSlug(slug, { apenasPublicada: true });
    const descricao = noticia.subtitulo || noticia.resumo || 'Notícia e informativo da Diaconia Territorial.';

    return {
      title: `${noticia.titulo} – Diaconia`,
      description: descricao,
      openGraph: {
        title: noticia.titulo,
        description: descricao,
        type: 'article',
        publishedTime: noticia.publicado_em ? new Date(noticia.publicado_em).toISOString() : undefined,
        authors: [noticia.autor_nome || 'Diaconia Territorial'],
        images: noticia.imagem_capa ? [{ url: noticia.imagem_capa }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: noticia.titulo,
        description: descricao,
        images: noticia.imagem_capa ? [noticia.imagem_capa] : undefined,
      },
    };
  } catch {
    return {
      title: 'Notícia não encontrada – Diaconia',
    };
  }
}

export default async function NoticiaIndividualPage({ params }) {
  const { slug } = await params;

  let noticia = null;
  try {
    noticia = await obterNoticiaPorSlug(slug, { apenasPublicada: true });
  } catch {
    notFound();
  }

  // Schema.org JSON-LD para NewsArticle
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: noticia.titulo,
    description: noticia.subtitulo || noticia.resumo,
    image: noticia.imagem_capa ? [noticia.imagem_capa] : undefined,
    datePublished: noticia.publicado_em ? new Date(noticia.publicado_em).toISOString() : undefined,
    dateModified: noticia.atualizado_em ? new Date(noticia.atualizado_em).toISOString() : undefined,
    author: [
      {
        '@type': 'Person',
        name: noticia.autor_nome || 'Diaconia Territorial São Raimundo Nonato',
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'Diaconia Territorial São Raimundo Nonato',
      logo: {
        '@type': 'ImageObject',
        url: '/logo-diaconia.png',
      },
    },
  };

  const dataFormatada = noticia.publicado_em
    ? new Date(noticia.publicado_em).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '';

  const horaFormatada = noticia.publicado_em
    ? new Date(noticia.publicado_em).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <div className={styles.page}>
      {/* Schema.org estruturado */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PublicNav />

      <article className={styles.container} style={{ paddingTop: 36 }}>
        {/* Cabeçalho do Artigo */}
        <header className={styles.articleHeader}>
          {/* Breadcrumbs */}
          <nav className={styles.breadcrumbs}>
            <Link href="/">Início</Link>
            <ChevronRight size={12} />
            <Link href="/noticias">Notícias</Link>
            {noticia.categoria && (
              <>
                <ChevronRight size={12} />
                <Link href={`/noticias?categoria=${noticia.categoria.slug}`}>
                  {noticia.categoria.nome}
                </Link>
              </>
            )}
          </nav>

          <h1 className={styles.articleTitle}>{noticia.titulo}</h1>

          {noticia.subtitulo && (
            <p className={styles.articleSubtitle}>{noticia.subtitulo}</p>
          )}

          <div className={styles.articleMetaRow}>
            {noticia.categoria && (
              <span className={styles.categoryTag} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Tag size={12} /> {noticia.categoria.nome}
              </span>
            )}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <Calendar size={14} color="#b89a5a" />
              {dataFormatada} {horaFormatada && `às ${horaFormatada}`}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <User size={14} color="#b89a5a" />
              {noticia.autor_nome || 'Pascom Diaconia'}
            </span>
          </div>
        </header>

        {/* Imagem de Capa Grande */}
        {noticia.imagem_capa && (
          <div className={styles.articleCoverWrap}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={noticia.imagem_capa}
              alt={noticia.titulo}
              className={styles.articleCover}
            />
          </div>
        )}

        {/* Conteúdo Rico do Artigo */}
        <div
          className={styles.articleContent}
          dangerouslySetInnerHTML={{ __html: noticia.conteudo }}
        />

        {/* Barra de Compartilhamento */}
        <ShareButtons
          titulo={noticia.titulo}
          url={`/noticias/${noticia.slug}`}
        />

        {/* Navegação Entre Artigos Vizinhos (Anterior / Próximo) */}
        <nav className={styles.neighborsNav}>
          {noticia.anterior ? (
            <Link href={`/noticias/${noticia.anterior.slug}`} className={styles.neighborCard}>
              <span className={styles.neighborLabel}>
                <ChevronLeft size={14} /> Notícia Anterior
              </span>
              <span className={styles.neighborTitle}>{noticia.anterior.titulo}</span>
            </Link>
          ) : (
            <div />
          )}

          {noticia.proxima ? (
            <Link
              href={`/noticias/${noticia.proxima.slug}`}
              className={styles.neighborCard}
              style={{ textAlign: 'right', alignItems: 'flex-end' }}
            >
              <span className={styles.neighborLabel}>
                Próxima Notícia <ChevronRight size={14} />
              </span>
              <span className={styles.neighborTitle}>{noticia.proxima.titulo}</span>
            </Link>
          ) : (
            <div />
          )}
        </nav>

        {/* Notícias Relacionadas */}
        {noticia.relacionadas && noticia.relacionadas.length > 0 && (
          <section style={{ marginTop: 40, paddingTop: 40, borderTop: '2px solid rgba(184,154,90,0.25)' }}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Notícias Relacionadas</h3>
              <Link href="/noticias" style={{ fontSize: 13, color: '#b89a5a', fontWeight: 600, textDecoration: 'none' }}>
                Ver todas →
              </Link>
            </div>

            <div className={styles.newsGrid}>
              {noticia.relacionadas.map((rel) => (
                <Link key={rel.id} href={`/noticias/${rel.slug}`} className={styles.newsCard}>
                  {rel.imagem_capa && (
                    <div className={styles.cardImageWrap}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={rel.imagem_capa} alt={rel.titulo} className={styles.cardImage} />
                    </div>
                  )}
                  <div className={styles.cardBody}>
                    <div className={styles.cardMeta}>
                      <span className={styles.categoryTag} style={{ fontSize: 11, padding: '2px 8px' }}>
                        {rel.categoria?.nome || 'Diaconia'}
                      </span>
                      <span>
                        {rel.publicado_em ? new Date(rel.publicado_em).toLocaleDateString('pt-BR') : ''}
                      </span>
                    </div>
                    <h4 className={styles.cardTitle}>{rel.titulo}</h4>
                    <p className={styles.cardExcerpt}>{rel.subtitulo || rel.resumo}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

      {/* Footer */}
      <footer style={{ background: '#2c1810', color: '#fff', padding: '36px 24px', textAlign: 'center', marginTop: 'auto' }}>
        <p style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>
          © {new Date().getFullYear()} Diaconia Territorial São Raimundo Nonato — Curralinhos, PI
        </p>
      </footer>
    </div>
  );
}
