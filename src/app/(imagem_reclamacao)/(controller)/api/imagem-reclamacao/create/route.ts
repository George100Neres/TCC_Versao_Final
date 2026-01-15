import { ImagemReclamacaoRepository } from '@/app/(imagem_reclamacao)/(model)/(repository)/imagem-reclamacao.repository'
import { NextRequest, NextResponse } from 'next/server'

 export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const reclamacaoId = formData.get('reclamacaoId') as string
    const files = formData.getAll('imagens') as File[]
    const imagemReclamacaoRepository = new ImagemReclamacaoRepository()

    if (!reclamacaoId) {
      return NextResponse.json({
        error: 'reclamacaoId é obrigatório'
      }, { status: 400 })
    }

    // delete todos os arquivos que tenham o reclamacaoId antes de inserir os novos
    await imagemReclamacaoRepository.deleteByReclamacaoId(reclamacaoId)

    if (!files || files.length === 0) {
      return NextResponse.json({
        error: 'Pelo menos uma imagem é obrigatória'
      }, { status: 400 })
    }
    const itemsToSave = []

    for (const file of files) {
      if (!(file instanceof File) || file.size === 0) {
        continue
      }

      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const imagemData = {
        nomeArquivo: file.name,
        tipoArquivo: file.type,
        arquivo: buffer,
        reclamacaoId
      }
      itemsToSave.push(imagemReclamacaoRepository.create(imagemData))
    }

    await Promise.all(itemsToSave)

    return NextResponse.json('ok', { status: 201 })

  } catch (error: any) {
    console.error('Erro no upload de imagens:', error)
    return NextResponse.json({
      error: error.message || 'Erro interno do servidor'
    }, { status: 500 })
  }
 }

// export async function POST(request: NextRequest) {
//   try {
//     const formData = await request.formData()
//     const reclamacaoId = formData.get('reclamacaoId') as string
//     const files = formData.getAll('imagens') as File[]

//     if (!reclamacaoId) {
//       return NextResponse.json({
//         ok: false,
//         error: 'reclamacaoId é obrigatório'
//       }, { status: 400 })
//     }

//     if (!files || files.length === 0) {
//       return NextResponse.json({
//         ok: false,
//         error: 'Pelo menos uma imagem é obrigatória'
//       }, { status: 400 })
//     }

//     const results = []

//     for (const file of files) {
//       if (!(file instanceof File) || file.size === 0) {
//         continue
//       }

//       // Validar arquivo usando o schema correto
//       const validation = ImagemReclamacaoUploadSchema.safeParse({
//         reclamacaoId,
//         arquivo: file
//       })

//       if (!validation.success) {
//         return NextResponse.json({
//           ok: false,
//           error: 'Arquivo inválido',
//           details: validation.error.issues
//         }, { status: 400 })
//       }

//       // Converter File para Buffer
//       const arquivo = await ImagemReclamacaoService.fileToBuffer(file)

//       // Criar dados para inserção
//       const imagemData = {
//         reclamacaoId,
//         nomeArquivo: file.name,
//         tipoArquivo: file.type,
//         arquivo
//       }

//       const result = await ImagemReclamacaoService.create(imagemData)
//       results.push(result.data)
//     }

//     return NextResponse.json({
//       ok: true,
//       data: results,
//       message: `${results.length} imagem(ns) salva(s) com sucesso`
//     })

//   } catch (error: any) {
//     console.error('Erro no upload de imagens:', error)
//     return NextResponse.json({
//       ok: false,
//       error: error.message || 'Erro interno do servidor'
//     }, { status: 500 })
//   }
// }

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url)
//     const reclamacaoId = searchParams.get('reclamacaoId')

//     if (!reclamacaoId) {
//       return NextResponse.json({
//         ok: false,
//         error: 'reclamacaoId é obrigatório'
//       }, { status: 400 })
//     }

//     const result = await ImagemReclamacaoService.findByReclamacaoId(reclamacaoId)

//     return NextResponse.json({
//       ok: true,
//       data: result.data
//     })

//   } catch (error: any) {
//     console.error('Erro ao buscar imagens:', error)
//     return NextResponse.json({
//       ok: false,
//       error: error.message || 'Erro interno do servidor'
//     }, { status: 500 })
//   }
// }
