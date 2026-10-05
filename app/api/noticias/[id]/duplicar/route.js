/**
 * app/api/noticias/[id]/duplicar/route.js
 * Ação para duplicar notícia como rascunho, vinculada ao tenant da sessão.
 */
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { withTenant } from '@/lib/prisma';
import { tratarErroApi } from '@/lib/errors';
import { duplicarNoticia } from '@/services/noticia.service';

export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.tenant_id) {
      return NextResponse.json({ erro: 'Não autorizado.' }, { status: 401 });
    }

    const { id } = await params;
    const tenantId = session.user.tenant_id;

    const noticiaClonada = await withTenant(tenantId, async () => {
      return duplicarNoticia(id, { tenantId });
    });

    return NextResponse.json(noticiaClonada, { status: 201 });
  } catch (error) {
    return tratarErroApi(error, 'Erro ao duplicar notícia.');
  }
}
