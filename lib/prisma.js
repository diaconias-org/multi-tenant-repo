/**
 * lib/prisma.js
 * Instância única (Singleton) do Prisma Client e Extensão Completa de Isolamento Multi-Tenant.
 * 
 * Proteção 1 (Prisma Client Extension Completa):
 * Intercepta compulsoriamente TODOS os métodos de consulta, contagem, agregação, criação,
 * atualização e exclusão em modelos multi-tenant (TENANT_SCOPED_MODELS), injetando o
 * `tenant_id` e prevenindo qualquer vazamento ou modificação cruzada entre paróquias.
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
 * Executa uma função dentro do contexto assíncrono blindado de um tenant específico.
 */
export function withTenant(tenantId, callback) {
  return tenantContext.run(tenantId, callback);
}

/**
 * Retorna o ID do tenant armazenado no contexto da requisição atual (se houver).
 */
export function getCurrentTenant() {
  return tenantContext.getStore() || null;
}

/**
 * Resolve o tenant ativo consultando na seguinte ordem de precedência:
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

const TENANT_SCOPED_MODELS = ['Comprovante', 'Usuario', 'Noticia', 'CategoriaNoticia'];

/**
 * Retorna a propriedade delegate correspondente no Prisma base (ex: 'CategoriaNoticia' -> prisma.categoriaNoticia)
 */
function getModelDelegate(modelName) {
  const propertyName = modelName.charAt(0).toLowerCase() + modelName.slice(1);
  return prisma[propertyName];
}

/**
 * Cria a instância estendida do cliente Prisma com cobertura completa de métodos.
 */
