import drizzleDb from '@/database/drizzle'
import { eq } from 'drizzle-orm'
import { SubcategoriaModel } from '@/app/(subcategoria)/model/subcategoria.model'
import { v4 as uuid } from 'uuid'

class SubcategoriaEntity {
  constructor(
    public readonly id: string,
    public categoriaId: string,
    public nome: string,
    public descricao: string | null,
    public createdAt: Date,
    public updatedAt: Date | null
  ) {}
}

export class SubcategoriaRepository {
  toEntity(row: any): SubcategoriaEntity {
    row.id = row.id ? row.id : uuid()
    return new SubcategoriaEntity(
      row.id,
      row.categoriaId,
      row.nome,
      row.descricao,
      row.createdAt,
      row.updatedAt
    )
  }

  async create(entity: SubcategoriaEntity): Promise<void> {
    await drizzleDb.insert(SubcategoriaModel).values({
      id: entity.id,
      categoriaId: entity.categoriaId,
      nome: entity.nome,
      descricao: entity.descricao
    })
  }

  async findById(id: string): Promise<SubcategoriaEntity | null> {
    const [row] = await drizzleDb
      .select()
      .from(SubcategoriaModel)
      .where(eq(SubcategoriaModel.id, id))
      .limit(1)

    return row ? this.toEntity(row) : null
  }

  async delete(id: string): Promise<void> {
    await drizzleDb.delete(SubcategoriaModel).where(eq(SubcategoriaModel.id, id))
  }

  async search(): Promise<SubcategoriaEntity[]> {
    const rows = await drizzleDb.select().from(SubcategoriaModel)
    return rows.map(this.toEntity)
  }

  async update(id: string, patch: Partial<SubcategoriaEntity>): Promise<void> {
    await drizzleDb
      .update(SubcategoriaModel)
      .set(patch as any)
      .where(eq(SubcategoriaModel.id, id))
  }
}
