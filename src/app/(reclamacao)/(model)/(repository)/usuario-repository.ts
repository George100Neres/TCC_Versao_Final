import drizzleDb from '@/database/drizzle'
import { eq } from 'drizzle-orm'
import { ReclamacaoModel } from '../reclamacao.model'
import { v4 as uuid } from 'uuid'

class ReclamacaoEntity {
  constructor(
    public readonly id: string,
    public usuarioId: string,
    public descricao: string,
    public latitude: number,
    public longitude: number,
    public endereco: string,
    public cidade: string,
    public estado: string,
    public cep: string,
    public bairro: string,
    public numero: string,
    public createdAt: Date,
    public updatedAt: Date,
    public situacao: string
  ) {}
}

export class ReclamacaoRepository {
  toEntity(row: any): ReclamacaoEntity {
    row.id = row.id ? row.id : uuid()
    return new ReclamacaoEntity(
      row.id,
      row.usuarioId,
      row.descricao,
      Number(row.latitude),
      Number(row.longitude),
      row.endereco,
      row.cidade,
      row.estado,
      row.cep,
      row.bairro,
      row.numero,
      row.createdAt,
      row.updatedAt,
      row.situacao
    )
  }

  async create(entity: ReclamacaoEntity): Promise<void> {
    await drizzleDb.insert(ReclamacaoModel).values({
      id: entity.id,
      usuarioId: entity.usuarioId,
      descricao: entity.descricao,
      latitude: entity.latitude.toString(),
      longitude: entity.longitude.toString(),
      endereco: entity.endereco,
      cidade: entity.cidade,
      estado: entity.estado,
      cep: entity.cep,
      bairro: entity.bairro,
      numero: entity.numero
    })
  }

  async findById(id: string): Promise<ReclamacaoEntity | null> {
    const [row] = await drizzleDb
      .select()
      .from(ReclamacaoModel)
      .where(eq(ReclamacaoModel.id, id))
      .limit(1)

    return row ? this.toEntity(row) : null
  }

  async findByUsuario(usuarioId: string): Promise<ReclamacaoEntity[]> {
    const rows = await drizzleDb
      .select()
      .from(ReclamacaoModel)
      .where(eq(ReclamacaoModel.usuarioId, usuarioId))

    return rows.map(this.toEntity)
  }

  async delete(id: string): Promise<void> {
    await drizzleDb.delete(ReclamacaoModel).where(eq(ReclamacaoModel.id, id))
  }

  async search(): Promise<ReclamacaoEntity[]> {
    const rows = await drizzleDb.select().from(ReclamacaoModel)
    return rows.map(this.toEntity)
  }

  async update(id: string, patch: Partial<ReclamacaoEntity>): Promise<void> {
    await drizzleDb
      .update(ReclamacaoModel)
      .set(patch as any)
      .where(eq(ReclamacaoModel.id, id))
  }
}
