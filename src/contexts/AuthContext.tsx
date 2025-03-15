'use client'

import React, { createContext, useContext, ReactNode } from 'react'

interface AuthContextType {
  user: any | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = React.useState(true)
  const [user, setUser] = React.useState<any | null>(null)

  React.useEffect(() => {
    // Ici, nous ajouterons plus tard la logique d'authentification
    setLoading(false)
  }, [])

  const value = {
    user,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 