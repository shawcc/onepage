import React, { createContext, useContext, useEffect, useState } from 'react'
import { MAGIC_CODES } from '../data/magicCodes'

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

const AUTH_STORAGE_KEY = 'onepage_magic_auth'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MagicUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check local storage for existing session
    const storedCode = localStorage.getItem(AUTH_STORAGE_KEY)
    if (storedCode) {
      // @ts-ignore
      const config = MAGIC_CODES[storedCode]
      if (config) {
        setUser({ ...config, code: storedCode })
      }
    }
    setLoading(false)
  }, [])

  const signIn = (code: string) => {
    // @ts-ignore
    const config = MAGIC_CODES[code]
    if (config) {
      const userObj = { ...config, code }
      setUser(userObj)
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
