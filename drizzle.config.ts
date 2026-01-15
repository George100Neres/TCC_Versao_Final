import type { Config } from 'drizzle-kit'
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
dotenvExpand.expand(dotenv.config())

const url = process.env.DB_URL
if (!url) {
  throw new Error('DB_URL is not defined in environment variables')
}
const config = {
  dialect: 'postgresql',
  schema: './src/models/**/{*.ts,*.js}',
  out: './src/database/migrations',
  dbCredentials: {
    url,
  },
} satisfies Config

export default config

