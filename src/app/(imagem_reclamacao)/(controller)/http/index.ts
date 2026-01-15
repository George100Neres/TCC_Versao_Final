async function create(reclamacaoId: string, files: File[]) {
  if (!reclamacaoId) throw new Error('reclamacaoId é obrigatório')
  if (!files || files.length === 0) throw new Error('Pelo menos um arquivo é obrigatório')

  const formData = new FormData()
  formData.append('reclamacaoId', reclamacaoId)
  for (const file of files) {
    formData.append('imagens', file)
  }

  const res = await fetch('/api/imagem-reclamacao/create', {
    method: 'POST',
    body: formData,
  })

  const json = await res.json()
  if (!res.ok) {
    const err = new Error(json?.error || 'Erro ao enviar imagens')
    // attach details for caller
    ;(err as any).details = json
    throw err
  }

  return json
}

const findByReclamacaoId = async (id: string) => {
  if (!id) throw new Error('ID é obrigatório')

  const res = await fetch(`/api/imagem-reclamacao/findByReclamacaoId?id=${encodeURIComponent(id)}`, {
    method: 'GET',
  })

  const json = await res.json()
  if (!res.ok) {
    const err = new Error(json?.error || 'Erro ao buscar imagem da reclamação');
    (err as any).details = json
    throw err
  }

  return json
}

const delele = async (id: string) => {
  if (!id) throw new Error('ID é obrigatório')

  const res = await fetch(`/api/imagem-reclamacao/delete?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })

  const json = await res.json()
  if (!res.ok) {
    const err = new Error(json?.error || 'Erro ao deletar imagem da reclamação');
    (err as any).details = json
    throw err
  }

  return json
}

export const imagemReclamacaoHttp = {
  create,
  findByReclamacaoId,
  delele,
}
