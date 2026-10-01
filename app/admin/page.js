import { auth }                             from '@/auth';
import { redirect }                         from 'next/navigation';
import { listarComprovantes }               from '@/services/comprovante.service';
import AdminClient                          from '@/components/admin/AdminClient';

export const metadata = {
  title: 'Painel Admin – Diaconia',
};

export default async function AdminPage() {
  // Verifica sessão no servidor (dupla proteção além do proxy.js)
  const session = await auth();
  if (!session?.user) redirect('/login');

  const comprovantes = await listarComprovantes({ tenantId: session.user.tenant_id });

  return (
    <AdminClient
      comprovantes={comprovantes}
      usuarioNome={session.user.name}
      usuarioEmail={session.user.email}
    />
  );
}
