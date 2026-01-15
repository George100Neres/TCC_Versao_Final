 'use client'
import { useUser } from '@/shared/context/UserProvider'
import { useRouter } from 'next/navigation'
import { notify } from '@/shared/components/notify'

export default function Header() {
  const usuarioData = useUser()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      // Remove token cookie accessible to JS
      document.cookie = 'token=; Path=/; Max-Age=0'
      notify({ message: 'Deslogado com sucesso', type: 'success' })
      router.push('/sign-in')
    } catch (err: any) {
      notify({ message: err?.message || 'Erro ao deslogar', type: 'error' })
    }
  }
  return (
    <header className="flex justify-center w-full h-16 items-center">
      <div className="bg-primary max-w-[1440px] w-full p-4 flex justify-center">
        <div className="w-full flex justify-between">
          <div className="font-medium text-[20px]">
            {usuarioData.userName}

          </div>
          <div className="font-medium text-[20px] flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="bg-white text-black px-3 py-1 rounded-md hover:opacity-90"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
