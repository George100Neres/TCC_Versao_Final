import { uuid, pgTable, varchar, timestamp, numeric, text } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const ReclamacaoModel = pgTable('reclamacao', {
  id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
  usuarioId: uuid('usuario_id').notNull(),
  descricao: text('descricao').notNull(),
  latitude: numeric('latitude', { precision: 10, scale: 8 }).notNull(),
  longitude: numeric('longitude', { precision: 11, scale: 8 }).notNull(),
  endereco: text('endereco').notNull(),
  cidade: varchar('cidade', { length: 100 }).notNull(),
  estado: varchar('estado', { length: 2 }).notNull(),
  cep: varchar('cep', { length: 10 }).notNull(),
  bairro: varchar('bairro', { length: 100 }).notNull(),
  numero: varchar('numero', { length: 10 }).notNull(),
  situacao: varchar('situacao', { length: 30 }).default(sql`'aberta'`).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
