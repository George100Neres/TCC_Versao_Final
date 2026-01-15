'use client'
import { useEffect, useState } from 'react'

interface UserData {
  id: string
  email: string
  nome: string
  perfil: string
  iat?: number
  exp?: number
}

export const useUserData = (): UserData | null => {
  const [userData, setUserData] = useState<UserData | null>(null)

  const loadUserData = async () => {
    try {
      // Primeira tentativa: buscar o token nos cookies (se não for HttpOnly)
      let foundToken = false

      if (typeof document !== 'undefined') {
        const cookies = document.cookie.split('; ')

        for (const cookie of cookies) {
          const [name, value] = cookie.split('=')
          if (name === 'token' && value) {
            foundToken = true
            try {
              // Decodifica o token se necessário
              const tokenValue = decodeURIComponent(value)

              // Separa as partes do JWT (header.payload.signature)
              const tokenParts = tokenValue.split('.')
              if (tokenParts.length === 3) {
                // Adiciona padding se necessário para Base64
                let payload = tokenParts[1]
                while (payload.length % 4) {
                  payload += '='
                }

                // Decodifica o payload (segunda parte)
                const decodedPayload = JSON.parse(atob(payload))
                if (decodedPayload.id) {
                  setUserData(decodedPayload)
                  return // Sucesso via cookie
                }
              } else {
                console.error('Token JWT inválido - não tem 3 partes')
              }
            } catch (tokenError) {
              console.error('Erro ao decodificar token do cookie:', tokenError)
            }
            break
          }
        }
      }

      // Se não encontrou token nos cookies, tenta buscar via API (HttpOnly)
      if (!foundToken) {
        try {
          const response = await fetch('/api/usuario/me', {
            method: 'GET',
            credentials: 'include', // Importante para enviar cookies HttpOnly
            headers: {
              'Content-Type': 'application/json'
            }
          })

          if (response.ok) {
            const apiResult = await response.json()
            if (apiResult.ok && apiResult.user) {
              setUserData(apiResult.user)
              return // Sucesso via API
            }
          }
        } catch (apiError) {
          console.error('Erro na requisição da API:', apiError)
        }
      }

      // Se chegou até aqui, não conseguiu autenticar
      if (!foundToken) {
        // console.error('Nenhum token de autenticação encontrado')
      }

    } catch (generalError) {
      console.error('Erro geral ao carregar dados do usuário:', generalError)
    }
  }

  // Carrega dados quando o hook é inicializado
  useEffect(() => {
    loadUserData()
  }, [])

  return userData
}
