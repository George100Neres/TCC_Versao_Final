import { ReclamacaoRepository } from '@/app/(reclamacao)/(model)/(repository)/usuario-repository'
import { NextResponse } from 'next/server'

export async function PUT( req: Request, { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const data = await req.json()
    const repo = new ReclamacaoRepository()
    await repo.update(id, data)
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || 'Erro no servidor' },
      { status: 500 }
    )
  }
}
