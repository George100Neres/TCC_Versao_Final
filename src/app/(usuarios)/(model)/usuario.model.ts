import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'


export const UsuarioModel = pgTable(
  'usuario',
  {
    id: uuid('id')
      .default(sql`gen_random_uuid()`)
      .primaryKey(),

    nome: varchar('nome', { length: 100 }).notNull(),
    telefone: varchar('telefone', { length: 15 }).notNull(),
    email: varchar('email', { length: 100 }).notNull(),
    senha: varchar('senha', { length: 255 }).notNull(),

    cep: varchar('cep', { length: 10 }),
    endereco: varchar('endereco', { length: 255 }),
    numero: varchar('numero', { length: 10 }),
    complemento: varchar('complemento', { length: 100 }),
    bairro: varchar('bairro', { length: 100 }),
    cidade: varchar('cidade', { length: 100 }),
    estado: varchar('estado', { length: 2 }),

  perfil: varchar('perfil', { length: 10 }).default('cidadao').notNull(),

    dataCriacao: timestamp('data_criacao').defaultNow().notNull(),
    dataAtualizacao: timestamp('data_atualizacao').defaultNow(),
  },
  (table) => [
    sql`UNIQUE (${table.email})`,
    sql`CHECK (${table.perfil} IN ('gestor', 'cidadao'))`,
  ]
)
