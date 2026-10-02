import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { listarCategorias } from '@/services/categoria.service';
import AdminHeader from '@/components/admin/AdminHeader';
import NoticiaForm from '@/components/admin/noticias/NoticiaForm';
import styles from '@/components/admin/admin.module.css';

export const metadata = {
  title: 'Nova Notícia – Painel Administrativo',
};

export default async function NovaNoticiaPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const categorias = await listarCategorias();

  return (
    <div className={styles.page}>
      <AdminHeader usuarioNome={session.user.name} usuarioEmail={session.user.email} />
      <NoticiaForm
        categorias={categorias}
        autorPadrao={session.user.name || 'Pascom'}
      />
    </div>
  );
}
