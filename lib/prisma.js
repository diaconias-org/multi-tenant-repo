/**
 * lib/prisma.js
 * Instância única (Singleton) do Prisma Client e Extensão de Isolamento Multi-Tenant.
 * 
 * Proteção 1 (Prisma Client Extension):
 * Garante que qualquer busca, contagem, criação ou exclusão filtre e injete
 * automaticamente o `tenant_id`, prevenindo vazamento de dados entre paróquias.
 */
import { PrismaClient } from '@prisma/client';
import { AsyncLocalStorage } from 'node:async_hooks';

const globalForPrisma = globalThis;

// Instância base do Prisma Client
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Armazenamento assíncrono do contexto de Tenant da requisição
export const tenantContext = new AsyncLocalStorage();

/**
 * Executa uma função dentro do contexto de um tenant específico.
 */
export function withTenant(tenantId, callback) {
  return tenantContext.run(tenantId, callback);
}

/**
 * Retorna o ID do tenant da requisição atual (se houver).
 */
export function getCurrentTenant() {
  return tenantContext.getStore() || null;
}

/**
 * Resolve o tenant ativo consultando:
 * 1. Parâmetro explícito passado na chamada
 * 2. AsyncLocalStorage (withTenant)
 * 3. Headers HTTP da requisição Next.js (x-tenant-id injetado pelo proxy.js)
 */
async function resolveActiveTenant(explicitTenantId = null) {
  if (explicitTenantId) return explicitTenantId;

  // 1. Contexto assíncrono manual (withTenant)
  const storeTenant = tenantContext.getStore();
  if (storeTenant) return storeTenant;

  // 2. Headers da requisição HTTP (injetado automaticamente pelo proxy.js)
  try {
    const { headers } = await import('next/headers');
    const headerList = await headers();
    const headerTenant = headerList.get('x-tenant-id');
    if (headerTenant) return headerTenant;
  } catch {
    // Fora do ciclo de requisição HTTP (ex: scripts avulsos, seeds, CLI)
  }

  return null;
}

/**
 * Retorna um cliente Prisma blindado com isolamento de dados multi-tenant.
 * Se nenhum tenant for passado explicitamente, ele descobre automaticamente
 * o tenant da requisição atual através do proxy.js (zero esforço nas páginas).
 */
const TENANT_SCOPED_MODELS = ['Comprovante', 'Usuario', 'Noticia', 'CategoriaNoticia'];

export function getTenantClient(tenantId = null) {
  const explicitTenantId = tenantId || getCurrentTenant();

  return prisma.$extends({
    name: 'tenantIsolation',
    query: {
      $allModels: {
        async findMany({ model, args, query }) {
          if (TENANT_SCOPED_MODELS.includes(model)) {
            const activeTenantId = await resolveActiveTenant(explicitTenantId);
            if (!activeTenantId) {
              throw new Error(`Consulta em ${model} rejeitada: nenhum tenant ativo no contexto.`);
            }
            args.where = { ...args.where, tenant_id: activeTenantId };
          }
          return query(args);
        },
        async findFirst({ model, args, query }) {
          if (TENANT_SCOPED_MODELS.includes(model)) {
            const activeTenantId = await resolveActiveTenant(explicitTenantId);
            if (!activeTenantId) {
              throw new Error(`Consulta em ${model} rejeitada: nenhum tenant ativo no contexto.`);
            }
            args.where = { ...args.where, tenant_id: activeTenantId };
          }
          return query(args);
        },
        async count({ model, args, query }) {
          if (TENANT_SCOPED_MODELS.includes(model)) {
            const activeTenantId = await resolveActiveTenant(explicitTenantId);
            if (!activeTenantId) {
              throw new Error(`Contagem em ${model} rejeitada: nenhum tenant ativo no contexto.`);
            }
            args.where = { ...args.where, tenant_id: activeTenantId };
          }
          return query(args);
        },
        async create({ model, args, query }) {
          if (TENANT_SCOPED_MODELS.includes(model)) {
            const activeTenantId = await resolveActiveTenant(explicitTenantId);
            if (!activeTenantId) {
              throw new Error(`Criação em ${model} rejeitada: nenhum tenant ativo no contexto.`);
            }
            args.data = { ...args.data, tenant_id: activeTenantId };
          }
          return query(args);
        },
        async updateMany({ model, args, query }) {
          if (TENANT_SCOPED_MODELS.includes(model)) {
            const activeTenantId = await resolveActiveTenant(explicitTenantId);
            if (!activeTenantId) {
              throw new Error(`Atualização em ${model} rejeitada: nenhum tenant ativo no contexto.`);
            }
            args.where = { ...args.where, tenant_id: activeTenantId };
          }
          return query(args);
        },
        async deleteMany({ model, args, query }) {
          if (TENANT_SCOPED_MODELS.includes(model)) {
            const activeTenantId = await resolveActiveTenant(explicitTenantId);
            if (!activeTenantId) {
              throw new Error(`Exclusão em ${model} rejeitada: nenhum tenant ativo no contexto.`);
            }
            args.where = { ...args.where, tenant_id: activeTenantId };
          }
          return query(args);
        },
      },
    },
  });
}
