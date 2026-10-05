/**
 * app/api/comprovantes/[id]/route.js
 * 
 * Camada de Apresentação (Route Handlers / API).
 * Atualiza o status de validação de um comprovante existente,
 * amarrado de forma estrita ao tenant_id da sessão do usuário autenticado.
 */
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { atualizarStatusComprovante } from '@/services/comprovante.service';
import { withTenant } from '@/lib/prisma';
import { tratarErroApi } from '@/lib/errors';
import { validarDTO, AtualizarStatusComprovanteDTO } from '@/dtos';

export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.tenant_id) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();

    const dadosValidados = validarDTO(AtualizarStatusComprovanteDTO, body);
    const tenantId = session.user.tenant_id;

    await withTenant(tenantId, async () => {
      await atualizarStatusComprovante({ id, status: dadosValidados.status, tenantId });
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Erro ao atualizar status do comprovante:', err);
    return tratarErroApi(err, 'Erro interno ao atualizar status.');
  }
}
