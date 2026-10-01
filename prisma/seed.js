/**
 * prisma/seed.js
 * Script de inicialização e dados padrão (seed) executado via Prisma.
 */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = process.env.DEFAULT_ADMIN_EMAIL || 'admin@diaconia.org';
  const senha = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123change';
  const nome  = process.env.DEFAULT_ADMIN_NOME || 'Administrador Diaconia';

  // 1. Garante o tenant padrão
  const tenant = await prisma.tenant.upsert({
    where: { id: 'curralinhos' },
    update: {},
    create: {
      id: 'curralinhos',
      nome: 'Diaconia Territorial São Raimundo Nonato',
      slug: 'curralinhos',
    },
  });
  console.log(`[Seed] Tenant padrão configurado: ${tenant.nome} (${tenant.id})`);

  // 2. Garante o usuário administrador padrão
  const existente = await prisma.usuario.findUnique({
    where: { email },
  });

  if (!existente) {
    const hash = await bcrypt.hash(senha, 12);
    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha_hash: hash,
        tenant_id: tenant.id,
      },
    });
    console.log(`[Seed] Administrador padrão criado com sucesso: ${usuario.email}`);
  } else {
    console.log(`[Seed] Administrador já existente: ${existente.email}`);
  }
}

main()
  .catch((e) => {
    console.error('[Seed] Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
