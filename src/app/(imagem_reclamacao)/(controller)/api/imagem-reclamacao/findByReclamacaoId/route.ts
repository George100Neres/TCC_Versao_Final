import { ImagemReclamacaoRepository } from '@/app/(imagem_reclamacao)/(model)/(repository)/imagem-reclamacao.repository'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({
        error: 'ID é obrigatório'
      }, { status: 400 })
    }

    const imagemReclamacaoRepository = new ImagemReclamacaoRepository()
    const imagemReclamacao = await imagemReclamacaoRepository.findByReclamacaoId(id)

    if (!imagemReclamacao) {
      return NextResponse.json({
        error: 'Imagem da reclamação não encontrada'
      }, { status: 404 })
    }

    return NextResponse.json(imagemReclamacao, { status: 200 })

  } catch (error: any) {
    console.error('Erro ao buscar imagem da reclamação:', error)
    return NextResponse.json({
      error: error.message || 'Erro interno do servidor'
    }, { status: 500 })
  }
}
