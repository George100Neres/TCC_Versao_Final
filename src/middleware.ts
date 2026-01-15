import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { routes } from './routes'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const publicPaths = Object.values(routes).filter((route) => route.public).map((route) => route.path)
  if (publicPaths.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next()
  }

  const tokenCookie = req.cookies?.get?.('token')?.value
  if (!tokenCookie) {
    const url = req.nextUrl.clone()
    url.pathname = '/sign-in'
    return NextResponse.redirect(url)
  }

  // decode cookie value (we stored it with encodeURIComponent when setting)
  let tokenValue: string
  try {
    tokenValue = decodeURIComponent(tokenCookie)
  } catch {
    tokenValue = tokenCookie
  }

  // verify JWT using jose (Edge-compatible)
  const jwtSecret = process.env.JWT_SECRET || 'dev-secret'
  const secretKey = new TextEncoder().encode(jwtSecret)
  try {
    const { payload } = await jwtVerify(tokenValue, secretKey)
    // optional: log user id (sub) to help debugging in dev
    if (payload && payload.sub) {
      // console.log('Authenticated user id (from token.sub):', payload.sub)
    }
  } catch (err: any) {
    console.error('JWT verification failed', err?.message || err)
    const url = req.nextUrl.clone()
    url.pathname = '/sign-in'
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
