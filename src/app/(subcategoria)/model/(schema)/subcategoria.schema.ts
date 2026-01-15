/*
import { uuid, pgTable, varchar, timestamp, text } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { CategoriaModel } from '@/app/(categoria)/model/categoria.model'

export const SubcategoriaModel = pgTable(
  'subcategoria',
  {
    id: uuid('id')
      .default(sql`gen_random_uuid()`)
      .primaryKey(),

    categoriaId: uuid('categoria_id')
      .notNull()
      .references(() => CategoriaModel.id, {
        onDelete: 'cascade',
      }),

    nome: varchar('nome', { length: 150 }).notNull(),

    descricao: text('descricao'),

    createdAt: timestamp('created_at')
      .defaultNow()
      .notNull(),

    updatedAt: timestamp('updated_at')
      .defaultNow(),
  }
)


exemplo de schema:
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


crie os schema para categoria.model.ts acima
 */
import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { CategoriaModel } from '@/app/(categoria)/model/categoria.model'
export const CategoriaSchemaBase = z.object({
  id: z.uuid().optional(),
  nome: z.string().min(1, 'O nome é obrigatório').max(100, 'O nome deve ter no máximo 100 caracteres'),
  descricao: z.string().max(500, 'A descrição deve ter no máximo 500 caracteres').optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})
export const CategoriaSchema = CategoriaSchemaBase.omit({ id: true, createdAt: true, updatedAt: true })
export const updateCategoriaDTO = CategoriaSchemaBase.partial()
export const categoriaDTO = createSelectSchema(CategoriaModel)
export type CreateCategoriaDTO = z.infer<typeof CategoriaSchema>
export type UpdateCategoriaDTO = z.infer<typeof updateCategoriaDTO>
export type TCategoriaDTO = z.infer<typeof categoriaDTO>
