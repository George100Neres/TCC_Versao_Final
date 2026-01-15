import { ReclamacaoRepository } from '@/app/(reclamacao)/(model)/(repository)/usuario-repository'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
      // const token = req.headers.get('Authorization')?.split(' ')[1]

      const data = await req.json()
      const reclamacaoRepository = new ReclamacaoRepository()
      const reclamacao = await reclamacaoRepository.toEntity(data)
      await reclamacaoRepository.create(reclamacao)
      return NextResponse.json(reclamacao)
    } catch (err: any) {
      return NextResponse.json(err.message || 'Erro no servidor', { status: 500 })
    }
}
