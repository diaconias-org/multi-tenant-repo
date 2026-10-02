/**
 * services/noticia.service.js
 * Camada de negócio e validações para Notícias e Artigos.
 */
import { AppError } from '@/lib/errors';
import { salvarArquivo } from '@/lib/storage';
import { sanitizarHtml } from '@/lib/sanitize';
import { gerarSlug } from './categoria.service';
import * as noticiaRepo from '@/repositories/noticia.repository';
import * as categoriaRepo from '@/repositories/categoria.repository';

const STATUS_VALIDOS = ['rascunho', 'agendada', 'publicada', 'arquivada'];

/**
 * Remove tags HTML e trunca texto para criar um resumo automático.
 */
function extrairResumoDeHtml(html, tamanhoMax = 180) {
  if (!html) return '';
  const semHtml = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (semHtml.length <= tamanhoMax) return semHtml;
  return semHtml.substring(0, tamanhoMax).trim() + '…';
}

export async function listarNoticiasPublicas({
  tenantId = null,
  categoriaSlug = null,
  busca = null,
  destaque = null,
  ordenarPor = 'recente',
  pagina = 1,
  limite = 10,
} = {}) {
  return noticiaRepo.listar({
    tenant_id: tenantId,
    status: 'publicada',
    categoriaSlug,
    busca,
    destaque,
    ordenarPor,
    pagina,
    limite,
  });
}

export async function listarTodasNoticiasAdmin({
  tenantId = null,
  status = null,
  categoriaId = null,
  busca = null,
  destaque = null,
  ordenarPor = 'criado_em',
  pagina = 1,
  limite = 15,
} = {}) {
  return noticiaRepo.listar({
    tenant_id: tenantId,
    status: status || null,
    categoriaId,
    busca,
    destaque,
    ordenarPor,
    pagina,
    limite,
  });
}

export async function obterNoticiaPorSlug(slug, { tenantId = null, apenasPublicada = true } = {}) {
  if (!slug) throw new AppError('Slug da notícia não informado.', 400);

  const noticia = await noticiaRepo.buscarPorSlug(slug, {
    tenant_id: tenantId,
    apenasPublicada,
  });

  if (!noticia) {
    throw new AppError('Notícia não encontrada ou ainda não publicada.', 404);
  }

  // Busca notícias relacionadas e navegação vizinha
  const [relacionadas, vizinhos] = await Promise.all([
    noticiaRepo.listarRelacionadas({
      categoriaId: noticia.categoria_id,
      excetoId: noticia.id,
      limite: 3,
      tenant_id: tenantId,
    }),
    noticiaRepo.buscarVizinhos(noticia, { tenant_id: tenantId }),
  ]);

  return {
    ...noticia,
    relacionadas,
    anterior: vizinhos.anterior,
    proxima: vizinhos.proxima,
  };
}

export async function obterNoticiaPorId(id, { tenantId = null } = {}) {
  if (!id) throw new AppError('ID da notícia não fornecido.', 400);

  const noticia = await noticiaRepo.buscarPorId(id, { tenant_id: tenantId });
  if (!noticia) {
    throw new AppError('Notícia não encontrada.', 404);
  }
  return noticia;
}

