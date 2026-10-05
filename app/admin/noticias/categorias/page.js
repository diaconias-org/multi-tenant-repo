import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { withTenant } from '@/lib/prisma';
import { listarCategorias } from '@/services/categoria.service';
import CategoriasAdminClient from '@/components/admin/noticias/CategoriasAdminClient';

export const metadata = {
  title: 'Gerenciar Categorias – Diaconia',
};

export default async function AdminCategoriasPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const tenantId = session.user.tenant_id;
  const categorias = await withTenant(tenantId, async () => {
    return listarCategorias({ tenantId });
  });

  return (
    <CategoriasAdminClient
      inicialCategorias={categorias}
      usuarioNome={session.user.name}
      usuarioEmail={session.user.email}
    />
  );
}
