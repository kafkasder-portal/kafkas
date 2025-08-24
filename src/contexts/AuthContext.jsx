import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check for existing user on mount
  useEffect(() => {
    const checkExistingUser = async () => {
      try {
        const fallbackUser = localStorage.getItem('fallbackUser')
        if (fallbackUser) {
          const userData = JSON.parse(fallbackUser)
          setUser(userData)
          setIsAuthenticated(true)
        }
        setLoading(false)
      } catch (error) {
        console.error('Auth initialization error:', error)
        setLoading(false)
      }
    }

    checkExistingUser()
  }, [])

  const login = async (email, password) => {
    try {
      // Simple authentication for development
      const userData = {
        id: 'user-' + Date.now(),
        email: email,
        name: email.split('@')[0],
        role: 'admin',
        permissions: ['read', 'write', 'admin'],
      }
      
      setUser(userData)
      setIsAuthenticated(true)
      localStorage.setItem('fallbackUser', JSON.stringify(userData))
      toast.success('Başarıyla giriş yapıldı!')
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Giriş yapılırken hata oluştu')
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem('fallbackUser')
      toast.success('Başarıyla çıkış yapıldı')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Çıkış yapılırken hata oluştu')
    }
  }

  const updateUser = async (userData) => {
    try {
      if (user?.id) {
        const updatedUser = { ...user, ...userData }
        setUser(updatedUser)
        localStorage.setItem('fallbackUser', JSON.stringify(updatedUser))
        toast.success('Kullanıcı bilgileri güncellendi')
      }
    } catch (error) {
      console.error('Update user error:', error)
      toast.error('Kullanıcı bilgileri güncellenirken hata oluştu')
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
