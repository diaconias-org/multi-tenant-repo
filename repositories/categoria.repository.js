/**
 * repositories/categoria.repository.js
 * Acesso a dados para Categorias de Notícias usando Prisma ORM
 * com isolamento multi-tenant automático via getTenantClient.
 */
import { getTenantClient } from '@/lib/prisma';

export async function listar({ tenant_id = null, apenasAtivos = false } = {}) {
  const db = getTenantClient(tenant_id);
  const where = {};
  if (apenasAtivos) {
    where.ativo = true;
  }

  return db.categoriaNoticia.findMany({
    where,
    orderBy: { nome: 'asc' },
    include: {
      _count: {
        select: { noticias: true },
      },
    },
  });
}

export async function buscarPorId(id, { tenant_id = null } = {}) {
  const db = getTenantClient(tenant_id);
  return db.categoriaNoticia.findFirst({
    where: { id: Number(id) },
  });
}

export async function buscarPorSlug(slug, { tenant_id = null } = {}) {
  const db = getTenantClient(tenant_id);
  return db.categoriaNoticia.findFirst({
    where: { slug: String(slug).trim().toLowerCase() },
  });
}

export async function inserir({ nome, slug, descricao = null, ativo = true, tenant_id = null }) {
  const db = getTenantClient(tenant_id);
  return db.categoriaNoticia.create({
    data: {
      nome: String(nome).trim(),
      slug: String(slug).trim().toLowerCase(),
      descricao: descricao ? String(descricao).trim() : null,
      ativo: Boolean(ativo),
    },
  });
}

export async function atualizar(id, dados, { tenant_id = null } = {}) {
  const db = getTenantClient(tenant_id);
  const updateData = {};
  if (dados.nome !== undefined) updateData.nome = String(dados.nome).trim();
  if (dados.slug !== undefined) updateData.slug = String(dados.slug).trim().toLowerCase();
  if (dados.descricao !== undefined) updateData.descricao = dados.descricao ? String(dados.descricao).trim() : null;
  if (dados.ativo !== undefined) updateData.ativo = Boolean(dados.ativo);

  await db.categoriaNoticia.updateMany({
    where: { id: Number(id) },
    data: updateData,
  });

  return buscarPorId(id, { tenant_id });
}

export async function deletar(id, { tenant_id = null } = {}) {
  const db = getTenantClient(tenant_id);
  await db.categoriaNoticia.deleteMany({
    where: { id: Number(id) },
  });
  return true;
}
