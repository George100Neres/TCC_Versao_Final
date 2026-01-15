import { ReclamacaoRepository } from '@/app/(reclamacao)/(model)/(repository)/usuario-repository'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const repo = new ReclamacaoRepository()
    const reclamacao = await repo.findById(id)
    if (!reclamacao) return NextResponse.json({ message: 'Not found' }, { status: 404 })
    return NextResponse.json(reclamacao)
  } catch (err: any) {
    return NextResponse.json({ message: err?.message || 'Erro no servidor' }, { status: 500 })
  }
}
