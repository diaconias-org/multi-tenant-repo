import { z } from 'zod';
import { ValidationError } from '@/lib/errors';

/**
 * Coerção inteligente de booleanos compatível com JSON e FormData.
 * Trata 'true', 'false', '1', '0' de forma segura (ao contrário de Boolean('false') que dá true).
 */
export const booleanCoerce = z.preprocess((val) => {
  if (typeof val === 'string') {
    const s = val.trim().toLowerCase();
    if (s === 'true' || s === '1') return true;
    if (s === 'false' || s === '0' || s === '') return false;
  }
  if (typeof val === 'boolean') return val;
  return false;
}, z.boolean());

/**
 * Preprocessador para strings opcionais:
 * - Trima espaços em branco
 * - Converte string vazia "" em null
 */
export const optionalString = z.preprocess((val) => {
  if (val === null || val === undefined) return null;
  if (typeof val === 'string') {
    const trimmed = val.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  return String(val).trim();
}, z.string().nullable().optional());

/**
 * Preprocessador para inteiros positivos opcionais (IDs de foreign keys):
 * - Trata "", null e undefined como null
 * - Converte strings numéricas em inteiros
 */
export const optionalInt = z.preprocess((val) => {
  if (val === '' || val === null || val === undefined) return null;
  const num = Number(val);
  return isNaN(num) ? val : Math.trunc(num);
}, z.number({ invalid_type_error: 'Deve ser um número inteiro válido.' }).int().positive().nullable().optional());

/**
 * Preprocessador para inteiros de paginação/query (ex: pagina=1, limite=10).
 * Trata null, undefined e "" aplicando o valor padrão com segurança.
 */
export const queryInt = (padrao = 1, max = 100) =>
  z.preprocess((val) => {
    if (val === null || val === undefined || val === '') return padrao;
    const num = Number(val);
    if (isNaN(num) || num <= 0) return padrao;
    return Math.min(Math.trunc(num), max);
  }, z.number().int().positive().default(padrao));

/**
 * Preprocessador para enums vindos de query params (ex: ?ordenarPor=recente).
 * Trata null, undefined e "" aplicando o valor padrão com segurança.
 */
export const queryEnum = (valores, padrao) =>
  z.preprocess((val) => {
    if (val === null || val === undefined || val === '') return padrao;
    return typeof val === 'string' ? val.trim() : val;
  }, z.enum(valores).default(padrao));

/**
 * Executa a validação de um schema Zod (DTO).
 * Se os dados forem válidos, retorna os dados tipados, higienizados e transformados.
 * Se houver erro, lança uma `ValidationError` contendo o mapa de erros por campo.
 *
 * @param {import('zod').ZodSchema} schema - Schema Zod a ser validado
 * @param {any} dados - Objeto ou dados de entrada (JSON ou FormData)
 * @returns {any} Dados validados e higienizados
 * @throws {ValidationError} Quando os dados não atendem ao schema
 */
export function validarDTO(schema, dados) {
  const resultado = schema.safeParse(dados);

  if (!resultado.success) {
    const fieldErrors = resultado.error.flatten().fieldErrors;
    // Captura a primeira mensagem legível para o cabeçalho do erro
    const primeiraMensagem =
      Object.values(fieldErrors).flat()[0] ||
      resultado.error.errors[0]?.message ||
      'Dados de entrada inválidos.';

    throw new ValidationError(primeiraMensagem, fieldErrors);
  }

  return resultado.data;
}