export async function criarNoticia({
  titulo,
  slug = null,
  subtitulo = null,
  resumo = null,
  conteudo,
  imagemCapa = null,
  categoriaId = null,
  autorId = null,
  autorNome = null,
  status = 'rascunho',
  destaque = false,
  publicadoEm = null,
  tenantId = null,
}) {
  const tituloFormatado = titulo ? String(titulo).trim() : '';
  if (!tituloFormatado || tituloFormatado.length < 3) {
    throw new AppError('O título da notícia é obrigatório e deve ter no mínimo 3 caracteres.', 400);
  }

  if (!conteudo || !String(conteudo).trim()) {
    throw new AppError('O conteúdo da notícia é obrigatório.', 400);
  }

  const statusFormatado = String(status || 'rascunho').toLowerCase().trim();
  if (!STATUS_VALIDOS.includes(statusFormatado)) {
    throw new AppError(`Status inválido. Valores aceitos: ${STATUS_VALIDOS.join(', ')}.`, 400);
  }

  // Gera e valida o slug
  let slugBase = slug ? gerarSlug(slug) : gerarSlug(tituloFormatado);
  if (!slugBase) {
    slugBase = `noticia-${Date.now()}`;
  }

  // Garante unicidade do slug dentro do tenant
  let slugFinal = slugBase;
  let contador = 1;
  while (await noticiaRepo.buscarPorSlug(slugFinal, { tenant_id: tenantId, apenasPublicada: false })) {
    slugFinal = `${slugBase}-${contador}`;
    contador++;
  }

  // Validação de categoria, se informada
  if (categoriaId) {
    const cat = await categoriaRepo.buscarPorId(categoriaId, { tenant_id: tenantId });
    if (!cat) throw new AppError('Categoria informada não existe.', 400);
  }

  // Sanitização rigorosa contra XSS
  const conteudoSanitizado = sanitizarHtml(conteudo);

  // Upload da imagem de capa, se for arquivo
  let urlImagemCapa = null;
  if (imagemCapa) {
    urlImagemCapa = await salvarArquivo(imagemCapa, 'noticias');
  }

  // Resumo automático se não fornecido
  const resumoFinal = resumo ? String(resumo).trim() : extrairResumoDeHtml(conteudoSanitizado);

  // Regras de publicação
  let dataPublicacao = publicadoEm ? new Date(publicadoEm) : null;
  if (statusFormatado === 'publicada' && !dataPublicacao) {
    dataPublicacao = new Date();
  }

  return noticiaRepo.inserir(
    {
      titulo: tituloFormatado,
      slug: slugFinal,
      subtitulo: subtitulo ? String(subtitulo).trim() : null,
      resumo: resumoFinal,
      conteudo: conteudoSanitizado,
      imagem_capa: urlImagemCapa,
      categoria_id: categoriaId ? Number(categoriaId) : null,
      autor_id: autorId ? Number(autorId) : null,
      autor_nome: autorNome ? String(autorNome).trim() : null,
      status: statusFormatado,
      destaque: Boolean(destaque),
      publicado_em: dataPublicacao,
    },
    { tenant_id: tenantId }
  );
}

