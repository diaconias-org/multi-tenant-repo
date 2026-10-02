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

  // 3. Garante categorias padrão de notícias
  const categoriasSeed = [
    { nome: 'Festejos & Eventos', slug: 'festejos-e-eventos', descricao: 'Celebrações, festejos das comunidades rurais e encontros' },
    { nome: 'Pastorais & Missão', slug: 'pastorais-e-missao', descricao: 'Atividades das pastorais, catequese e evangelização' },
    { nome: 'Liturgia & Espiritualidade', slug: 'liturgia-e-espiritualidade', descricao: 'Orientações litúrgicas, cartas do pároco e oração' },
    { nome: 'Avisos & Comunicados', slug: 'avisos-e-comunicados', descricao: 'Horários de missas, avisos e notas oficiais' },
  ];

  const categoriasCriadas = [];
  for (const cat of categoriasSeed) {
    const c = await prisma.categoriaNoticia.upsert({
      where: {
        tenant_id_slug: {
          tenant_id: tenant.id,
          slug: cat.slug,
        },
      },
      update: {},
      create: {
        ...cat,
        tenant_id: tenant.id,
      },
    });
    categoriasCriadas.push(c);
  }
  console.log(`[Seed] ${categoriasCriadas.length} categorias configuradas.`);

  // 4. Garante notícias iniciais
  const noticiasSeed = [
    {
      titulo: 'Diaconia Territorial inicia preparativos para o Festejo de São Raimundo Nonato',
      slug: 'diaconia-inicia-preparativos-festejo-sao-raimundo-nonato',
      subtitulo: 'Comunidades rurais e sede paroquial se unem para organizar a maior celebração de fé do território.',
      resumo: 'A coordenação paroquial anunciou a programação prévia do festejo, com novenários, celebrações e leilões comunitários.',
      conteudo: `
        <p>A <strong>Diaconia Territorial São Raimundo Nonato</strong> deu início aos preparativos pastorais e logísticos para os festejos do padroeiro deste ano. O encontro reuniu coordenadores de pastorais, conselhos comunitários e lideranças das diversas comunidades rurais que compõem o nosso território.</p>
        <h2>União e Devoção nas Comunidades</h2>
        <p>Durante a reunião de abertura, foram definidas as comissões organizadoras responsáveis pela liturgia, animação, barracas comunitárias e acolhida dos romeiros e devotos que visitam Curralinhos nesta época de graça.</p>
        <blockquote>"Celebrar nosso padroeiro é renovar nossa esperança e fortalecer os laços de fraternidade entre todas as famílias da nossa terra."</blockquote>
        <p>A programação completa com os noitários e celebrações será divulgada em breve nos canais oficiais e ao final de cada celebração dominical.</p>
      `,
      categoria_id: categoriasCriadas[0]?.id,
      autor_nome: 'Pascom Diaconia',
      status: 'publicada',
      destaque: true,
      publicado_em: new Date(),
    },
    {
      titulo: 'Formação para Catequistas reúne lideranças das comunidades de Curralinhos',
      slug: 'formacao-catequistas-comunidades-curralinhos',
      subtitulo: 'Momento de espiritualidade e aprofundamento metodológico para a Iniciação à Vida Cristã.',
      resumo: 'Catequistas de diversas localidades rurais participaram de uma manhã de oração, partilha e estudo das novas diretrizes da catequese.',
      conteudo: `
        <p>No último sábado, os catequistas das comunidades rurais e da sede estiveram reunidos para o encontro trimestral de formação e espiritualidade catequética.</p>
        <h2>Metodologia Querigmática</h2>
        <p>O foco do encontro foi a abordagem do catecumenato com metodologia querigmática, preparando as crianças e jovens não apenas para os sacramentos, mas para uma vida autêntica de seguimento a Cristo.</p>
        <ul>
          <li>Mística e espiritualidade do catequista</li>
          <li>Acolhimento às famílias na catequese</li>
          <li>Calendário de encontros para o segundo semestre</li>
        </ul>
      `,
      categoria_id: categoriasCriadas[1]?.id,
      autor_nome: 'Pastoral da Catequese',
      status: 'publicada',
      destaque: false,
      publicado_em: new Date(Date.now() - 3 * 24 * 3600 * 1000),
    },
    {
      titulo: 'Devolução do Dízimo: Participe da missão viva da nossa Igreja',
      slug: 'devolucao-do-dizimo-participe-da-missao-viva',
      subtitulo: 'Entenda como o dízimo sustenta a evangelização, a caridade e a manutenção das capelas.',
      resumo: 'A pastoral do dízimo convida a todos os fiéis a realizarem sua devolução mensal, agora também com chave Pix disponível.',
      conteudo: `
        <p>O Dízimo é um ato de gratidão e corresponsabilidade com o Reino de Deus. Cada contribuição sustenta a formação de agentes de pastoral, o atendimento aos irmãos em vulnerabilidade e a preservação dos espaços de oração.</p>
        <p>Lembramos que agora você pode realizar a devolução do dízimo com praticidade pelo sistema online de comprovantes via Pix em nosso site.</p>
      `,
      categoria_id: categoriasCriadas[3]?.id,
      autor_nome: 'Pastoral do Dízimo',
      status: 'publicada',
      destaque: false,
      publicado_em: new Date(Date.now() - 7 * 24 * 3600 * 1000),
    },
  ];

  for (const not of noticiasSeed) {
    await prisma.noticia.upsert({
      where: {
        tenant_id_slug: {
          tenant_id: tenant.id,
          slug: not.slug,
        },
      },
      update: {},
      create: {
        ...not,
        tenant_id: tenant.id,
      },
    });
  }
  console.log(`[Seed] ${noticiasSeed.length} notícias iniciais publicadas.`);
}

main()
  .catch((e) => {
    console.error('[Seed] Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
