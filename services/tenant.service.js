/**
 * services/tenant.service.js
 * Camada de serviço para Organizações / Paróquias (Multi-Tenant).
 */
import { prisma } from '@/lib/prisma';
import { AppError } from '@/lib/errors';

export async function obterTenant(idOuSlug = 'curralinhos') {
  if (!idOuSlug) return null;
  const idFormatado = String(idOuSlug).trim().toLowerCase();

  return prisma.tenant.findFirst({
    where: {
      OR: [{ id: idFormatado }, { slug: idFormatado }],
    },
  });
}

export async function listarTenants() {
  return prisma.tenant.findMany({
    orderBy: { criado_em: 'asc' },
  });
}

export async function criarTenant({ id, nome, slug = null, logo_url = null }) {
  if (!id?.trim()) throw new AppError('Identificador (ID) do tenant é obrigatório.', 400);
  if (!nome?.trim()) throw new AppError('Nome do tenant é obrigatório.', 400);

  const idLimpo = id.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
  const slugLimpo = (slug || idLimpo).trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');

  const existente = await prisma.tenant.findUnique({
    where: { id: idLimpo },
  });

  if (existente) {
    throw new AppError('Já existe uma paróquia/tenant cadastrada com este ID.', 409);
  }

  return prisma.tenant.create({
    data: {
      id: idLimpo,
      nome: nome.trim(),
      slug: slugLimpo,
      logo_url,
    },
  });
}

export async function validarTenantAtivo(idOuSlug) {
  if (!idOuSlug || !String(idOuSlug).trim()) {
    throw new AppError('Identificador da paróquia (tenant) não foi fornecido.', 400);
  }

  const tenant = await obterTenant(idOuSlug);
  if (!tenant) {
    throw new AppError(`Paróquia/Tenant "${idOuSlug}" não foi encontrada.`, 404);
  }

  return tenant;
}

/**
 * Resolve e valida o tenant a partir da requisição HTTP (headers, subdomínio, query string ou fallback).
 * Falha imediatamente (Fail-Fast) se o tenant não existir ou não for identificado.
 */
export async function resolverTenantDaRequisicao(request, { fallbackParaDefault = false } = {}) {
  // 1. Cabeçalho HTTP customizado (ex: x-tenant-id)
  const headerTenant = request.headers.get('x-tenant-id');
  if (headerTenant) {
    return validarTenantAtivo(headerTenant);
  }

  // 2. Query param (ex: ?tenant=curralinhos)
  try {
    const url = new URL(request.url);
    const queryTenant = url.searchParams.get('tenant');
    if (queryTenant) {
      return validarTenantAtivo(queryTenant);
    }
  } catch {}

  // 3. Subdomínio da URL (ex: curralinhos.diaconia.org ou curralinhos.localhost)
  const host = request.headers.get('host') || '';
  const hostSemPorta = host.split(':')[0];
  const partes = hostSemPorta.split('.');
  if (partes.length >= 2 && partes[0] !== 'www' && partes[0] !== 'localhost' && !partes[0].match(/^\d+$/)) {
    const tenantDoSubdominio = await obterTenant(partes[0]);
    if (tenantDoSubdominio) {
      return tenantDoSubdominio;
    }
  }

  // 4. Fallback de ambiente (ativo se explicitamente habilitado para transição)
  if (fallbackParaDefault) {
    const defaultTenantId = process.env.DEFAULT_TENANT_ID || 'curralinhos';
    return validarTenantAtivo(defaultTenantId);
  }

  // Se nenhum tenant foi fornecido ou resolvido, falha imediatamente
  throw new AppError('Paróquia não identificada na requisição. Ação recusada.', 400);
}

