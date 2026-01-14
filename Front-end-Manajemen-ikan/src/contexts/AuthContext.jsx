import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        return {
          success: false,
          error: data.error || 'Email atau password salah'
        }
      }

      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
      // Simpan token sederhana (id user) untuk dipakai di header Authorization
      if (data.token) {
        localStorage.setItem('token', data.token)
      }

      return {
        success: true,
        user: data.user
      }
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        error: 'Gagal terhubung ke server'
      }
    }
  }

  // default register role becomes 'petugas' (staff)
  const register = async (name, email, password, role = 'petugas') => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, role })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        return {
          success: false,
          error: data.message || 'Gagal membuat akun'
        }
      }

      // Auto login setelah register berhasil
      const loginResult = await login(email, password)
      return loginResult
    } catch (error) {
      console.error('Register error:', error)
      return {
        success: false,
        error: 'Gagal terhubung ke server'
      }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  const isAdmin = () => user?.role === 'admin'
  // worker area can be accessed by admin and 'petugas' (staff)
  const isWorker = () =>
    user?.role === 'admin' ||
    user?.role === 'petugas'

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading, isAdmin, isWorker }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