function createExtendedClient(configuredTenantId = null) {
  return prisma.$extends({
    name: 'tenantIsolation',
    query: {
      $allModels: {
        async findMany({ model, args, query }) {
          if (TENANT_SCOPED_MODELS.includes(model)) {
            const activeTenantId = await resolveActiveTenant(configuredTenantId);
            if (!activeTenantId) {
              throw new Error(`Consulta findMany em ${model} rejeitada: nenhum tenant ativo no contexto.`);
            }
            args.where = { ...args.where, tenant_id: activeTenantId };
          }
          return query(args);
        },

        async findFirst({ model, args, query }) {
          if (TENANT_SCOPED_MODELS.includes(model)) {
            const activeTenantId = await resolveActiveTenant(configuredTenantId);
            if (!activeTenantId) {
              throw new Error(`Consulta findFirst em ${model} rejeitada: nenhum tenant ativo no contexto.`);
            }
            args.where = { ...args.where, tenant_id: activeTenantId };
          }
          return query(args);
        },

        async findFirstOrThrow({ model, args, query }) {
          if (TENANT_SCOPED_MODELS.includes(model)) {
            const activeTenantId = await resolveActiveTenant(configuredTenantId);
            if (!activeTenantId) {
              throw new Error(`Consulta findFirstOrThrow em ${model} rejeitada: nenhum tenant ativo no contexto.`);
            }
            args.where = { ...args.where, tenant_id: activeTenantId };
          }
          return query(args);
        },

        // Converte findUnique para findFirst injetando tenant_id, impedindo vazamento de IDs únicos de outro tenant
        async findUnique({ model, args }) {
          if (TENANT_SCOPED_MODELS.includes(model)) {
            const activeTenantId = await resolveActiveTenant(configuredTenantId);
            if (!activeTenantId) {
              throw new Error(`Consulta findUnique em ${model} rejeitada: nenhum tenant ativo no contexto.`);
            }
            const delegate = getModelDelegate(model);
            return delegate.findFirst({
              ...args,
              where: { ...args.where, tenant_id: activeTenantId },
            });
          }
          const delegate = getModelDelegate(model);
          return delegate.findUnique(args);
        },

        async findUniqueOrThrow({ model, args }) {
          if (TENANT_SCOPED_MODELS.includes(model)) {
            const activeTenantId = await resolveActiveTenant(configuredTenantId);
            if (!activeTenantId) {
              throw new Error(`Consulta findUniqueOrThrow em ${model} rejeitada: nenhum tenant ativo no contexto.`);
            }
            const delegate = getModelDelegate(model);
            return delegate.findFirstOrThrow({
              ...args,
              where: { ...args.where, tenant_id: activeTenantId },
            });
          }
          const delegate = getModelDelegate(model);
          return delegate.findUniqueOrThrow(args);
        },

        async count({ model, args, query }) {
          if (TENANT_SCOPED_MODELS.includes(model)) {
            const activeTenantId = await resolveActiveTenant(configuredTenantId);
            if (!activeTenantId) {
              throw new Error(`Contagem em ${model} rejeitada: nenhum tenant ativo no contexto.`);
            }
            args.where = { ...args.where, tenant_id: activeTenantId };
          }
          return query(args);
        },

        async create({ model, args, query }) {
          if (TENANT_SCOPED_MODELS.includes(model)) {
            const activeTenantId = await resolveActiveTenant(configuredTenantId);
            if (!activeTenantId) {
              throw new Error(`Criação em ${model} rejeitada: nenhum tenant ativo no contexto.`);
            }
            args.data = { ...args.data, tenant_id: activeTenantId };
          }
          return query(args);
        },

        async createMany({ model, args, query }) {
          if (TENANT_SCOPED_MODELS.includes(model)) {
            const activeTenantId = await resolveActiveTenant(configuredTenantId);
            if (!activeTenantId) {
              throw new Error(`Criação createMany em ${model} rejeitada: nenhum tenant ativo no contexto.`);
            }
            if (Array.isArray(args.data)) {
              args.data = args.data.map((item) => ({ ...item, tenant_id: activeTenantId }));
            } else if (args.data) {
              args.data = { ...args.data, tenant_id: activeTenantId };
            }
          }
          return query(args);
        },

        // Garante que update verifique pertinência de tenant antes de efetuar alteração
        async update({ model, args, query }) {
          if (TENANT_SCOPED_MODELS.includes(model)) {
            const activeTenantId = await resolveActiveTenant(configuredTenantId);
            if (!activeTenantId) {
              throw new Error(`Atualização update em ${model} rejeitada: nenhum tenant ativo no contexto.`);
            }
            const delegate = getModelDelegate(model);
            const existente = await delegate.findFirst({
              where: { ...args.where, tenant_id: activeTenantId },
            });
            if (!existente) {
              throw new Error(`Atualização em ${model} rejeitada: registro não pertence ao tenant ativo.`);
            }
          }
          return query(args);
        },

        async updateMany({ model, args, query }) {
          if (TENANT_SCOPED_MODELS.includes(model)) {
            const activeTenantId = await resolveActiveTenant(configuredTenantId);
            if (!activeTenantId) {
              throw new Error(`Atualização updateMany em ${model} rejeitada: nenhum tenant ativo no contexto.`);
            }
            args.where = { ...args.where, tenant_id: activeTenantId };
          }
          return query(args);
        },

        // Garante que delete verifique pertinência de tenant antes de efetuar exclusão
        async delete({ model, args, query }) {
          if (TENANT_SCOPED_MODELS.includes(model)) {
            const activeTenantId = await resolveActiveTenant(configuredTenantId);
            if (!activeTenantId) {
              throw new Error(`Exclusão delete em ${model} rejeitada: nenhum tenant ativo no contexto.`);
            }
            const delegate = getModelDelegate(model);
            const existente = await delegate.findFirst({
              where: { ...args.where, tenant_id: activeTenantId },
            });
            if (!existente) {
              throw new Error(`Exclusão em ${model} rejeitada: registro não pertence ao tenant ativo.`);
            }
          }
          return query(args);
        },

        async deleteMany({ model, args, query }) {
          if (TENANT_SCOPED_MODELS.includes(model)) {
            const activeTenantId = await resolveActiveTenant(configuredTenantId);
            if (!activeTenantId) {
              throw new Error(`Exclusão deleteMany em ${model} rejeitada: nenhum tenant ativo no contexto.`);
            }
            args.where = { ...args.where, tenant_id: activeTenantId };
          }
          return query(args);
        },

        async upsert({ model, args, query }) {
          if (TENANT_SCOPED_MODELS.includes(model)) {
            const activeTenantId = await resolveActiveTenant(configuredTenantId);
            if (!activeTenantId) {
              throw new Error(`Upsert em ${model} rejeitado: nenhum tenant ativo no contexto.`);
            }
            args.create = { ...args.create, tenant_id: activeTenantId };
            const delegate = getModelDelegate(model);
            const existente = await delegate.findFirst({
              where: { ...args.where, tenant_id: activeTenantId },
            });
            if (!existente) {
              return delegate.create({
                ...args,
                data: { ...args.create, tenant_id: activeTenantId },
              });
            }
          }
          return query(args);
        },

        async aggregate({ model, args, query }) {
          if (TENANT_SCOPED_MODELS.includes(model)) {
            const activeTenantId = await resolveActiveTenant(configuredTenantId);
            if (!activeTenantId) {
              throw new Error(`Agregação em ${model} rejeitada: nenhum tenant ativo no contexto.`);
            }
            args.where = { ...args.where, tenant_id: activeTenantId };
          }
          return query(args);
        },

        async groupBy({ model, args, query }) {
          if (TENANT_SCOPED_MODELS.includes(model)) {
            const activeTenantId = await resolveActiveTenant(configuredTenantId);
            if (!activeTenantId) {
              throw new Error(`GroupBy em ${model} rejeitada: nenhum tenant ativo no contexto.`);
            }
            args.where = { ...args.where, tenant_id: activeTenantId };
          }
          return query(args);
        },
      },
    },
  });
}

// Cache de instâncias para evitar memory leak por recriação de $extends
const clientsCache = new Map();

/**
 * Retorna um cliente Prisma blindado com isolamento de dados multi-tenant.
 * Se nenhum tenant for passado explicitamente, resolve dinamicamente
 * via AsyncLocalStorage ou headers HTTP da requisição.
 */
export function getTenantClient(tenantId = null) {
  const cacheKey = tenantId || '__dynamic_context__';
  if (!clientsCache.has(cacheKey)) {
    clientsCache.set(cacheKey, createExtendedClient(tenantId));
  }
  return clientsCache.get(cacheKey);
}
