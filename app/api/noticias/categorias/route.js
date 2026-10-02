/**
 * app/api/noticias/categorias/route.js
 * Endpoints para listagem e criação de categorias de notícias.
 */
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { tratarErroApi } from '@/lib/errors';
import { validarDTO, CriarCategoriaDTO } from '@/dtos';
import { listarCategorias, criarCategoria } from '@/services/categoria.service';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const apenasAtivos = searchParams.get('apenasAtivos') === 'true';

    const categorias = await listarCategorias({ apenasAtivos });
    return NextResponse.json(categorias);
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    return tratarErroApi(error, 'Erro ao listar categorias.');
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ erro: 'Não autorizado.' }, { status: 401 });
    }

    const body = await request.json();
    const dadosValidados = validarDTO(CriarCategoriaDTO, body);
    const nova = await criarCategoria(dadosValidados);
    return NextResponse.json(nova, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    return tratarErroApi(error, 'Erro ao criar categoria.');
  }
}

