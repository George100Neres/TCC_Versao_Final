import { UsuarioRepository } from '@/app/(usuarios)/(model)/(repository)/usuario-repository'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const usuarioRepository = new UsuarioRepository()
    const usuarioEntity = await usuarioRepository.toEntity(data)
    await usuarioRepository.create(usuarioEntity)
    return NextResponse.json('sssss')
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message || 'Erro no servidor' }, { status: 500 })
  }
}
