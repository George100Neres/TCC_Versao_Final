import { ReclamacaoRepository } from '@/app/(reclamacao)/(model)/(repository)/usuario-repository'
import { NextResponse } from 'next/server'

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const repo = new ReclamacaoRepository()
    const reclamacao = await repo.findById(id)
    if (!reclamacao) {
      return NextResponse.json(
        { error: 'Reclamação não encontrada' },
        { status: 404 }
      )
    }

    await repo.delete(id)

    return NextResponse.json(
      { message: 'Reclamação removida com sucesso' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Erro ao deletar reclamação:', error)
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
