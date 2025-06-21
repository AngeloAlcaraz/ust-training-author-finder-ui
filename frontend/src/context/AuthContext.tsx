import React, { createContext, useState, useEffect, useCallback } from 'react'

interface User {
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (userData: User) => void
  logout: () => void
  isAuthenticated: boolean
  loading: boolean  // nuevo
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true) // Estado para inicialización

  const isTokenValid = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000 > Date.now()
    } catch {
      return false
    }
  }

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const token = localStorage.getItem('accessToken')

    if (storedUser && token && isTokenValid(token)) {
      setUser(JSON.parse(storedUser))
    } else {
      localStorage.removeItem('user')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setUser(null)
    }
    setLoading(false) // Terminó la carga inicial
  }, [])

  const login = useCallback((userData: User) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }, [])

  const isAuthenticated = !!user

  const contextValue = React.useMemo(
    () => ({ user, login, logout, isAuthenticated, loading }),
    [user, login, logout, isAuthenticated, loading]
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export default AuthContext
