import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { withTenant } from '@/lib/prisma';
import { listarTodasNoticiasAdmin } from '@/services/noticia.service';
import { listarCategorias } from '@/services/categoria.service';
import NoticiasAdminClient from '@/components/admin/noticias/NoticiasAdminClient';

export const metadata = {
  title: 'Gerenciar Notícias – Diaconia',
};

export default async function AdminNoticiasPage({ searchParams }) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const tenantId = session.user.tenant_id;
  const params = await searchParams;

  const [{ noticias, paginacao }, categorias] = await withTenant(tenantId, async () => {
    return Promise.all([
      listarTodasNoticiasAdmin({
        status: params?.status || null,
        categoriaId: params?.categoriaId || null,
        busca: params?.busca || null,
        pagina: params?.pagina || 1,
        limite: 20,
        tenantId,
      }),
      listarCategorias({ tenantId }),
    ]);
  });

  return (
    <NoticiasAdminClient
      inicialNoticias={noticias}
      paginacao={paginacao}
      categorias={categorias}
      usuarioNome={session.user.name}
      usuarioEmail={session.user.email}
    />
  );
}
