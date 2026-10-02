/**
 * app/api/noticias/[id]/duplicar/route.js
 * Ação para duplicar notícia como rascunho.
 */
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { AppError } from '@/lib/errors';
import { duplicarNoticia } from '@/services/noticia.service';

export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ erro: 'Não autorizado.' }, { status: 401 });
    }

    const { id } = await params;
    const noticiaClonada = await duplicarNoticia(id);
    return NextResponse.json(noticiaClonada, { status: 201 });
  } catch (error) {
    const status = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json({ erro: error.message || 'Erro ao duplicar notícia.' }, { status });
  }
}
