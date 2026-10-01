/**
 * app/api/comprovantes/[id]/route.js
 * 
 * Camada de Apresentação (Route Handlers / API).
 * Atualiza o status de validação de um comprovante existente.
 */
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { atualizarStatusComprovante } from '@/services/comprovante.service';
import { AppError } from '@/lib/errors';

export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();
    const { status } = body;

    await atualizarStatusComprovante({ id, status });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Erro ao atualizar status:', err);
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    return NextResponse.json(
      { error: err.message || 'Erro interno' },
      { status: statusCode }
    );
  }
}
