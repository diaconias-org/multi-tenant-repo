/**
 * app/api/noticias/[id]/publicar/route.js
 * Ação rápida para publicar notícia, vinculada estritamente ao tenant da sessão.
 */
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { withTenant } from '@/lib/prisma';
import { tratarErroApi } from '@/lib/errors';
import { publicarNoticia } from '@/services/noticia.service';

export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.tenant_id) {
      return NextResponse.json({ erro: 'Não autorizado.' }, { status: 401 });
    }

    const { id } = await params;
    const tenantId = session.user.tenant_id;

    const noticia = await withTenant(tenantId, async () => {
      return publicarNoticia(id, { tenantId });
    });

    return NextResponse.json(noticia);
  } catch (error) {
    return tratarErroApi(error, 'Erro ao publicar notícia.');
  }
}
