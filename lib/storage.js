/**
 * lib/storage.js
 * Camada de abstração de armazenamento de arquivos (Storage Provider).
 *
 * Suporta:
 * 1. Vercel Blob (quando BLOB_READ_WRITE_TOKEN estiver configurado)
 * 2. Base64 (fallback para ambiente serverless/Vercel sem token de blob)
 * 3. Disco local em public/uploads (ambiente de desenvolvimento local)
 */
import { put } from '@vercel/blob';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { AppError } from './errors';

export async function salvarArquivo(file, pasta = 'comprovantes') {
  if (!file) return null;

  // Se já for uma URL ou string, apenas retorna
  if (typeof file === 'string') return file;

  // Validação de tamanho (máximo 10MB)
  const maxBytes = 10 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new AppError('O arquivo não pode ultrapassar 10MB.', 400);
  }

  // Validação de MIME types e extensões permitidas
  const mimesPermitidos = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
  ];

  const extensoesPermitidas = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.pdf'];

  const mimeType = file.type ? file.type.toLowerCase() : '';
  if (mimeType && !mimesPermitidos.includes(mimeType)) {
    throw new AppError('Tipo de arquivo inválido. Permitido apenas imagens (JPG, PNG, WEBP, GIF) ou PDF.', 400);
  }

  const nomeOriginal = file.name || 'arquivo.jpg';
  const ext = nomeOriginal.substring(nomeOriginal.lastIndexOf('.')).toLowerCase();
  if (!extensoesPermitidas.includes(ext)) {
    throw new AppError('Extensão de arquivo não permitida.', 400);
  }

  const nomeBase = nomeOriginal.substring(0, nomeOriginal.lastIndexOf('.')).replace(/[^a-zA-Z0-9_-]/g, '_');
  const nomeLimpo = `${nomeBase}${ext}`;
  const nomeArquivo = `${pasta}/${Date.now()}-${nomeLimpo}`;

  // 1. Vercel Blob (Produção - se configurado)
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(nomeArquivo, file, { access: 'public' });
    return blob.url;
  }

  // Fallback (Buffer)
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // 2. Se estivermos na Vercel (onde /public é read-only), salva como Base64
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    const base64 = buffer.toString('base64');
    const mimeType = file.type || 'image/jpeg';
    return `data:${mimeType};base64,${base64}`;
  }

  // 3. Se estivermos em ambiente local, salva no disco (pasta public/uploads)
  const uploadDir = join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadDir, { recursive: true });

  const fileName = `${Date.now()}-${nomeLimpo}`;
  const filePath = join(uploadDir, fileName);
  await writeFile(filePath, buffer);

  return `/uploads/${fileName}`;
}
