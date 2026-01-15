 'use client'

import { useRouter } from 'next/navigation'
import { Form, FormInput, FormSelect } from '@/shared/components/form'
import { CreateUsuarioDTO, usuarioBaseSchema } from '@/app/(usuarios)/(model)/(schema)/usuario.schema'
import { UsuarioHttp } from '@/app/(usuarios)/(controller)/http/usuarioHttp'

export default function SignUpView() {
  const router = useRouter()


  return (
    <div className="min-h-screen bg-[#00a86b]/50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6 items-stretch">
        <div className="bg-[#00a86b] p-6 md:p-8 rounded-lg shadow-lg w-full md:w-1/2 flex flex-col justify-center text-white">
          <h1 className="text-center md:text-left text-xl md:text-2xl font-bold mt-2 md:mt-4">Junte-se ao Lixo Zero SSA</h1>
          <p className="text-center md:text-left mt-3 md:mt-4 text-sm md:text-base">Crie uma conta para registrar e acompanhar reclamações na sua região.</p>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full md:w-1/2 flex flex-col justify-center items-center">
          <div className="w-full text-left">
            <h1 className="text-2xl font-bold text-center text-emerald-700">Criar conta</h1>
            <p className="text-center text-sm text-emerald-700 mt-1">Preencha os dados para criar sua conta</p>

            <Form<CreateUsuarioDTO>
              schema={usuarioBaseSchema}
              onSubmit={async (data) => {
                try {
                  // const resp = await UsuarioHttp.create(data)
                  // const body = await resp.json()
                  const resp = await UsuarioHttp.create(data)
                  console.log(resp)
                  // redirect to sign-in
                  router.push('/sign-in')
                } catch (err: any) {
                  // optionally show notification (notify is available globally in form component)
                  console.error(err)
                }
              }}
            >
              <FormInput name="nome" label="Nome completo" placeholder="Seu nome" />
              <FormInput name="email" label="E-mail" type="email" placeholder="seu@email.com" />
              <FormInput name="senha" label="Senha" type="password" placeholder="••••••••" />
              <FormInput name="telefone" label="Telefone" placeholder="(71) 9xxxx-xxxx" />
              <FormInput name="cidade" label="Cidade" placeholder="Cidade" />
              <FormSelect name="perfil" label="Perfil" options={[{ value: 'cidadao', label: 'Cidadao' }, { value: 'gestor', label: 'Gestor' }]} />

              <div className="flex gap-2 items-center">
                <div className="flex-1" />
                <button type="submit" className="ml-auto bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition">
                  Criar conta
                </button>
              </div>
            </Form>

            <div className="mt-6 text-center">
              <button className="text-emerald-700 font-medium hover:underline cursor-pointer" onClick={() => router.push('/sign-in')}>Já tenho conta</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
