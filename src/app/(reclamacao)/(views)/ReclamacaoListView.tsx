'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TReclamacaoDTO } from '@/app/(reclamacao)/(model)/(schema)/reclamacao.schema'
import { ReclamacaoHttp } from '@/app/(reclamacao)/(controller)/api/(http)/reclamacaoHttp'
import { routes } from '@/routes'



export default function ReclamacaoListView() {
  const router = useRouter()
  const [reclamacoes, setReclamacoes] = useState<TReclamacaoDTO[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const filteredReclamacoes = reclamacoes.filter(r => {
    if (!query) return true
    const q = query.toLowerCase()
    return (
      (r.endereco && r.endereco.toLowerCase().includes(q)) ||
      (r.bairro && r.bairro.toLowerCase().includes(q)) ||
      (r.cidade && r.cidade.toLowerCase().includes(q)) ||
      (r.descricao && r.descricao.toLowerCase().includes(q))
    )
  })

  useEffect(() => {
    const fetchReclamacoes = async () => {
      try {
        setLoading(true)
        const data = await ReclamacaoHttp.search()
        setReclamacoes(data)
      } catch (err: any) {
        console.error('Erro ao carregar reclamações:', err)
        setError(err?.message || 'Erro ao carregar reclamações')
      } finally {
        setLoading(false)
      }
    }

    fetchReclamacoes()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-lg">Carregando reclamações...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-red-500">Erro: {error}</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reclamações</h1>
          <p className="text-sm text-gray-500">Total: <strong className="text-gray-700">{reclamacoes.length}</strong></p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por endereço, bairro ou cidade..."
            className="px-3 py-2 border rounded w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
          <button
            onClick={() => router.push(routes.reclamacaoAdd.path)}
            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
          >
            Nova Reclamação
          </button>
        </div>
      </div>

      {filteredReclamacoes.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <div className="text-6xl">📭</div>
          <p className="mt-4 text-lg">Nenhuma reclamação encontrada.</p>
          <p className="text-sm text-gray-400">Tente remover filtros ou criar uma nova reclamação.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg ">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Ações</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Descrição</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Endereço</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Bairro</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Cidade</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Data de Criação</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Situação</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReclamacoes.map((r: TReclamacaoDTO) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-center">
                    <div className="inline-flex gap-2">
                      <button onClick={() => router.push(`/reclamacao/${r.id}`)} className="bg-blue-500 text-white rounded px-3 py-1 text-sm hover:bg-blue-600 transition">
                        Editar
                        </button>
                      <button onClick={async () => {
                        try {
                          await ReclamacaoHttp.remove(r.id!)
                          setReclamacoes(prev => prev.filter(x => x.id !== r.id))
                        } catch (err) {
                          console.error('Erro ao deletar', err)
                        }
                      }} className="bg-red-500 text-white rounded px-3 py-1 text-sm hover:bg-red-600 transition">Excluir</button>
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-xs text-sm text-center text-gray-700 line-clamp-2">{r.descricao}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-600">{r.endereco}, {r.numero}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-600">{r.bairro}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-600">{r.cidade}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-500">{new Date(r.createdAt).toLocaleDateString('pt-BR')}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-600">{r.situacao.toUpperCase()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
