import { z } from 'zod';
import { booleanCoerce, optionalString, optionalInt, queryInt, queryEnum } from './helper';

const statusEnum = z.preprocess(
  (val) => (typeof val === 'string' ? val.trim().toLowerCase() : val),
  z.enum(['rascunho', 'agendada', 'publicada', 'arquivada'], {
    errorMap: () => ({ message: 'Status deve ser rascunho, agendada, publicada ou arquivada.' }),
  })
);

const dataOpcional = z.preprocess((val) => {
  if (!val || val === '' || val === 'null') return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? val : d;
}, z.date({ invalid_type_error: 'Data inválida.' }).nullable().optional());

/**
 * DTO para Criação de Notícia.
 * Valida formatos, tipos, limites de caracteres e coercões estruturais.
 */
export const CriarNoticiaDTO = z.object({
  titulo: z
    .string({ required_error: 'O título é obrigatório.' })
    .trim()
    .min(3, 'O título deve ter no mínimo 3 caracteres.')
    .max(255, 'O título não pode exceder 255 caracteres.'),
  slug: optionalString,
  subtitulo: optionalString,
  resumo: optionalString,
  conteudo: z
    .string({ required_error: 'O conteúdo da notícia é obrigatório.' })
    .trim()
    .min(1, 'O conteúdo da notícia não pode ficar vazio.'),
  categoriaId: optionalInt,
  autorNome: optionalString,
  autorId: optionalInt,
  status: statusEnum.default('rascunho'),
  destaque: booleanCoerce.default(false),
  publicadoEm: dataOpcional,
  imagemCapa: z.any().optional().nullable(),
});

/**
 * DTO para Atualização de Notícia.
 * Todos os campos são opcionais, permitindo atualizações parciais.
 */
export const AtualizarNoticiaDTO = z.object({
  titulo: z
    .string()
    .trim()
    .min(3, 'O título deve ter no mínimo 3 caracteres.')
    .max(255, 'O título não pode exceder 255 caracteres.')
    .optional(),
  slug: optionalString,
  subtitulo: optionalString,
  resumo: optionalString,
  conteudo: z
    .string()
    .trim()
    .min(1, 'O conteúdo da notícia não pode ficar vazio.')
    .optional(),
  categoriaId: optionalInt,
  autorNome: optionalString,
  autorId: optionalInt,
  status: statusEnum.optional(),
  destaque: booleanCoerce.optional(),
  publicadoEm: dataOpcional,
  imagemCapa: z.any().optional().nullable(),
  removerImagemCapa: booleanCoerce.optional().default(false),
});

/**
 * DTO para validação de Query Params da Listagem Pública de Notícias.
 */
export const ListarNoticiasPublicasQueryDTO = z.object({
  categoria: optionalString,
  busca: optionalString,
  destaque: z
    .preprocess((v) => {
      if (v === 'true' || v === '1') return true;
      if (v === 'false' || v === '0') return false;
      return undefined;
    }, z.boolean().optional())
    .optional(),
  ordenarPor: queryEnum(['recente', 'antiga', 'titulo'], 'recente'),
  pagina: queryInt(1),
  limite: queryInt(10, 100),
});

/**
 * DTO para validação de Query Params da Listagem Administrativa.
 */
export const ListarNoticiasAdminQueryDTO = z.object({
  status: z
    .preprocess(
      (v) => (typeof v === 'string' && v.trim().toLowerCase() === 'todos' ? null : v),
      z.string().nullable().optional()
    ),
  categoriaId: optionalInt,
  busca: optionalString,
  destaque: z
    .preprocess((v) => {
      if (v === 'true' || v === '1') return true;
      if (v === 'false' || v === '0') return false;
      return undefined;
    }, z.boolean().optional())
    .optional(),
  ordenarPor: queryEnum(['criado_em', 'publicado_em', 'titulo'], 'criado_em'),
  pagina: queryInt(1),
  limite: queryInt(15, 100),
});

