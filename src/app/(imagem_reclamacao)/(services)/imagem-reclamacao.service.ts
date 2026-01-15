// import { CreateImagemReclamacaoDTO } from '../(schema)/imagem-reclamacao.schema'
import drizzleDb from '@/database/drizzle'
import { ImagemReclamacaoModel } from '../(model)/imagem-reclamacao.model'
import { eq } from 'drizzle-orm'

export class ImagemReclamacaoService {
  // Criar nova imagem para reclamação
  static async create(data: any) {
    try {
      const inserted = await drizzleDb
        .insert(ImagemReclamacaoModel)
        .values(data)
        .returning()

      return { ok: true, data: inserted[0] }
    } catch (err: any) {
      console.error('Erro ao criar imagem de reclamação:', err)
      throw new Error(err.message || 'Erro ao salvar imagem')
    }
  }

  // Buscar imagens por ID da reclamação
  static async findByReclamacaoId(reclamacaoId: string) {
    try {
      const imagens = await drizzleDb
        .select({
          id: ImagemReclamacaoModel.id,
          nomeArquivo: ImagemReclamacaoModel.nomeArquivo,
          tipoArquivo: ImagemReclamacaoModel.tipoArquivo,
          reclamacaoId: ImagemReclamacaoModel.reclamacaoId,
          createdAt: ImagemReclamacaoModel.createdAt,
        })
        .from(ImagemReclamacaoModel)
        .where(eq(ImagemReclamacaoModel.reclamacaoId, reclamacaoId))
        .orderBy(ImagemReclamacaoModel.createdAt)

      return { ok: true, data: imagens }
    } catch (err: any) {
      console.error('Erro ao buscar imagens da reclamação:', err)
      throw new Error(err.message || 'Erro ao buscar imagens')
    }
  }

  // Buscar imagem completa (incluindo arquivo) por ID
  static async findById(id: string) {
    try {
      const imagem = await drizzleDb
        .select()
        .from(ImagemReclamacaoModel)
        .where(eq(ImagemReclamacaoModel.id, id))
        .limit(1)

      if (imagem.length === 0) {
        throw new Error('Imagem não encontrada')
      }

      return { ok: true, data: imagem[0] }
    } catch (err: any) {
      console.error('Erro ao buscar imagem por ID:', err)
      throw new Error(err.message || 'Erro ao buscar imagem')
    }
  }

  // Deletar imagem por ID
  static async delete(id: string) {
    try {
      const deleted = await drizzleDb
        .delete(ImagemReclamacaoModel)
        .where(eq(ImagemReclamacaoModel.id, id))
        .returning({ id: ImagemReclamacaoModel.id })

      if (deleted.length === 0) {
        throw new Error('Imagem não encontrada')
      }

      return { ok: true, data: deleted[0] }
    } catch (err: any) {
      console.error('Erro ao deletar imagem:', err)
      throw new Error(err.message || 'Erro ao deletar imagem')
    }
  }

  // Converter File para Buffer (utilitário)
  static async fileToBuffer(file: File): Promise<Buffer> {
    const arrayBuffer = await file.arrayBuffer()
    return Buffer.from(arrayBuffer)
  }
}
