/**
 * services/comprovante.service.js
 * Camada de serviço e regras de negócio para Comprovantes de Dízimo.
 * 
 * Responsabilidade: Validação de regras de negócio, orquestração de upload
 * e integração com repositórios. Totalmente agnóstico a HTTP/Next.js.
 */
import { AppError } from '@/lib/errors';
import { salvarArquivo } from '@/lib/storage';
import * as comprovanteRepo from '@/repositories/comprovante.repository';

export async function criarComprovante({
  nome,
  telefone = null,
  foto = null,
  observacao = null,
  tenantId = null,
}) {
  const nomeFormatado = nome ? String(nome).trim() : '';
  if (!nomeFormatado) {
    throw new AppError('O campo nome é obrigatório.', 400);
  }

  if (!foto || (typeof foto === 'object' && 'size' in foto && foto.size === 0)) {
    throw new AppError('O anexo do comprovante é obrigatório.', 400);
  }

  // Realiza upload da imagem via storage provider
  const fotoUrl = await salvarArquivo(foto, 'comprovantes');

  const id = await comprovanteRepo.inserir({
    nome: nomeFormatado,
    telefone: telefone ? String(telefone).trim() : null,
    foto_url: fotoUrl,
    observacao: observacao ? String(observacao).trim() : null,
    tenant_id: tenantId,
  });

  return { sucesso: true, id: id.toString() };
}

export async function listarComprovantes({ tenantId = null } = {}) {
  return comprovanteRepo.listar({ tenant_id: tenantId });
}

export async function obterComprovante(id, { tenantId = null } = {}) {
  if (!id) {
    throw new AppError('ID do comprovante não fornecido.', 400);
  }

  const comprovante = await comprovanteRepo.buscarPorId(id, { tenant_id: tenantId });
  if (!comprovante) {
    throw new AppError('Comprovante não encontrado.', 404);
  }

  return comprovante;
}

export async function atualizarStatusComprovante({ id, status, tenantId = null }) {
  if (!id || !status) {
    throw new AppError('Faltam dados obrigatórios (id e status).', 400);
  }

  const statusValidos = ['pendente', 'valido', 'invalido'];
  if (!statusValidos.includes(status)) {
    throw new AppError(`Status inválido. Valores aceitos: ${statusValidos.join(', ')}.`, 400);
  }

  // Garante que o comprovante existe e pertence estritamente ao tenant ativo
  await obterComprovante(id, { tenantId });

  await comprovanteRepo.atualizarStatus(id, status, { tenant_id: tenantId });
  return { success: true };
}

export async function deletarComprovante(id, { tenantId = null } = {}) {
  if (!id) {
    throw new AppError('ID do comprovante não fornecido.', 400);
  }

  // Garante que o comprovante existe e pertence estritamente ao tenant ativo
  await obterComprovante(id, { tenantId });

  await comprovanteRepo.deletar(id, { tenant_id: tenantId });
  return { success: true };
}
