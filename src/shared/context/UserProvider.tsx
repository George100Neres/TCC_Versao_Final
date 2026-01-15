 'use client'

import React, { createContext, useContext } from 'react'
import { useUserData } from '@/shared/hook/UserData'

interface UserContextValue {
  userId: string | null
  userEmail: string | null
  userName: string | null
  userPerfil: string | null
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useUserData()

  const value: UserContextValue = {
    userId: user?.id || null,
    userEmail: user?.email || null,
    userName: user?.nome || null,
    userPerfil: user?.perfil || null,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = (): UserContextValue => {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within a UserProvider')
  return ctx
}

export default UserProvider
