import { listarNoticiasPublicas } from '@/services/noticia.service';
import { listarCategorias } from '@/services/categoria.service';
import PublicNav from '@/components/site/PublicNav';
import NoticiasClient from '@/components/noticias/NoticiasClient';

export const metadata = {
  title: 'Notícias & Acontecimentos – Diaconia Territorial São Raimundo Nonato',
  description:
    'Acompanhe os comunicados, festejos, cartas pastorais e memórias da Diaconia Territorial São Raimundo Nonato em Curralinhos e região.',
  openGraph: {
    title: 'Notícias & Acontecimentos – Diaconia Territorial São Raimundo Nonato',
    description:
      'Acompanhe os comunicados, festejos, cartas pastorais e memórias da Diaconia Territorial São Raimundo Nonato em Curralinhos e região.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Notícias – Diaconia Territorial São Raimundo Nonato',
    description: 'Acompanhe as notícias e avisos da paróquia.',
  },
};

export default async function NoticiasPage({ searchParams }) {
  const params = await searchParams;

  const [{ noticias, paginacao }, categorias] = await Promise.all([
    listarNoticiasPublicas({
      categoriaSlug: params?.categoria || null,
      busca: params?.busca || null,
      pagina: params?.pagina || 1,
      limite: 15,
    }),
    listarCategorias({ apenasAtivos: true }),
  ]);

  // Procura destaque
  const destaque = noticias.find((n) => n.destaque) || null;

  return (
    <div className="flex min-h-screen flex-col bg-secondary text-foreground">
      <PublicNav />

      {/* Hero Header */}
      <section className="relative bg-gradient-to-br from-primary to-primary-dark px-6 pb-16 pt-14 text-center text-white">
        <span className="mb-2 inline-block text-[13px] font-bold uppercase tracking-wider text-accent-light">
          Comunicação & Fé
        </span>
        <h1 className="mb-3 font-heading text-[clamp(2rem,5vw,3.2rem)] font-bold leading-tight">
          Notícias & Informativos
        </h1>
        <p className="mx-auto max-w-[640px] text-base leading-relaxed opacity-90">
          Fique por dentro das atividades pastorais, festejos das comunidades rurais e
          orientações espirituais do nosso território.
        </p>
      </section>

      {/* Conteúdo Principal */}
      <main className="mx-auto w-full max-w-[1180px] px-6 pb-20">
        <NoticiasClient
          inicialNoticias={noticias}
          paginacao={paginacao}
          categorias={categorias}
          destaqueInicial={destaque}
        />
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-footer px-6 py-9 text-center text-white/70">
        <p className="m-0 text-[13px] opacity-80">
          © {new Date().getFullYear()} Diaconia Territorial São Raimundo Nonato — Curralinhos, PI
        </p>
      </footer>
    </div>
  );
}
