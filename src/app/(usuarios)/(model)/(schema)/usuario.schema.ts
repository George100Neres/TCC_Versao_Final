import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { UsuarioModel } from '../usuario.model'

export const usuarioBaseSchema = createInsertSchema(UsuarioModel, {
  nome: z.string().min(3, 'Nome muito curto').max(100, 'Nome muito longo'),
  telefone: z.string().min(8, 'Telefone inválido').max(15, 'Telefone inválido'),
  email: z.email('E-mail inválido'),
  senha: z.string().min(6, 'Senha muito curta').max(255),

  // optional address fields
  cep: z.string().optional(),
  endereco: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().min(2).max(100).optional(),
  estado: z.string().length(2).optional(),
  perfil: z.enum(['gestor', 'cidadao']),
})

export const updateUsuarioDTO = usuarioBaseSchema.partial()
export const usuarioDTO = createSelectSchema(UsuarioModel)

export type CreateUsuarioDTO = z.infer<typeof usuarioBaseSchema>
export type UpdateUsuarioDTO = z.infer<typeof updateUsuarioDTO>
export type UsuarioDTO = z.infer<typeof usuarioDTO>


export const usuarioSignInSchema = z.object({
  email: z.email('E-mail inválido'),
  senha: z.string().min(1, 'senha é obrigatória'),
})
export type UsuarioSignInDTO = z.infer<typeof usuarioSignInSchema>

export const usuarioSignUpSchema = usuarioBaseSchema
  .pick({ nome: true, email: true, senha: true, telefone: true, cidade: true, perfil: true })
  .extend({ senha: z.string().min(6), confirmSenha: z.string().min(6) })
  .refine((data) => data.senha === data.confirmSenha, {
    message: 'As senhas precisam ser iguais',
    path: ['confirmSenha'],
  })

export type UsuarioSignUpDTO = z.infer<typeof usuarioSignUpSchema>
