import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { withTenant } from '@/lib/prisma';
import { listarCategorias } from '@/services/categoria.service';
import AdminHeader from '@/components/admin/AdminHeader';
import NoticiaForm from '@/components/admin/noticias/NoticiaForm';
import { AdminPage } from '@/components/admin/AdminLayout';

export const metadata = {
  title: 'Nova Notícia – Painel Administrativo',
};

export default async function NovaNoticiaPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const tenantId = session.user.tenant_id;
  const categorias = await withTenant(tenantId, async () => {
    return listarCategorias({ tenantId });
  });

  return (
    <AdminPage>
      <AdminHeader usuarioNome={session.user.name} usuarioEmail={session.user.email} />
      <NoticiaForm
        categorias={categorias}
        autorPadrao={session.user.name || 'Pascom'}
      />
    </AdminPage>
  );
}
