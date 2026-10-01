/**
 * repositories/comprovante.repository.js
 * Camada de acesso a dados para Comprovantes de Dízimo usando Prisma ORM
 * com blindagem automática de isolamento multi-tenant (Proteção 1).
 */
import { getTenantClient } from '@/lib/prisma';

export async function inserir({
  nome,
  telefone = null,
  foto_url = null,
  observacao = null,
  tenant_id = null,
}) {
  const db = getTenantClient(tenant_id);
  const comprovante = await db.comprovante.create({
    data: {
      nome,
      telefone: telefone || null,
      foto_url: foto_url || null,
      observacao: observacao || null,
    },
  });
  return comprovante.id;
}

export async function listar({ tenant_id = null } = {}) {
  const db = getTenantClient(tenant_id);
  const comprovantes = await db.comprovante.findMany({
    orderBy: { criado_em: 'desc' },
  });

  return comprovantes.map((c) => ({
    id: c.id,
    nome: c.nome,
    telefone: c.telefone,
    foto_url: c.foto_url,
    criado_em: c.criado_em ? c.criado_em.toLocaleString('pt-BR') : '',
    observacao: c.observacao,
    status: c.status || 'pendente',
  }));
}

export async function buscarPorId(id, { tenant_id = null } = {}) {
  const db = getTenantClient(tenant_id);
  const comprovante = await db.comprovante.findFirst({
    where: { id: Number(id) },
  });

  if (!comprovante) return null;

  return {
    id: comprovante.id,
    nome: comprovante.nome,
    telefone: comprovante.telefone,
    foto_url: comprovante.foto_url,
    criado_em: comprovante.criado_em ? comprovante.criado_em.toLocaleString('pt-BR') : '',
    observacao: comprovante.observacao,
    status: comprovante.status || 'pendente',
  };
}

export async function atualizarStatus(id, status, { tenant_id = null } = {}) {
  const db = getTenantClient(tenant_id);
  await db.comprovante.updateMany({
    where: { id: Number(id) },
    data: { status },
  });
  return true;
}

export async function deletar(id, { tenant_id = null } = {}) {
  const db = getTenantClient(tenant_id);
  await db.comprovante.deleteMany({
    where: { id: Number(id) },
  });
  return true;
}
