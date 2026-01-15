 'use client'
import { Form, FormInput } from '@/shared/components/form'
import { useRouter } from 'next/navigation'
import { notify } from '@/shared/components/notify'
import { UsuarioSignInDTO, usuarioSignInSchema } from '@/app/(usuarios)/(model)/(schema)/usuario.schema'
import { UsuarioHttp } from '@/app/(usuarios)/(controller)/http'
import { routes } from '@/routes'

export default function SignInView() {
  const router = useRouter()

  const onSubmit = async (data: UsuarioSignInDTO) => {
    try {
      // call API route which will set an HttpOnly cookie with the JWT
      const resp = await UsuarioHttp.signIn(data)
      const body = await resp.json()

      if (!resp.ok) {
        throw new Error(body?.message || 'Erro ao fazer login')
      }

      // cookie HttpOnly com o id do usuário foi setado pelo servidor
      router.push(routes.reclamacaoList.path)
    } catch (error: any) {
      console.warn('Erro ao fazer login:', error)
      notify({
        message: error.message || 'Erro ao fazer login',
        duration: 5000,
        type: 'error'
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#00a86b]/50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6 items-stretch">
        {/* Card esquerdo */}
        <div className="bg-[#00a86b] p-6 md:p-8 rounded-lg shadow-lg w-full md:w-1/2 flex flex-col justify-center text-white">
          <h1 className="text-center md:text-left text-xl md:text-2xl font-bold mt-2 md:mt-4">
            Bem-vindo ao Lixo Zero SSA!
          </h1>
          <p className="text-center md:text-left mt-3 md:mt-4 text-sm md:text-base">
            Participe da transformação de Salvador em uma cidade mais limpa e
            sustentável. Entre para registrar e acompanhar suas reclamações.
          </p>
        </div>

        {/* Card direito */}
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full md:w-1/2 flex flex-col justify-center items-center">
          <div className="w-full text-left">
        {/* Header */}
        <h1 className="text-2xl font-bold text-center text-emerald-700">Entrar</h1>
        <p className="text-center text-sm text-emerald-700 mt-1">
          Sua cidade mais limpa começa aqui
        </p>
        {/* Form */}
        <Form<UsuarioSignInDTO> schema={usuarioSignInSchema} onSubmit={onSubmit}>
          <FormInput name="email" label="E-mail" type="email" placeholder="seu@email.com" />
          <FormInput name="senha" label="Senha" type="password" placeholder="••••••••" />

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition"
          >
            Entrar
          </button>
        </Form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <button className="text-emerald-700 font-medium hover:underline cursor-pointer" onClick={() => router.push('/sign-up')}>
            Criar conta
          </button>
        </div>
          </div>
        </div>
      </div>
    </div>
  )
}
