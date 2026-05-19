'use client'

import { createContext, useContext } from 'react'

type AuthUser = {
  id: string
  email: string | null
  username: string | null
}

type AuthContextValue = {
  user: AuthUser | null
  loading: boolean
}

const AuthContext = createContext<AuthContextValue>({ user: null, loading: false })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <AuthContext.Provider value={{ user: null, loading: false }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
