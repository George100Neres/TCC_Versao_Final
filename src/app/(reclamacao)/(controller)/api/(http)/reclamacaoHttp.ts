import { CreateReclamacaoDTO, TReclamacaoDTO } from '@/app/(reclamacao)/(model)/(schema)/reclamacao.schema'

const create = async (data: CreateReclamacaoDTO): Promise<TReclamacaoDTO> => {
  // envio o token em cookies
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1')
  const response = await fetch('/api/reclamacao/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Erro ao criar reclamação')
  }

  const createdReclamacao: TReclamacaoDTO = await response.json()
  return createdReclamacao
}

const search = async (): Promise<TReclamacaoDTO[]> => {
  // envio o token em cookies
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1')
  const response = await fetch('/api/reclamacao/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  })

  if (!response.ok) {
    throw new Error('Erro ao buscar reclamações')
  }

  const reclamacoes: TReclamacaoDTO[] = await response.json()
  return reclamacoes
}

const findById = async (id: string): Promise<TReclamacaoDTO> => {
  const response = await fetch(`/api/reclamacao/findById/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Erro ao buscar reclamação por ID')
  }

  const reclamacao: TReclamacaoDTO = await response.json()
  return reclamacao
}

const update = async (id: string, data: Partial<CreateReclamacaoDTO>): Promise<void> => {
  // envio o token em cookies
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1')
  const response = await fetch(`/api/reclamacao/update/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Erro ao atualizar reclamação')
  }
}

const remove = async (id: string): Promise<void> => {
  // envio o token em cookies
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1')
  const response = await fetch(`/api/reclamacao/delete/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  })

  if (!response.ok) {
    throw new Error('Erro ao deletar reclamação')
  }
}

export const ReclamacaoHttp = {
  create,
  search,
  findById,
  update,
  remove,
}
