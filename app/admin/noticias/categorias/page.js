import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { listarCategorias } from '@/services/categoria.service';
import CategoriasAdminClient from '@/components/admin/noticias/CategoriasAdminClient';

export const metadata = {
  title: 'Gerenciar Categorias – Diaconia',
};

export default async function AdminCategoriasPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const categorias = await listarCategorias();

  return (
    <CategoriasAdminClient
      inicialCategorias={categorias}
      usuarioNome={session.user.name}
      usuarioEmail={session.user.email}
    />
  );
}
