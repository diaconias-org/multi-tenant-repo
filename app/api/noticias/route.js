/**
 * app/api/noticias/route.js
 * Endpoints públicos e administrativos para listagem e criação de notícias.
 */
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { tratarErroApi } from '@/lib/errors';
import {
  validarDTO,
  CriarNoticiaDTO,
  ListarNoticiasPublicasQueryDTO,
  ListarNoticiasAdminQueryDTO,
} from '@/dtos';
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

      // Validação com DTO administrativo
      const queryParams = validarDTO(ListarNoticiasAdminQueryDTO, {
        status: searchParams.get('status'),
        categoriaId: searchParams.get('categoriaId'),
        busca: searchParams.get('busca'),
        destaque: searchParams.get('destaque'),
        ordenarPor: searchParams.get('ordenarPor'),
        pagina: searchParams.get('pagina'),
        limite: searchParams.get('limite'),
      });

      const resultado = await listarTodasNoticiasAdmin(queryParams);
      return NextResponse.json(resultado);
    }

    // Consulta pública: validada por DTO
    const queryParams = validarDTO(ListarNoticiasPublicasQueryDTO, {
      categoria: searchParams.get('categoria'),
      busca: searchParams.get('busca'),
      destaque: searchParams.get('destaque'),
      ordenarPor: searchParams.get('ordenarPor'),
      pagina: searchParams.get('pagina'),
      limite: searchParams.get('limite'),
    });

    const resultado = await listarNoticiasPublicas({
      categoriaSlug: queryParams.categoria,
      busca: queryParams.busca,
      destaque: queryParams.destaque,
      ordenarPor: queryParams.ordenarPor,
      pagina: queryParams.pagina,
      limite: queryParams.limite,
    });

    return NextResponse.json(resultado);
  } catch (error) {
    console.error('Erro na rota GET /api/noticias:', error);
    return tratarErroApi(error, 'Erro ao buscar notícias.');
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
    let dadosBrutos = {};
    let imagemCapa = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      dadosBrutos = {
        titulo: formData.get('titulo'),
        slug: formData.get('slug'),
        subtitulo: formData.get('subtitulo'),
        resumo: formData.get('resumo'),
        conteudo: formData.get('conteudo'),
        categoriaId: formData.get('categoriaId'),
        autorNome: formData.get('autorNome') || session.user.name,
        autorId: session.user.id,
        status: formData.get('status') || 'rascunho',
        destaque: formData.get('destaque'),
        publicadoEm: formData.get('publicadoEm'),
      };
      const foto = formData.get('imagemCapa');
      if (foto && typeof foto === 'object' && foto.size > 0) {
        imagemCapa = foto;
      }
    } else {
      const body = await request.json();
      dadosBrutos = {
        ...body,
        autorNome: body.autorNome || session.user.name,
        autorId: session.user.id,
      };
      if (body.imagemCapa) imagemCapa = body.imagemCapa;
    }

    // 1. Validação de formato e tipos via DTO
    const dadosValidados = validarDTO(CriarNoticiaDTO, dadosBrutos);

    // 2. Executa a criação no Service com dados 100% validados
    const noticia = await criarNoticia({
      ...dadosValidados,
      imagemCapa,
    });

    return NextResponse.json(noticia, { status: 201 });
  } catch (error) {
    console.error('Erro na rota POST /api/noticias:', error);
    return tratarErroApi(error, 'Erro ao criar notícia.');
  }
}

