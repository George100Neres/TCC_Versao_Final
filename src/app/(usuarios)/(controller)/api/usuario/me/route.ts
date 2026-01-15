import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const tokenCookie = cookieStore.get('token')

    if (!tokenCookie) {
      return NextResponse.json({ ok: false, message: 'Token não encontrado' }, { status: 401 })
    }

    const tokenValue = decodeURIComponent(tokenCookie.value)
    const jwtSecret = process.env.JWT_SECRET || 'dev-secret'
    const secretKey = new TextEncoder().encode(jwtSecret)

    try {
      const { payload } = await jwtVerify(tokenValue, secretKey)

      return NextResponse.json({
        ok: true,
        user: {
          id: payload.id,
          email: payload.email,
          nome: payload.nome
        }
      })
    } catch {
      return NextResponse.json({ ok: false, message: 'Token inválido' }, { status: 401 })
    }
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message || 'Erro no servidor' }, { status: 500 })
  }
}
