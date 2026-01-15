import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { ReclamacaoModel } from '../reclamacao.model'

// Create manual schema to ensure correct types for numeric fields
export const ReclamacaoSchemaBase = z.object({
  id: z.uuid().optional(),
  usuarioId: z.uuid().nullish(),
  descricao: z.string().min(10, 'A descrição deve ter ao menos 10 caracteres').max(500, 'A descrição deve ter no máximo 500 caracteres'),
  latitude: z.number().min(-90, 'Latitude deve ser entre -90 e 90').max(90, 'Latitude deve ser entre -90 e 90'),
  longitude: z.number().min(-180, 'Longitude deve ser entre -180 e 180').max(180, 'Longitude deve ser entre -180 e 180'),
  endereco: z.string().min(5, 'O endereço deve ter ao menos 5 caracteres'),
  cidade: z.string().min(2, 'A cidade deve ter ao menos 2 caracteres').max(100, 'A cidade deve ter no máximo 100 caracteres'),
  estado: z.string().length(2, 'O estado deve ter exatamente 2 caracteres'),
  cep: z.string().min(5, 'O CEP deve ter ao menos 5 caracteres').max(10, 'O CEP deve ter no máximo 10 caracteres'),
  bairro: z.string().min(2, 'O bairro deve ter ao menos 2 caracteres').max(100, 'O bairro deve ter no máximo 100 caracteres'),
  numero: z.string().min(1, 'O número deve ter ao menos 1 caractere').max(10, 'O número deve ter no máximo 10 caracteres'),
  situacao: z.enum(['aberta', 'em analise', 'encaminhada', 'resolvido']).default('aberta'),
})

export const ReclamacaoSchema = ReclamacaoSchemaBase.omit({ id: true, situacao: true })


export const updateReclamacaoDTO = ReclamacaoSchemaBase.partial()
export const reclamacaoDTO = createSelectSchema(ReclamacaoModel, {
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
})

export type CreateReclamacaoDTO = z.infer<typeof ReclamacaoSchemaBase>
export type UpdateReclamacaoDTO = z.infer<typeof updateReclamacaoDTO>
export type TReclamacaoDTO = z.infer<typeof reclamacaoDTO>
