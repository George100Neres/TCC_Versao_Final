import { uuid, pgTable, varchar, timestamp, text } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const CategoriaModel = pgTable(
  'categoria',
  {
    id: uuid('id')
      .default(sql`gen_random_uuid()`)
      .primaryKey(),

    nome: varchar('nome', { length: 100 }).notNull(),

    descricao: text('descricao'),

    createdAt: timestamp('created_at')
      .defaultNow()
      .notNull(),

    updatedAt: timestamp('updated_at')
      .defaultNow(),
  },
  (table) => [
    sql`UNIQUE (${table.nome})`,
  ]
)
