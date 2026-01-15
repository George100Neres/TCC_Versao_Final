'use server'

import { UsuarioSignInDTO } from '@/app/(usuarios)/(model)/(schema)/usuario.schema'
import drizzleDb from '@/database/drizzle'
import { eq } from 'drizzle-orm/sql/expressions/conditions'
import { SignJWT } from 'jose'
import { UsuarioModel } from '@/app/(usuarios)/(model)/usuario.model'


export async function signInService(data: UsuarioSignInDTO):Promise<any>
{
  const columns = {
    id: true,
    nome: true,
    email: true,
    senha: true,
    perfil: true,
  }
  const user = await drizzleDb.query.usuario.findFirst({
    columns,
    where: eq(UsuarioModel.email, data.email),
  })

  if (!user) return { ok: false, message: 'Credenciais inválidas' }

  const userRow = user as { id: string; nome: string; email: string; senha: string; perfil: string }

  // const match = await bcrypt.compare(data.senha, userRow.senha)
  const match = data.senha === userRow.senha
  if (!match) return { ok: false, message: 'Credenciais inválidas' }

  const secret = process.env.JWT_SECRET || 'dev-secret'
  const encoder = new TextEncoder()
  const secretKey = encoder.encode(secret)
  const token = await new SignJWT({
    id: userRow.id,
    email: userRow.email,
    nome: userRow.nome,
    perfil: userRow.perfil,
   })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey)

  return { ok: true, token, user: { id: userRow.id, nome: userRow.nome, perfil: userRow.perfil } }
}
