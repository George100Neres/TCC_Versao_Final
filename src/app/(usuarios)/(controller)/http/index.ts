import { UsuarioSignInDTO, CreateUsuarioDTO } from '@/app/(usuarios)/(model)/(schema)/usuario.schema'

const signIn = async (data: UsuarioSignInDTO) => {
  return await fetch('/api/usuario/sign-in', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

const create = async (data: CreateUsuarioDTO) => {
  return await fetch('/api/usuario', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export const UsuarioHttp = {
  signIn,
  create,
}
