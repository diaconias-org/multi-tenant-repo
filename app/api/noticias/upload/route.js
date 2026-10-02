/**
 * app/api/noticias/upload/route.js
 * Upload seguro de imagens para uso no editor rico ou capa de notícias.
 */
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { AppError } from '@/lib/errors';
import { salvarArquivo } from '@/lib/storage';

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ erro: 'Não autorizado.' }, { status: 401 });
    }

    const formData = await request.formData();
    const arquivo = formData.get('file') || formData.get('imagem');

    if (!arquivo || typeof arquivo !== 'object' || arquivo.size === 0) {
      throw new AppError('Nenhum arquivo enviado para upload.', 400);
    }

    const url = await salvarArquivo(arquivo, 'noticias');
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Erro no upload de imagem:', error);
    const status = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json({ erro: error.message || 'Erro ao fazer upload da imagem.' }, { status });
  }
}
