/**
 * app/api/noticias/[id]/route.js
 * Endpoints para obtenção, atualização e exclusão de notícia específica por ID ou Slug.
 */
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { AppError } from '@/lib/errors';
import {
  obterNoticiaPorId,
  obterNoticiaPorSlug,
  atualizarNoticia,
  deletarNoticia,
} from '@/services/noticia.service';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const apenasPublicada = searchParams.get('publica') === 'true';

    // Se for numérico, busca por ID
    if (/^\d+$/.test(id)) {
      const noticia = await obterNoticiaPorId(id);
      return NextResponse.json(noticia);
    }

    // Caso contrário, busca por slug
    const noticia = await obterNoticiaPorSlug(id, { apenasPublicada });
    return NextResponse.json(noticia);
  } catch (error) {
    const status = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json({ erro: error.message || 'Erro ao carregar notícia.' }, { status });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ erro: 'Não autorizado.' }, { status: 401 });
    }

    const { id } = await params;
    const contentType = request.headers.get('content-type') || '';
    let dados = {};
    let imagemCapa = undefined;
    let removerImagemCapa = false;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      dados = {
        titulo: formData.get('titulo'),
        slug: formData.get('slug'),
        subtitulo: formData.get('subtitulo'),
        resumo: formData.get('resumo'),
        conteudo: formData.get('conteudo'),
        categoriaId: formData.get('categoriaId'),
        autorNome: formData.get('autorNome'),
        status: formData.get('status'),
        destaque: formData.get('destaque') === 'true',
        publicadoEm: formData.get('publicadoEm'),
      };

      if (formData.get('removerImagemCapa') === 'true') {
        removerImagemCapa = true;
      } else {
        const foto = formData.get('imagemCapa');
        if (foto && typeof foto === 'object' && foto.size > 0) {
          imagemCapa = foto;
        }
      }
    } else {
      const body = await request.json();
      dados = body;
      imagemCapa = body.imagemCapa;
      removerImagemCapa = Boolean(body.removerImagemCapa);
    }

    const noticiaAtualizada = await atualizarNoticia(id, {
      ...dados,
      imagemCapa,
      removerImagemCapa,
    });

    return NextResponse.json(noticiaAtualizada);
  } catch (error) {
    console.error('Erro na rota PUT /api/noticias/[id]:', error);
    const status = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json({ erro: error.message || 'Erro ao atualizar notícia.' }, { status });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ erro: 'Não autorizado.' }, { status: 401 });
    }

    const { id } = await params;
    await deletarNoticia(id);
    return NextResponse.json({ sucesso: true, mensagem: 'Notícia excluída com sucesso.' });
  } catch (error) {
    console.error('Erro na rota DELETE /api/noticias/[id]:', error);
    const status = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json({ erro: error.message || 'Erro ao excluir notícia.' }, { status });
  }
}
