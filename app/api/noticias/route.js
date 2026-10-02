/**
 * app/api/noticias/route.js
 * Endpoints públicos e administrativos para listagem e criação de notícias.
 */
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { AppError } from '@/lib/errors';
import {
  listarNoticiasPublicas,
  listarTodasNoticiasAdmin,
  criarNoticia,
} from '@/services/noticia.service';

// GET /api/noticias
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminMode = searchParams.get('admin') === 'true';

    // Se solicitar modo admin, exige sessão ativa
    if (adminMode) {
      const session = await auth();
      if (!session?.user) {
        return NextResponse.json({ erro: 'Não autorizado.' }, { status: 401 });
      }

      const resultado = await listarTodasNoticiasAdmin({
        status: searchParams.get('status'),
        categoriaId: searchParams.get('categoriaId'),
        busca: searchParams.get('busca'),
        destaque: searchParams.get('destaque') ? searchParams.get('destaque') === 'true' : null,
        ordenarPor: searchParams.get('ordenarPor') || 'criado_em',
        pagina: searchParams.get('pagina') || 1,
        limite: searchParams.get('limite') || 15,
      });

      return NextResponse.json(resultado);
    }

    // Consulta pública: somente publicadas
    const resultado = await listarNoticiasPublicas({
      categoriaSlug: searchParams.get('categoria'),
      busca: searchParams.get('busca'),
      destaque: searchParams.get('destaque') ? searchParams.get('destaque') === 'true' : null,
      ordenarPor: searchParams.get('ordenarPor') || 'recente',
      pagina: searchParams.get('pagina') || 1,
      limite: searchParams.get('limite') || 10,
    });

    return NextResponse.json(resultado);
  } catch (error) {
    console.error('Erro na rota GET /api/noticias:', error);
    const status = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json({ erro: error.message || 'Erro ao buscar notícias.' }, { status });
  }
}

// POST /api/noticias
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ erro: 'Acesso restrito a administradores.' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';
    let dados = {};
    let imagemCapa = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      dados = {
        titulo: formData.get('titulo'),
        slug: formData.get('slug'),
        subtitulo: formData.get('subtitulo'),
        resumo: formData.get('resumo'),
        conteudo: formData.get('conteudo'),
        categoriaId: formData.get('categoriaId'),
        autorNome: formData.get('autorNome') || session.user.name,
        autorId: session.user.id,
        status: formData.get('status') || 'rascunho',
        destaque: formData.get('destaque') === 'true',
        publicadoEm: formData.get('publicadoEm'),
      };
      const foto = formData.get('imagemCapa');
      if (foto && typeof foto === 'object' && foto.size > 0) {
        imagemCapa = foto;
      }
    } else {
      const body = await request.json();
      dados = {
        ...body,
        autorNome: body.autorNome || session.user.name,
        autorId: session.user.id,
      };
      if (body.imagemCapa) imagemCapa = body.imagemCapa;
    }

    const noticia = await criarNoticia({
      ...dados,
      imagemCapa,
    });

    return NextResponse.json(noticia, { status: 201 });
  } catch (error) {
    console.error('Erro na rota POST /api/noticias:', error);
    const status = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json({ erro: error.message || 'Erro ao criar notícia.' }, { status });
  }
}
