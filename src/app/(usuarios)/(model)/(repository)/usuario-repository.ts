import drizzleDb from '@/database/drizzle'
import { eq } from 'drizzle-orm'
import { UsuarioModel } from '../usuario.model'
import { v4 as uuid } from 'uuid'

class UsuarioEntity {
  constructor(
    public readonly id: string,
    public nome: string,
    public telefone: string,
    public email: string,
    public senha: string,
    public cep?: string,
    public endereco?: string,
    public numero?: string,
    public complemento?: string,
    public bairro?: string,
    public cidade?: string,
    public estado?: string,
    public perfil?: string,
    public dataCriacao?: Date,
    public dataAtualizacao?: Date
  ) {}
}

export class UsuarioRepository {
  toEntity(row: any): UsuarioEntity {
    row.id = row.id ? row.id : uuid()
    return new UsuarioEntity(
      row.id,
      row.nome,
      row.telefone,
      row.email,
      row.senha,
      row.cep,
      row.endereco,
      row.numero,
      row.complemento,
      row.bairro,
      row.cidade,
      row.estado,
      row.perfil,
      row.dataCriacao,
      row.dataAtualizacao
    )
  }

  async create(entity: UsuarioEntity): Promise<void> {
    await drizzleDb.insert(UsuarioModel).values({
      id: entity.id,
      nome: entity.nome,
      telefone: entity.telefone,
      email: entity.email,
      senha: entity.senha,
      cep: entity.cep,
      endereco: entity.endereco,
      numero: entity.numero,
      complemento: entity.complemento,
      bairro: entity.bairro,
      cidade: entity.cidade,
      estado: entity.estado,
      perfil: entity.perfil,
    })
  }

  async findById(id: string): Promise<UsuarioEntity | null> {
    const [row] = await drizzleDb
      .select()
      .from(UsuarioModel)
      .where(eq(UsuarioModel.id, id))
      .limit(1)

    return row ? this.toEntity(row) : null
  }

  async findByEmail(email: string): Promise<UsuarioEntity | null> {
    const [row] = await drizzleDb
      .select()
      .from(UsuarioModel)
      .where(eq(UsuarioModel.email, email))
      .limit(1)

    return row ? this.toEntity(row) : null
  }

  async findAll(): Promise<UsuarioEntity[]> {
    const rows = await drizzleDb.select().from(UsuarioModel)
    return rows.map((r) => this.toEntity(r))
  }

  async delete(id: string): Promise<void> {
    await drizzleDb.delete(UsuarioModel).where(eq(UsuarioModel.id, id))
  }
}
