/**
 * repositories/noticia.repository.js
 * Acesso a dados para Notícias e Artigos usando Prisma ORM
 * com isolamento multi-tenant automático via getTenantClient.
 */
import { getTenantClient } from '@/lib/prisma';

export async function listar({
  tenant_id = null,
  status = null,
  categoriaId = null,
  categoriaSlug = null,
  busca = null,
  destaque = null,
  ordenarPor = 'recente', // 'recente', 'antigo', 'titulo'
  pagina = 1,
  limite = 10,
} = {}) {
  const db = getTenantClient(tenant_id);
  const where = {};

  if (status) {
    where.status = status;
  }

  if (categoriaId) {
    where.categoria_id = Number(categoriaId);
  } else if (categoriaSlug) {
    where.categoria = {
      slug: String(categoriaSlug).trim().toLowerCase(),
    };
  }

  if (destaque !== null && destaque !== undefined) {
    where.destaque = Boolean(destaque);
  }

  if (busca && String(busca).trim()) {
    const termo = String(busca).trim();
    where.OR = [
      { titulo: { contains: termo } },
      { resumo: { contains: termo } },
      { subtitulo: { contains: termo } },
      { conteudo: { contains: termo } },
    ];
  }

  // Ordenação
  let orderBy = { publicado_em: 'desc' };
  if (ordenarPor === 'antigo') {
    orderBy = { publicado_em: 'asc' };
  } else if (ordenarPor === 'titulo') {
    orderBy = { titulo: 'asc' };
  } else if (ordenarPor === 'criado_em') {
    orderBy = { criado_em: 'desc' };
  }

  const page = Math.max(1, Number(pagina) || 1);
  const take = Math.max(1, Math.min(50, Number(limite) || 10));
  const skip = (page - 1) * take;

  const [total, noticias] = await Promise.all([
    db.noticia.count({ where }),
    db.noticia.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        categoria: {
          select: { id: true, nome: true, slug: true },
        },
      },
    }),
  ]);

  return {
    noticias,
    paginacao: {
      total,
      pagina: page,
      limite: take,
      totalPaginas: Math.ceil(total / take) || 1,
      temMais: skip + noticias.length < total,
    },
  };
}

export async function buscarPorSlug(slug, { tenant_id = null, apenasPublicada = true } = {}) {
  const db = getTenantClient(tenant_id);
  const where = {
    slug: String(slug).trim().toLowerCase(),
  };

  if (apenasPublicada) {
    where.status = 'publicada';
  }

  return db.noticia.findFirst({
    where,
    include: {
      categoria: {
        select: { id: true, nome: true, slug: true },
      },
    },
  });
}

export async function buscarPorId(id, { tenant_id = null } = {}) {
  const db = getTenantClient(tenant_id);
  return db.noticia.findFirst({
    where: { id: Number(id) },
    include: {
      categoria: {
        select: { id: true, nome: true, slug: true },
      },
    },
  });
}

export async function inserir(dados, { tenant_id = null } = {}) {
  const db = getTenantClient(tenant_id);
  return db.noticia.create({
    data: {
      titulo: dados.titulo,
      slug: dados.slug,
      subtitulo: dados.subtitulo || null,
      resumo: dados.resumo || null,
      conteudo: dados.conteudo,
      imagem_capa: dados.imagem_capa || null,
      categoria_id: dados.categoria_id ? Number(dados.categoria_id) : null,
      autor_id: dados.autor_id ? Number(dados.autor_id) : null,
      autor_nome: dados.autor_nome || null,
      status: dados.status || 'rascunho',
      destaque: Boolean(dados.destaque),
      publicado_em: dados.publicado_em || (dados.status === 'publicada' ? new Date() : null),
    },
  });
}

export async function atualizar(id, dados, { tenant_id = null } = {}) {
  const db = getTenantClient(tenant_id);
  const data = {};

  if (dados.titulo !== undefined) data.titulo = dados.titulo;
  if (dados.slug !== undefined) data.slug = dados.slug;
  if (dados.subtitulo !== undefined) data.subtitulo = dados.subtitulo || null;
  if (dados.resumo !== undefined) data.resumo = dados.resumo || null;
  if (dados.conteudo !== undefined) data.conteudo = dados.conteudo;
  if (dados.imagem_capa !== undefined) data.imagem_capa = dados.imagem_capa || null;
  if (dados.categoria_id !== undefined) data.categoria_id = dados.categoria_id ? Number(dados.categoria_id) : null;
  if (dados.autor_id !== undefined) data.autor_id = dados.autor_id ? Number(dados.autor_id) : null;
  if (dados.autor_nome !== undefined) data.autor_nome = dados.autor_nome || null;
  if (dados.status !== undefined) data.status = dados.status;
  if (dados.destaque !== undefined) data.destaque = Boolean(dados.destaque);
  if (dados.publicado_em !== undefined) data.publicado_em = dados.publicado_em;

  await db.noticia.updateMany({
    where: { id: Number(id) },
    data,
  });

  return buscarPorId(id, { tenant_id });
}

export async function deletar(id, { tenant_id = null } = {}) {
  const db = getTenantClient(tenant_id);
  await db.noticia.deleteMany({
    where: { id: Number(id) },
  });
  return true;
}

export async function listarRelacionadas({ categoriaId = null, excetoId, limite = 3, tenant_id = null }) {
  const db = getTenantClient(tenant_id);
  const where = {
    status: 'publicada',
    id: { not: Number(excetoId) },
  };

  if (categoriaId) {
    where.categoria_id = Number(categoriaId);
  }

  return db.noticia.findMany({
    where,
    orderBy: { publicado_em: 'desc' },
    take: Number(limite) || 3,
    include: {
      categoria: {
        select: { id: true, nome: true, slug: true },
      },
    },
  });
}

export async function buscarVizinhos(noticiaAtual, { tenant_id = null } = {}) {
  const db = getTenantClient(tenant_id);
  const dataReferencia = noticiaAtual.publicado_em || noticiaAtual.criado_em;

  const [anterior, proxima] = await Promise.all([
    // Anterior (mais antiga)
    db.noticia.findFirst({
      where: {
        status: 'publicada',
        id: { not: noticiaAtual.id },
        publicado_em: { lt: dataReferencia },
      },
      orderBy: { publicado_em: 'desc' },
      select: { id: true, titulo: true, slug: true },
    }),
    // Próxima (mais recente)
    db.noticia.findFirst({
      where: {
        status: 'publicada',
        id: { not: noticiaAtual.id },
        publicado_em: { gt: dataReferencia },
      },
      orderBy: { publicado_em: 'asc' },
      select: { id: true, titulo: true, slug: true },
    }),
  ]);

  return { anterior, proxima };
}
