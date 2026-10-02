/**
 * services/categoria.service.js
 * Camada de negócio para Categorias de Notícias.
 */
import { AppError } from '@/lib/errors';
import * as categoriaRepo from '@/repositories/categoria.repository';

export function gerarSlug(texto) {
  if (!texto) return '';
  return texto
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // remove caracteres especiais
    .replace(/[\s_]+/g, '-') // espaços viram hífens
    .replace(/-+/g, '-') // múltiplos hífens viram um só
    .replace(/^-+|-+$/g, ''); // remove hífen das pontas
}

export async function listarCategorias({ tenantId = null, apenasAtivos = false } = {}) {
  return categoriaRepo.listar({ tenant_id: tenantId, apenasAtivos });
}

export async function obterCategoria(id, { tenantId = null } = {}) {
  const cat = await categoriaRepo.buscarPorId(id, { tenant_id: tenantId });
  if (!cat) {
    throw new AppError('Categoria não encontrada.', 404);
  }
  return cat;
}

export async function criarCategoria({ nome, slug = null, descricao = null, ativo = true, tenantId = null }) {
  if (!nome || !String(nome).trim()) {
    throw new AppError('O nome da categoria é obrigatório.', 400);
  }

  const nomeFormatado = String(nome).trim();
  const slugFormatado = slug ? gerarSlug(slug) : gerarSlug(nomeFormatado);

  if (!slugFormatado) {
    throw new AppError('Não foi possível gerar um slug válido para a categoria.', 400);
  }

  // Verifica se já existe categoria com esse slug no tenant
  const existente = await categoriaRepo.buscarPorSlug(slugFormatado, { tenant_id: tenantId });
  if (existente) {
    throw new AppError(`Já existe uma categoria cadastrada com o slug "${slugFormatado}".`, 409);
  }

  return categoriaRepo.inserir({
    nome: nomeFormatado,
    slug: slugFormatado,
    descricao: descricao ? String(descricao).trim() : null,
    ativo: ativo !== undefined ? Boolean(ativo) : true,
    tenant_id: tenantId,
  });
}

export async function atualizarCategoria(id, { nome, slug, descricao, ativo, tenantId = null }) {
  if (!id) {
    throw new AppError('ID da categoria não fornecido.', 400);
  }

  const categoriaAtual = await obterCategoria(id, { tenantId });
  const dadosAtualizacao = {};

  if (nome !== undefined) {
    if (!String(nome).trim()) {
      throw new AppError('O nome da categoria não pode ficar vazio.', 400);
    }
    dadosAtualizacao.nome = String(nome).trim();
  }

  if (slug !== undefined) {
    const slugFormatado = gerarSlug(slug || dadosAtualizacao.nome || categoriaAtual.nome);
    if (!slugFormatado) {
      throw new AppError('Slug inválido.', 400);
    }
    // Se o slug mudou, verifica duplicidade
    if (slugFormatado !== categoriaAtual.slug) {
      const existente = await categoriaRepo.buscarPorSlug(slugFormatado, { tenant_id: tenantId });
      if (existente && existente.id !== categoriaAtual.id) {
        throw new AppError(`Já existe uma categoria com o slug "${slugFormatado}".`, 409);
      }
    }
    dadosAtualizacao.slug = slugFormatado;
  }

  if (descricao !== undefined) {
    dadosAtualizacao.descricao = descricao ? String(descricao).trim() : null;
  }

  if (ativo !== undefined) {
    dadosAtualizacao.ativo = Boolean(ativo);
  }

  return categoriaRepo.atualizar(id, dadosAtualizacao, { tenant_id: tenantId });
}

export async function alternarStatusCategoria(id, { tenantId = null } = {}) {
  const cat = await obterCategoria(id, { tenantId });
  return categoriaRepo.atualizar(id, { ativo: !cat.ativo }, { tenant_id: tenantId });
}

export async function deletarCategoria(id, { tenantId = null } = {}) {
  await obterCategoria(id, { tenantId });
  return categoriaRepo.deletar(id, { tenant_id: tenantId });
}
