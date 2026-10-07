import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, User, Clock, ChevronRight, ChevronLeft, ArrowLeft, Tag } from 'lucide-react';
import { obterNoticiaPorSlug } from '@/services/noticia.service';
import PublicNav from '@/components/site/PublicNav';
import ShareButtons from '@/components/noticias/ShareButtons';

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
    <div className="flex min-h-screen flex-col bg-secondary text-foreground">
      {/* Schema.org estruturado */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PublicNav />

      <article className="mx-auto w-full max-w-[1180px] px-6 pb-20 pt-9">
        {/* Cabeçalho do Artigo */}
        <header className="mx-auto mb-9 max-w-[820px] text-center">
          {/* Breadcrumbs */}
          <nav className="mb-5 flex items-center justify-center gap-2 text-[12.5px] text-muted-foreground">
            <Link href="/" className="hover:text-primary">Início</Link>
            <ChevronRight size={12} />
            <Link href="/noticias" className="hover:text-primary">Notícias</Link>
            {noticia.categoria && (
              <>
                <ChevronRight size={12} />
                <Link href={`/noticias?categoria=${noticia.categoria.slug}`} className="hover:text-primary">
                  {noticia.categoria.nome}
                </Link>
              </>
            )}
          </nav>

          <h1 className="mb-4 font-heading text-[clamp(2.1rem,4.5vw,3.4rem)] font-bold leading-tight text-primary">
            {noticia.titulo}
          </h1>

          {noticia.subtitulo && (
            <p className="mb-6 text-lg italic leading-relaxed text-soft">
              {noticia.subtitulo}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-4 border-b border-accent/25 pb-6 text-[13.5px] text-muted-foreground">
            {noticia.categoria && (
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11.5px] font-bold uppercase tracking-wider text-primary">
                <Tag size={12} /> {noticia.categoria.nome}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Calendar size={14} className="text-accent" />
              {dataFormatada} {horaFormatada && `às ${horaFormatada}`}
            </span>
            <span className="inline-flex items-center gap-1">
              <User size={14} className="text-accent" />
              {noticia.autor_nome || 'Pascom Diaconia'}
            </span>
          </div>
        </header>

        {/* Imagem de Capa Grande */}
        {noticia.imagem_capa && (
          <div className="mx-auto mb-10 max-w-[960px] overflow-hidden rounded-2xl bg-neutral-900 shadow-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={noticia.imagem_capa}
              alt={noticia.titulo}
              className="block max-h-[520px] w-full object-cover"
            />
          </div>
        )}

        {/* Conteúdo Rico do Artigo */}
        <div
          className="mx-auto mb-14 max-w-[760px] text-[17.5px] leading-relaxed text-foreground [&_blockquote]:my-8 [&_blockquote]:rounded-r-lg [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:bg-primary/[0.04] [&_blockquote]:px-6 [&_blockquote]:py-4 [&_blockquote]:italic [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:font-heading [&_h2]:text-[28px] [&_h2]:font-bold [&_h2]:text-primary [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:font-heading [&_h3]:text-[22px] [&_h3]:font-bold [&_h3]:text-foreground [&_img]:my-8 [&_img]:rounded-xl [&_li]:mb-2 [&_ol]:mb-6 [&_ol]:pl-7 [&_p]:mb-6 [&_ul]:mb-6 [&_ul]:pl-7"
          dangerouslySetInnerHTML={{ __html: noticia.conteudo }}
        />

        {/* Barra de Compartilhamento */}
        <ShareButtons
          titulo={noticia.titulo}
          url={`/noticias/${noticia.slug}`}
        />

        {/* Navegação Entre Artigos Vizinhos (Anterior / Próximo) */}
        <nav className="mx-auto mb-14 grid max-w-[760px] grid-cols-1 gap-5 sm:grid-cols-2">
          {noticia.anterior ? (
            <Link
              href={`/noticias/${noticia.anterior.slug}`}
              className="group flex flex-col gap-1 rounded-xl border border-accent/20 bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary"
            >
              <span className="flex items-center gap-1 text-[11.5px] font-bold uppercase text-accent">
                <ChevronLeft size={14} /> Notícia Anterior
              </span>
              <span className="text-sm font-semibold text-foreground group-hover:text-primary">
                {noticia.anterior.titulo}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {noticia.proxima ? (
            <Link
              href={`/noticias/${noticia.proxima.slug}`}
              className="group flex flex-col items-end gap-1 rounded-xl border border-accent/20 bg-card p-4 text-right transition-all hover:-translate-y-0.5 hover:border-primary"
            >
              <span className="flex items-center gap-1 text-[11.5px] font-bold uppercase text-accent">
                Próxima Notícia <ChevronRight size={14} />
              </span>
              <span className="text-sm font-semibold text-foreground group-hover:text-primary">
                {noticia.proxima.titulo}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </nav>

        {/* Notícias Relacionadas */}
        {noticia.relacionadas && noticia.relacionadas.length > 0 && (
          <section className="mt-10 border-t-2 border-accent/25 pt-10">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="m-0 font-heading text-2xl font-bold text-primary">Notícias Relacionadas</h3>
              <Link href="/noticias" className="text-[13px] font-semibold text-accent hover:underline">
                Ver todas →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {noticia.relacionadas.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/noticias/${rel.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-accent/20 bg-card shadow-[0_4px_14px_rgb(44_24_16/0.06)] transition-all duration-250 hover:-translate-y-1 hover:shadow-card"
                >
                  {rel.imagem_capa && (
                    <div className="relative h-[180px] overflow-hidden bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={rel.imagem_capa}
                        alt={rel.titulo}
                        className="size-full object-cover transition-transform duration-400 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-bold uppercase text-primary">
                        {rel.categoria?.nome || 'Diaconia'}
                      </span>
                      <span>
                        {rel.publicado_em ? new Date(rel.publicado_em).toLocaleDateString('pt-BR') : ''}
                      </span>
                    </div>
                    <h4 className="mb-2 font-heading text-base font-bold text-foreground transition-colors group-hover:text-primary">
                      {rel.titulo}
                    </h4>
                    <p className="line-clamp-2 text-[13px] text-soft">
                      {rel.subtitulo || rel.resumo}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

      {/* Footer */}
      <footer className="mt-auto bg-footer px-6 py-9 text-center text-white/70">
        <p className="m-0 text-[13px] opacity-80">
          © {new Date().getFullYear()} Diaconia Territorial São Raimundo Nonato — Curralinhos, PI
        </p>
      </footer>
    </div>
  );
}
