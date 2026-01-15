import { NextResponse } from 'next/server'
import { signInService } from './services'

export async function POST(req: Request) {
    try {
        const data = await req.json()
        const user = await signInService(data)

        if (!user.ok) return NextResponse.json(user, { status: 401 })

        // if we have a token from the service, set it as a cookie (accessible via JS for frontend use)
        if (user.token) {
            const maxAge = 60 * 60 * 24 * 7 // 7 days
            const isProd = process.env.NODE_ENV === 'production'
            // Removido HttpOnly para permitir acesso via JavaScript no frontend
            const cookie = `token=${encodeURIComponent(user.token)}; Path=/; SameSite=Lax; Max-Age=${maxAge}${isProd ? '; Secure' : ''}`
            return NextResponse.json(user, { status: 200, headers: { 'Set-Cookie': cookie } })
        }

        return NextResponse.json(user)
    } catch (err: any) {
        return NextResponse.json({ ok: false, message: err?.message || 'Erro no servidor' }, { status: 500 })
    }
}
