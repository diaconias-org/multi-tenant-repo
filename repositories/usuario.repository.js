/**
 * repositories/usuario.repository.js
 * Camada de acesso a dados para Usuários Administrativos usando Prisma ORM
 * com blindagem automática de isolamento multi-tenant (Proteção 1).
 */
import { prisma, getTenantClient } from '@/lib/prisma';

export async function buscarPorEmail(email, { tenant_id = null } = {}) {
  if (!email) return null;
  const emailLimpo = String(email).trim().toLowerCase();

  if (tenant_id) {
    const db = getTenantClient(tenant_id);
    return db.usuario.findFirst({
      where: { email: emailLimpo },
    });
  }

  // Busca global de autenticação (quando o usuário digita email sem saber o tenant)
  return prisma.usuario.findUnique({
    where: { email: emailLimpo },
  });
}

export async function buscarPorId(id, { tenant_id = null } = {}) {
  if (!id) return null;
  const idNum = Number(id);

  if (tenant_id) {
    const db = getTenantClient(tenant_id);
    return db.usuario.findFirst({
      where: { id: idNum },
    });
  }

  return prisma.usuario.findUnique({
    where: { id: idNum },
  });
}

export async function listar({ tenant_id = null } = {}) {
  const db = getTenantClient(tenant_id);
  return db.usuario.findMany({
    select: {
      id: true,
      nome: true,
      email: true,
      criado_em: true,
    },
    orderBy: { criado_em: 'asc' },
  });
}

export async function inserir({ nome, email, senha_hash, tenant_id = null }) {
  const db = getTenantClient(tenant_id);
  const usuario = await db.usuario.create({
    data: {
      nome,
      email: String(email).trim().toLowerCase(),
      senha_hash,
    },
  });
  return usuario.id;
}

export async function atualizarSenha(id, novaSenhaHash, { tenant_id = null } = {}) {
  const db = getTenantClient(tenant_id);
  await db.usuario.updateMany({
    where: { id: Number(id) },
    data: { senha_hash: novaSenhaHash },
  });
  return true;
}

export async function deletar(id, { tenant_id = null } = {}) {
  const db = getTenantClient(tenant_id);
  await db.usuario.deleteMany({
    where: { id: Number(id) },
  });
  return true;
}
