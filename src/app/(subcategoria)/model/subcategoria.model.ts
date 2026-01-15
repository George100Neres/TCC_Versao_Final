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
