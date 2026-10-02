/**
 * app/api/noticias/categorias/[id]/route.js
 * Endpoints para edição, exclusão e alternância de status de categoria.
 */
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { AppError } from '@/lib/errors';
import {
  atualizarCategoria,
  deletarCategoria,
  alternarStatusCategoria,
} from '@/services/categoria.service';

export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ erro: 'Não autorizado.' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const atualizada = await atualizarCategoria(id, body);
    return NextResponse.json(atualizada);
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    const status = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json({ erro: error.message || 'Erro ao atualizar categoria.' }, { status });
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ erro: 'Não autorizado.' }, { status: 401 });
    }

    const { id } = await params;
    const atualizada = await alternarStatusCategoria(id);
    return NextResponse.json(atualizada);
  } catch (error) {
    console.error('Erro ao alternar status da categoria:', error);
    const status = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json({ erro: error.message || 'Erro ao alterar status.' }, { status });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ erro: 'Não autorizado.' }, { status: 401 });
    }

    const { id } = await params;
    await deletarCategoria(id);
    return NextResponse.json({ sucesso: true, mensagem: 'Categoria excluída com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir categoria:', error);
    const status = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json({ erro: error.message || 'Erro ao excluir categoria.' }, { status });
  }
}
