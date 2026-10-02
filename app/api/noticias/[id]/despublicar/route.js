/**
 * app/api/noticias/[id]/despublicar/route.js
 * Ação rápida para despublicar notícia (reverter para rascunho).
 */
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { AppError } from '@/lib/errors';
import { despublicarNoticia } from '@/services/noticia.service';

export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ erro: 'Não autorizado.' }, { status: 401 });
    }

    const { id } = await params;
    const noticia = await despublicarNoticia(id);
    return NextResponse.json(noticia);
  } catch (error) {
    const status = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json({ erro: error.message || 'Erro ao despublicar notícia.' }, { status });
  }
}
