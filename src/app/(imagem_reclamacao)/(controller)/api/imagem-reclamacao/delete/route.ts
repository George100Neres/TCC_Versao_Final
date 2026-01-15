import { ImagemReclamacaoRepository } from '@/app/(imagem_reclamacao)/(model)/(repository)/imagem-reclamacao.repository'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID é obrigatório' },
        { status: 400 }
      )
    }

    const repo = new ImagemReclamacaoRepository()
    const imagem = await repo.findById(id)

    if (!imagem) {
      return NextResponse.json(
        { error: 'Imagem da reclamação não encontrada' },
        { status: 404 }
      )
    }

    await repo.delete(id)

    return NextResponse.json(
      { message: 'Imagem removida com sucesso' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Erro ao deletar imagem da reclamação:', error)
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
