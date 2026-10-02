import { listarNoticiasPublicas } from '@/services/noticia.service';
import { listarCategorias } from '@/services/categoria.service';
import PublicNav from '@/components/site/PublicNav';
import NoticiasClient from '@/components/noticias/NoticiasClient';
import styles from '@/components/noticias/noticias.module.css';

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
    <div className={styles.page}>
      <PublicNav />

      {/* Hero Header */}
      <section className={styles.hero}>
        <span className={styles.heroEyebrow}>Comunicação & Fé</span>
        <h1 className={styles.heroTitle}>Notícias & Informativos</h1>
        <p className={styles.heroDesc}>
          Fique por dentro das atividades pastorais, festejos das comunidades rurais e
          orientações espirituais do nosso território.
        </p>
      </section>

      {/* Conteúdo Principal */}
      <main className={styles.container}>
        <NoticiasClient
          inicialNoticias={noticias}
          paginacao={paginacao}
          categorias={categorias}
          destaqueInicial={destaque}
        />
      </main>

      {/* Footer */}
      <footer style={{ background: '#2c1810', color: '#fff', padding: '36px 24px', textAlign: 'center', marginTop: 'auto' }}>
        <p style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>
          © {new Date().getFullYear()} Diaconia Territorial São Raimundo Nonato — Curralinhos, PI
        </p>
      </footer>
    </div>
  );
}
