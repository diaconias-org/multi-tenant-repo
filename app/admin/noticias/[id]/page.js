import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { obterNoticiaPorId } from '@/services/noticia.service';
import { listarCategorias } from '@/services/categoria.service';
import AdminHeader from '@/components/admin/AdminHeader';
import NoticiaForm from '@/components/admin/noticias/NoticiaForm';
import styles from '@/components/admin/admin.module.css';

export const metadata = {
  title: 'Editar Notícia – Painel Administrativo',
};

export default async function EditarNoticiaPage({ params }) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const { id } = await params;

  let noticia = null;
  try {
    noticia = await obterNoticiaPorId(id);
  } catch {
    notFound();
  }

  const categorias = await listarCategorias();

  return (
    <div className={styles.page}>
      <AdminHeader usuarioNome={session.user.name} usuarioEmail={session.user.email} />
      <NoticiaForm
        noticia={noticia}
        categorias={categorias}
        autorPadrao={session.user.name}
      />
    </div>
  );
}
