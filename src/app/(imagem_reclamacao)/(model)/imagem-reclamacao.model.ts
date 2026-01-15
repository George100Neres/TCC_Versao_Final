import { uuid, pgTable, varchar, timestamp, customType } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { ReclamacaoModel } from '@/app/(reclamacao)/(model)/reclamacao.model'

// Define tipo customizado para bytea
const bytea = customType<{ data: Buffer; notNull: false; default: false }>({
  dataType() {
    return 'bytea'
  },
})

export const ImagemReclamacaoModel = pgTable('imagem_reclamacao', {
  id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
  nomeArquivo: varchar('nome_arquivo', { length: 250 }).notNull(),
  tipoArquivo: varchar('tipo_arquivo', { length: 40 }).notNull(),
  arquivo: bytea('arquivo').notNull(),
  reclamacaoId: uuid('reclamacao_id').notNull().references(() => ReclamacaoModel.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade'
  }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Tipo TypeScript inferido do modelo
export type ImagemReclamacao = typeof ImagemReclamacaoModel.$inferSelect
export type NewImagemReclamacao = typeof ImagemReclamacaoModel.$inferInsert
