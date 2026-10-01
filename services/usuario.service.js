/**
 * services/usuario.service.js
 * Camada de serviço e regras de negócio para Usuários Administrativos.
 */
import bcrypt from 'bcryptjs';
import { AppError } from '@/lib/errors';
import * as usuarioRepo from '@/repositories/usuario.repository';

export async function autenticarUsuario({ email, senha }) {
  if (!email || !senha) {
    return null;
  }

  const emailFormatado = String(email).trim().toLowerCase();
  const usuario = await usuarioRepo.buscarPorEmail(emailFormatado);
  if (!usuario) {
    return null;
  }

  const senhaValida = await bcrypt.compare(String(senha), usuario.senha_hash);
  if (!senhaValida) {
    return null;
  }

  return {
    id: String(usuario.id),
    name: usuario.nome,
    email: usuario.email,
    tenant_id: usuario.tenant_id,
  };
}

export async function buscarUsuarioPorEmail(email) {
  if (!email) return null;
  return usuarioRepo.buscarPorEmail(String(email).trim().toLowerCase());
}

export async function listarUsuarios() {
  return usuarioRepo.listar();
}

export async function criarUsuario({ nome, email, senha, tenantId = null }) {
  const nomeFormatado = nome ? String(nome).trim() : '';
  const emailFormatado = email ? String(email).trim().toLowerCase() : '';

  if (!nomeFormatado) {
    throw new AppError('Nome é obrigatório.', 400);
  }
  if (!emailFormatado) {
    throw new AppError('Email é obrigatório.', 400);
  }
  if (!senha || senha.length < 6) {
    throw new AppError('A senha deve ter pelo menos 6 caracteres.', 400);
  }

  const existente = await usuarioRepo.buscarPorEmail(emailFormatado);
  if (existente) {
    throw new AppError('Já existe um usuário cadastrado com este e-mail.', 409);
  }

  const hash = await bcrypt.hash(senha, 12);
  const id = await usuarioRepo.inserir({
    nome: nomeFormatado,
    email: emailFormatado,
    senha_hash: hash,
    tenant_id: tenantId,
  });

  return { id: id.toString(), nome: nomeFormatado, email: emailFormatado };
}
