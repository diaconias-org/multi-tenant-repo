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
  if (file.size > 10 * 1024 * 1024) {
    throw new AppError('A imagem não pode ultrapassar 10MB.', 400);
  }

  const nomeLimpo = (file.name || 'arquivo.jpg').replace(/[^a-zA-Z0-9.-]/g, '_');
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
