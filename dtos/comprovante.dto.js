import { z } from 'zod';
import { optionalString } from './helper';

/**
 * DTO para Envio de Comprovante de Dízimo/Doação.
 */
export const CriarComprovanteDTO = z.object({
  nome: z
    .string({ required_error: 'O nome é obrigatório.' })
    .trim()
    .min(2, 'O nome deve ter no mínimo 2 caracteres.')
    .max(150, 'O nome não pode exceder 150 caracteres.'),
  telefone: optionalString,
  observacao: optionalString,
  tenant_id: optionalString,
});

/**
 * DTO para Atualização de Status do Comprovante (Admin).
 */
export const AtualizarStatusComprovanteDTO = z.object({
  status: z.enum(['pendente', 'valido', 'invalido'], {
    errorMap: () => ({ message: 'Status aceito: pendente, valido ou invalido.' }),
  }),
});