export async function atualizarNoticia(
  id,
  {
    titulo,
    slug,
    subtitulo,
    resumo,
    conteudo,
    imagemCapa,
    categoriaId,
    autorId,
    autorNome,
    status,
    destaque,
    publicadoEm,
    removerImagemCapa = false,
    tenantId = null,
  }
) {
  const noticiaAtual = await obterNoticiaPorId(id, { tenantId });
  const dados = {};

  if (titulo !== undefined) {
    const t = String(titulo).trim();
    if (!t || t.length < 3) throw new AppError('O título da notícia deve ter pelo menos 3 caracteres.', 400);
    dados.titulo = t;
  }

  if (slug !== undefined) {
    const slugFormatado = gerarSlug(slug || dados.titulo || noticiaAtual.titulo);
    if (!slugFormatado) throw new AppError('Slug inválido.', 400);

    if (slugFormatado !== noticiaAtual.slug) {
      const existente = await noticiaRepo.buscarPorSlug(slugFormatado, { tenant_id: tenantId, apenasPublicada: false });
      if (existente && existente.id !== noticiaAtual.id) {
        throw new AppError(`Já existe uma notícia cadastrada com o slug "${slugFormatado}".`, 409);
      }
    }
    dados.slug = slugFormatado;
  }

  if (conteudo !== undefined) {
    if (!String(conteudo).trim()) throw new AppError('O conteúdo da notícia não pode ficar vazio.', 400);
    dados.conteudo = sanitizarHtml(conteudo);
    if (!resumo && !noticiaAtual.resumo) {
      dados.resumo = extrairResumoDeHtml(dados.conteudo);
    }
  }

  if (subtitulo !== undefined) {
    dados.subtitulo = subtitulo ? String(subtitulo).trim() : null;
  }

  if (resumo !== undefined) {
    dados.resumo = resumo ? String(resumo).trim() : extrairResumoDeHtml(dados.conteudo || noticiaAtual.conteudo);
  }

  if (removerImagemCapa) {
    dados.imagem_capa = null;
  } else if (imagemCapa !== undefined) {
    dados.imagem_capa = await salvarArquivo(imagemCapa, 'noticias');
  }

  if (categoriaId !== undefined) {
    if (categoriaId) {
      const cat = await categoriaRepo.buscarPorId(categoriaId, { tenant_id: tenantId });
      if (!cat) throw new AppError('Categoria informada não existe.', 400);
      dados.categoria_id = Number(categoriaId);
    } else {
      dados.categoria_id = null;
    }
  }

  if (autorId !== undefined) dados.autor_id = autorId ? Number(autorId) : null;
  if (autorNome !== undefined) dados.autor_nome = autorNome ? String(autorNome).trim() : null;

  if (status !== undefined) {
    const st = String(status).toLowerCase().trim();
    if (!STATUS_VALIDOS.includes(st)) {
      throw new AppError(`Status inválido. Aceitos: ${STATUS_VALIDOS.join(', ')}.`, 400);
    }
    dados.status = st;

    // Se estiver publicando agora e não tinha data anterior
    if (st === 'publicada' && !noticiaAtual.publicado_em && !publicadoEm) {
      dados.publicado_em = new Date();
    }
  }

  if (destaque !== undefined) {
    dados.destaque = Boolean(destaque);
  }

  if (publicadoEm !== undefined) {
    dados.publicado_em = publicadoEm ? new Date(publicadoEm) : null;
  }

  return noticiaRepo.atualizar(id, dados, { tenant_id: tenantId });
}

export async function publicarNoticia(id, { tenantId = null } = {}) {
  const noticia = await obterNoticiaPorId(id, { tenantId });
  const dataPub = noticia.publicado_em || new Date();

  return noticiaRepo.atualizar(
    id,
    { status: 'publicada', publicado_em: dataPub },
    { tenant_id: tenantId }
  );
}

export async function despublicarNoticia(id, { tenantId = null } = {}) {
  await obterNoticiaPorId(id, { tenantId });
  return noticiaRepo.atualizar(
    id,
    { status: 'rascunho' },
    { tenant_id: tenantId }
  );
}

export async function duplicarNoticia(id, { tenantId = null } = {}) {
  const original = await obterNoticiaPorId(id, { tenantId });

  const novoTitulo = `${original.titulo} (Cópia)`;
  let novoSlugBase = `${original.slug}-copia`;
  let novoSlug = novoSlugBase;
  let contador = 1;

  while (await noticiaRepo.buscarPorSlug(novoSlug, { tenant_id: tenantId, apenasPublicada: false })) {
    novoSlug = `${novoSlugBase}-${contador}`;
    contador++;
  }

  return noticiaRepo.inserir(
    {
      titulo: novoTitulo,
      slug: novoSlug,
      subtitulo: original.subtitulo,
      resumo: original.resumo,
      conteudo: original.conteudo,
      imagem_capa: original.imagem_capa,
      categoria_id: original.categoria_id,
      autor_id: original.autor_id,
      autor_nome: original.autor_nome,
      status: 'rascunho',
      destaque: false,
      publicado_em: null,
    },
    { tenant_id: tenantId }
  );
}

export async function deletarNoticia(id, { tenantId = null } = {}) {
  await obterNoticiaPorId(id, { tenantId });
  return noticiaRepo.deletar(id, { tenant_id: tenantId });
}
