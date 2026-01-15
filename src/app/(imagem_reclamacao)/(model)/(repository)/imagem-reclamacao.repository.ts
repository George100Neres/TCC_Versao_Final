import drizzleDb from '@/database/drizzle'
import { eq } from 'drizzle-orm'
import { ImagemReclamacaoModel, type ImagemReclamacao, type NewImagemReclamacao } from '../imagem-reclamacao.model'

export class ImagemReclamacaoRepository {
	toEntity(row: ImagemReclamacao): ImagemReclamacao {
		return {
			...row,
		}
	}

	async create(entity: NewImagemReclamacao): Promise<void> {
		await drizzleDb.insert(ImagemReclamacaoModel).values(entity)
	}

	async findById(id: string): Promise<ImagemReclamacao | null> {
		const [row] = await drizzleDb
			.select()
			.from(ImagemReclamacaoModel)
			.where(eq(ImagemReclamacaoModel.id, id))
			.limit(1)

		return row ? this.toEntity(row) : null
	}


	async delete(id: string): Promise<void> {
		await drizzleDb.delete(ImagemReclamacaoModel).where(eq(ImagemReclamacaoModel.id, id))
	}

  async findByReclamacaoId(reclamacaoId: string): Promise<ImagemReclamacao[]> {
    const rows = await drizzleDb
      .select()
      .from(ImagemReclamacaoModel)
      .where(eq(ImagemReclamacaoModel.reclamacaoId, reclamacaoId))

    return rows.map((row) => this.toEntity(row))
  }

  async deleteByReclamacaoId(reclamacaoId: string): Promise<void> {
    await drizzleDb
      .delete(ImagemReclamacaoModel)
      .where(eq(ImagemReclamacaoModel.reclamacaoId, reclamacaoId))
  }
}

