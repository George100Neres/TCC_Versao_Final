import React from 'react'
import EditClient from './EditClient'
import { ReclamacaoRepository } from '@/app/(reclamacao)/(model)/(repository)/usuario-repository'
import { TReclamacaoDTO } from '@/app/(reclamacao)/(model)/(schema)/reclamacao.schema'

type Props = { params: Promise<{ id: string }> }
export default async function ReclamacaorEdit({ params }: Props) {
  // params is a Promise in newer Next.js versions for client components; unwrap with React.use()
  const { id } = await params
  const repo = new ReclamacaoRepository()
  const reclamacao = await repo.findById(id) as TReclamacaoDTO
  return <EditClient id={id} lat={reclamacao.latitude} lng={reclamacao.longitude} />
}
