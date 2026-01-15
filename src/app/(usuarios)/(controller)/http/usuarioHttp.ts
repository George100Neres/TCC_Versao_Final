import { CreateUsuarioDTO, UsuarioDTO } from '@/app/(usuarios)/(model)/(schema)/usuario.schema'

const create = async (data: CreateUsuarioDTO): Promise<UsuarioDTO> => {
  // envio o token em cookies
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1')
  const response = await fetch('/api/usuario/sign-up', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Erro ao criar usuário')
  }

  const createdUsuario: UsuarioDTO = await response.json()
  return createdUsuario
}


export const UsuarioHttp = {
  create,
}
