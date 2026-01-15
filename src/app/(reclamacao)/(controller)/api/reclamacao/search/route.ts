import { ReclamacaoRepository } from '@/app/(reclamacao)/(model)/(repository)/usuario-repository'
import { NextResponse } from 'next/server'


export async function POST() {
    try {
      const reclamacaoRepository = new ReclamacaoRepository()
      const reclamacoes = await reclamacaoRepository.search()
      return NextResponse.json(reclamacoes)
    } catch (err: any) {
      return NextResponse.json(err.message || 'Erro no servidor', { status: 500 })
    }
}
