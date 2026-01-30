import React, { createContext, useContext, useEffect, useState } from 'react'

// Define a simple User type for Magic Code auth
export interface MagicUser {
  id: string
  code: string
  role: 'user' | 'admin'
}

interface AuthContextType {
  user: MagicUser | null
  loading: boolean
  signIn: (code: string) => boolean
  signOut: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: () => false,
  signOut: () => {},
})

// Hardcoded Magic Codes (In a real app, this could be fetched from a secure JSON file or API)
const MAGIC_CODES: Record<string, MagicUser> = {
  'onepage2024': { id: '1', code: 'onepage2024', role: 'user' },
  'admin888': { id: '2', code: 'admin888', role: 'admin' },
  'demo': { id: '3', code: 'demo', role: 'user' }
}

const AUTH_STORAGE_KEY = 'onepage_magic_auth'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MagicUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check local storage for existing session
    const storedCode = localStorage.getItem(AUTH_STORAGE_KEY)
    if (storedCode && MAGIC_CODES[storedCode]) {
      setUser(MAGIC_CODES[storedCode])
    }
    setLoading(false)
  }, [])

  const signIn = (code: string) => {
    const validUser = MAGIC_CODES[code]
    if (validUser) {
      setUser(validUser)
      localStorage.setItem(AUTH_STORAGE_KEY, code)
      return true
    }
    return false
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
