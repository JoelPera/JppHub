import { createContext, useContext, useEffect, useState } from 'react'
import { api, tokenStore, userStore } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => userStore.get())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const hydrate = async () => {
      const token = tokenStore.get()
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const me = await api.me()
        setUser(me)
        userStore.set(me)
      } catch {
        api.logout()
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    hydrate()
  }, [])

  const login = async (email, password) => {
    const d = await api.login(email, password)
    setUser(d.user)
    return d
  }
  const register = async (data) => {
    const d = await api.register(data)
    setUser(d.user)
    return d
  }
  const updateMe = async (data) => {
    const updated = await api.updateProfile(data)
    setUser(updated)
    return updated
  }
  const logout = () => {
    api.logout()
    setUser(null)
  }

  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, updateMe }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
