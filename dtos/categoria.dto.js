import { z } from 'zod';
import { booleanCoerce, optionalString } from './helper';

/**
 * DTO para Criação de Categoria.
 */
export const CriarCategoriaDTO = z.object({
  nome: z
    .string({ required_error: 'O nome da categoria é obrigatório.' })
    .trim()
    .min(2, 'O nome deve ter pelo menos 2 caracteres.')
    .max(100, 'O nome não pode exceder 100 caracteres.'),
  slug: optionalString,
  descricao: optionalString,
  ativo: booleanCoerce.default(true),
});

/**
 * DTO para Atualização de Categoria.
 */
export const AtualizarCategoriaDTO = z.object({
  nome: z
    .string()
    .trim()
    .min(2, 'O nome deve ter pelo menos 2 caracteres.')
    .max(100, 'O nome não pode exceder 100 caracteres.')
    .optional(),
  slug: optionalString,
  descricao: optionalString,
  ativo: booleanCoerce.optional(),
});
