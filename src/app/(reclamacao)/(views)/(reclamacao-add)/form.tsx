import { useUser } from '@/shared/context/UserProvider'
import { useForm } from 'react-hook-form'
import { CreateReclamacaoDTO, ReclamacaoSchema } from '../../(model)/(schema)/reclamacao.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState, useRef } from 'react'
import { notify } from '@/shared/components/notify'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ReclamacaoHttp } from '../../(controller)/api/(http)/reclamacaoHttp'
import { imagemReclamacaoHttp } from '@/app/(imagem_reclamacao)/(controller)/http'



export function FormComponent(props: { emit: (data:any) => void }) {
  const { userId } = useUser()
  const router = useRouter()
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { emit } = props

  const form = useForm<CreateReclamacaoDTO>({
    resolver: zodResolver(ReclamacaoSchema),
    defaultValues: {
      descricao: 'Buraco na via pública causando risco aos pedestres',
      cep: '40020-000',
      endereco: 'Avenida Sete de Setembro',
      bairro: 'Campo Grande',
      cidade: 'Salvador',
      estado: 'BA',
      numero: '100',
      latitude: -12.963308366330674,   // Salvador, BA
      longitude: -38.500841214385076,  // Salvador, BA
      usuarioId: '' // Será preenchido pelo hook
    }
  })

  const onSubmit = async (data: CreateReclamacaoDTO) => {
    if (!data) return
    try {
      // validar se pelo menos uma imagem foi anexada
      if (!selectedImages || selectedImages.length === 0) {
        form.setError('images' as any, { type: 'manual', message: 'Ao menos uma imagem é obrigatória.' })
        notify({ message: 'Anexe pelo menos uma imagem para criar a reclamação.', type: 'error' })
        return
      }
      const reclamacao = await ReclamacaoHttp.create(data)
      console.log('Reclamação criada:', reclamacao)
      await imagemReclamacaoHttp.create(reclamacao.id, selectedImages)
      router.push('/reclamacao-list')
    } catch (err) {
      console.error('Erro ao salvar reclamação via action:', err)
      notify({message: 'Erro ao salvar reclamação. Tente novamente.', type: 'error' })
    }
  }

  // Função para lidar com a seleção de imagens
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const fileArray = Array.from(files)

    // Validate sizes
    const invalidFiles = fileArray.filter(file => file.size > 5 * 1024 * 1024) // 5MB
    if (invalidFiles.length > 0) {
      notify({message: 'Algumas imagens são maiores que 5MB.', type: 'error'})
      return
    }

    // Append new files to existing, but enforce total limit of 5
    const totalFiles = selectedImages.length + fileArray.length
    if (totalFiles > 5) {
      notify({message: 'Máximo 5 imagens permitidas no total.', type: 'error'})
      return
    }

    const newSelected = [...selectedImages, ...fileArray]
    setSelectedImages(newSelected)

    // Gerar previews para os novos arquivos e concat com os existentes
    const newPreviews = fileArray.map(file => URL.createObjectURL(file))
    setImagePreviews(prev => {
      // keep previous previews, add new ones
      return [...prev, ...newPreviews]
    })

  // (debug removed)
  }

  // Função para remover uma imagem
  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)

    // revoke the removed preview URL
    const removed = imagePreviews[index]
    if (removed) URL.revokeObjectURL(removed)

    setSelectedImages(newImages)
    setImagePreviews(newPreviews)

    // Limpar o input file (se não houver mais imagens)
    if (fileInputRef.current && newImages.length === 0) {
      fileInputRef.current.value = ''
    }
  }

  useEffect(() => {
    if (userId) {
      form.setValue('usuarioId', userId)
    }
  }, [userId, form])

  // cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => {
        try { URL.revokeObjectURL(url) } catch { /* ignore */ }
      })
    }
  }, [imagePreviews])

  const cepWatch = form.watch('cep')
  useEffect(() => {
    async function fetchAddress() {
      const viacep = await fetch(`https://viacep.com.br/ws/${cepWatch}/json/`)
      const data = await viacep.json()
      const address = `${data.logradouro}, ${data.bairro}, ${data.localidade}, ${data.uf}`
      const findCandidates = await fetch(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=${encodeURIComponent(address)}&f=json`)
      if (findCandidates.ok) {
        const candidatesData = await findCandidates.json()
        if (candidatesData.candidates && candidatesData.candidates.length > 0) {
          const location = candidatesData.candidates[0].location
          form.setValue('latitude', location.y)
          form.setValue('longitude', location.x)
          emit({ lat: location.y, lng: location.x })
        }
      }
    }
    // deixe so os numeros
    const cleanedCep = cepWatch.replace(/\D/g, '')
    if (cleanedCep && cleanedCep.length === 8) {
      fetchAddress()
    }
  }, [cepWatch, emit, form])

  return (
    <div className="h-full flex flex-col">
      {/* Header do formulário */}
      <div className="p-6 bg-emerald-600 text-white">
        <span className="text-xl font-bold">Cadastro de Reclamação</span>
      </div>

      {/* Formulário */}
      <div className="flex-1 overflow-auto">
        <form className="p-6 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descrição da Reclamação
            </label>
            <textarea
              {...form.register('descricao')}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 resize-vertical transition-colors"
              rows={3}
              placeholder="Descreva o problema encontrado..."
            />
            {form.formState.errors.descricao && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <span className="mr-1">⚠️</span>
                {form.formState.errors.descricao.message}
              </p>
            )}
          </div>

          {/* CEP e Bairro */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">CEP</label>
              <input
                {...form.register('cep')}
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-colors"
                placeholder="00000-000"
              />
              {form.formState.errors.cep && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {form.formState.errors.cep.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bairro</label>
              <input
                {...form.register('bairro')}
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-colors"
                placeholder="Nome do bairro"
              />
              {form.formState.errors.bairro && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {form.formState.errors.bairro.message}
                </p>
              )}
            </div>
          </div>

          {/* Endereço */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Endereço</label>
            <input
              {...form.register('endereco')}
              type="text"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-colors"
              placeholder="Rua, avenida, praça..."
            />
            {form.formState.errors.endereco && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <span className="mr-1">⚠️</span>
                {form.formState.errors.endereco.message}
              </p>
            )}
          </div>

          {/* Cidade, Estado e Número */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Cidade</label>
              <input
                {...form.register('cidade')}
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-colors"
                placeholder="Cidade"
              />
              {form.formState.errors.cidade && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {form.formState.errors.cidade.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
              <input
                {...form.register('estado')}
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-colors"
                placeholder="BA"
              />
              {form.formState.errors.estado && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {form.formState.errors.estado.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Número</label>
              <input
                {...form.register('numero')}
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-colors"
                placeholder="123"
              />
              {form.formState.errors.numero && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {form.formState.errors.numero.message}
                </p>
              )}
            </div>
          </div>

          {/* Coordenadas */}
          <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <span className="mr-2">📍</span>
              Coordenadas (Preenchidas automaticamente)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Latitude</label>
                <input
                  type="number"
                  {...form.register('latitude', { valueAsNumber: true })}
                  step="0.00000001"
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm focus:outline-none cursor-not-allowed"
                  readOnly
                />
                {form.formState.errors.latitude && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {form.formState.errors.latitude.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Longitude</label>
                <input
                  {...form.register('longitude', { valueAsNumber: true })}
                  type="number"
                  step="0.00000001"
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm focus:outline-none cursor-not-allowed"
                  readOnly
                />
                {form.formState.errors.longitude && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {form.formState.errors.longitude.message}
                  </p>
                )}
              </div>
            </div>

            {/* Upload de Imagens */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <span className="mr-2">📷</span>
                Anexar Imagens (Opcional)
              </h4>

              <div className="space-y-4">
                {/* Área de Upload Estilizada */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center space-y-3"
                  >
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        Clique para selecionar imagens
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, JPEG até 5MB cada • Máximo 5 imagens
                      </p>
                    </div>
                  </label>
                </div>

                {/* Preview das Imagens */}
                {imagePreviews.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700">
                      {imagePreviews.length} imagem(ns) selecionada(s):
                    </p>
                    <div className="flex flex-wrap gap-5">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group w-[250px] h-[200px]">
                          <div className="w-full h-full rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                            <Image
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              width={500}
                              height={500}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-md"
                            title="Remover imagem"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Placeholder quando não há imagens */}
                {imagePreviews.length === 0 && (
                  <div className="text-xs text-gray-500 italic">
                    💡 As imagens selecionadas aparecerão aqui para preview
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-emerald-600 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors font-semibold flex items-center justify-center"
            >
              <span className="mr-2">📤</span>
              Enviar Reclamação
            </button>
            <button
              type="button"
              onClick={() => router.push('/reclamacao-list')}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Volta
            </button>
          </div>

          {/* Erros do formulário */}
          {form.formState.errors && Object.keys(form.formState.errors).length > 0 && (
            <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
              <h3 className="text-red-700 font-bold mb-2 flex items-center">
                <span className="mr-2">🚨</span>
                Erros no formulário:
              </h3>
              <ul className="space-y-1">
                {Object.entries(form.formState.errors).map(([field, error]) => (
                  <li key={field} className="text-red-600 text-sm flex items-center">
                    <span className="mr-2 text-red-400">•</span>
                    <strong className="mr-2">{field}:</strong>
                    {error?.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </form>
      </div>
    </div>
  )
}
