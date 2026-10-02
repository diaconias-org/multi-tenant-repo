/**
 * app/api/noticias/[id]/route.js
 * Endpoints para obtenção, atualização e exclusão de notícia específica por ID ou Slug.
 */
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { tratarErroApi } from '@/lib/errors';
import { validarDTO, AtualizarNoticiaDTO } from '@/dtos';
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
    return tratarErroApi(error, 'Erro ao carregar notícia.');
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
    let dadosBrutos = {};
    let imagemCapa = undefined;
    let removerImagemCapa = false;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      dadosBrutos = {
        titulo: formData.get('titulo') || undefined,
        slug: formData.get('slug') || undefined,
        subtitulo: formData.get('subtitulo'),
        resumo: formData.get('resumo'),
        conteudo: formData.get('conteudo') || undefined,
        categoriaId: formData.get('categoriaId'),
        autorNome: formData.get('autorNome'),
        status: formData.get('status') || undefined,
        destaque: formData.get('destaque') !== null ? formData.get('destaque') : undefined,
        publicadoEm: formData.get('publicadoEm') || undefined,
        removerImagemCapa: formData.get('removerImagemCapa'),
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
      dadosBrutos = body;
      imagemCapa = body.imagemCapa;
      removerImagemCapa = Boolean(body.removerImagemCapa);
    }

    // Validação DTO dos dados recebidos
    const dadosValidados = validarDTO(AtualizarNoticiaDTO, dadosBrutos);

    const noticiaAtualizada = await atualizarNoticia(id, {
      ...dadosValidados,
      imagemCapa,
      removerImagemCapa: dadosValidados.removerImagemCapa ?? removerImagemCapa,
    });

    return NextResponse.json(noticiaAtualizada);
  } catch (error) {
    console.error('Erro na rota PUT /api/noticias/[id]:', error);
    return tratarErroApi(error, 'Erro ao atualizar notícia.');
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
    return tratarErroApi(error, 'Erro ao excluir notícia.');
  }
}

