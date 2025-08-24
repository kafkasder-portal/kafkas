import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'
import { supabase, testSupabaseConnection } from '../lib/supabase'

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
  const [supabaseConnected, setSupabaseConnected] = useState(false)

  // Check Supabase connection
  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        const connected = await testSupabaseConnection()
        setSupabaseConnected(connected)
        
        if (!connected) {
          console.warn('Supabase connection failed, using fallback authentication')
        }
      } catch (error) {
        console.error('Supabase connection check failed:', error)
        setSupabaseConnected(false)
      }
    }

    checkSupabaseConnection()
  }, [])

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // If Supabase is not connected, use fallback auth
        if (!supabaseConnected) {
          const fallbackUser = localStorage.getItem('fallbackUser')
          if (fallbackUser) {
            const userData = JSON.parse(fallbackUser)
            setUser(userData)
            setIsAuthenticated(true)
          }
          setLoading(false)
          return
        }

        // Get current session from Supabase
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error('Auth session error:', error)
          setLoading(false)
          return
        }

        if (session?.user) {
          // Create basic user info from session
          const userData = {
            id: session.user.id,
            email: session.user.email,
            name:
              session.user.user_metadata?.full_name ||
              session.user.user_metadata?.name ||
              session.user.email.split('@')[0],
            role: 'admin', // Default to admin for now
            permissions: ['read', 'write', 'admin'],
          }
          setUser(userData)
          setIsAuthenticated(true)
          
          // Store fallback user data
          localStorage.setItem('fallbackUser', JSON.stringify(userData))
        }
      } catch (error) {
        console.error('Auth check error:', error)
        logout()
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()

    // Listen for auth changes only if Supabase is connected
    if (supabaseConnected) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const userData = {
            id: session.user.id,
            email: session.user.email,
            name:
              session.user.user_metadata?.full_name ||
              session.user.user_metadata?.name ||
              session.user.email.split('@')[0],
            role: 'admin',
            permissions: ['read', 'write', 'admin'],
          }

          setUser(userData)
          setIsAuthenticated(true)
          localStorage.setItem('fallbackUser', JSON.stringify(userData))
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setIsAuthenticated(false)
          localStorage.removeItem('fallbackUser')
        }
      })

      return () => subscription.unsubscribe()
    }
  }, [supabaseConnected])

  const login = async (email, password) => {
    try {
      // If Supabase is not connected, use fallback login
      if (!supabaseConnected) {
        // Simple fallback authentication for development
        const userData = {
          id: 'fallback-user-id',
          email: email,
          name: email.split('@')[0],
          role: 'admin',
          permissions: ['read', 'write', 'admin'],
        }
        setUser(userData)
        setIsAuthenticated(true)
        localStorage.setItem('fallbackUser', JSON.stringify(userData))
        toast.success('Başarıyla giriş yapıldı! (Fallback Mode)')
        return { success: true }
      }

      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw new Error(
          error.message === 'Invalid login credentials'
            ? 'Geçersiz kimlik bilgileri'
            : error.message
        )
      }

      if (data.user) {
        // Create user data from auth info
        const userData = {
          id: data.user.id,
          email: data.user.email,
          name:
            data.user.user_metadata?.full_name ||
            data.user.user_metadata?.name ||
            data.user.email.split('@')[0],
          role: 'admin', // Default to admin for now
          permissions: ['read', 'write', 'admin'],
        }
        setUser(userData)
        setIsAuthenticated(true)
        localStorage.setItem('fallbackUser', JSON.stringify(userData))
        toast.success('Başarıyla giriş yapıldı!')
        return { success: true }
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error.message || 'Giriş yapılırken hata oluştu')
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      if (supabaseConnected) {
        await supabase.auth.signOut()
      }
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

  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false
    return user.permissions.includes(permission) || user.permissions.includes('admin')
  }

  const hasRole = (role) => {
    if (!user) return false
    return user.role === role || user.role === 'admin'
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    supabaseConnected,
    login,
    logout,
    updateUser,
    hasPermission,
    hasRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
