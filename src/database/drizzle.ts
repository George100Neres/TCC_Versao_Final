import 'dotenv/config'
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import { UsuarioModel } from '@/app/(usuarios)/(model)/usuario.model'
import { ReclamacaoModel } from '@/app/(reclamacao)/(model)/reclamacao.model'

dotenvExpand.expand(dotenv.config())
const pool = new Pool({ connectionString: process.env.DB_URL })
const drizzleDb = drizzle(pool, {
  schema: {
    usuario: UsuarioModel,
    reclamacao: ReclamacaoModel,
  },
})

export default drizzleDb
