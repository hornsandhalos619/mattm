import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [initError, setInitError] = useState(null)

  useEffect(() => {
    let mounted = true
    
    const initAuth = async () => {
      try {
        // Check for existing Supabase session
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth init error:', error)
          if (mounted) setInitError(error.message)
        }
        
        if (session?.user && mounted) {
          const userRole = session.user.user_metadata?.role || 'guest'
          setUser({ 
            id: session.user.id, 
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email,
            role: userRole 
          })
          setRole(userRole)
        }
      } catch (err) {
        console.error('Auth init exception:', err)
        if (mounted) setInitError(err.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    
    initAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const userRole = session.user.user_metadata?.role || 'guest'
        setUser({ 
          id: session.user.id, 
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email,
          role: userRole 
        })
        setRole(userRole)
      } else {
        setUser(null)
        setRole(null)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const login = useCallback(async (email, password, intendedRole) => {
    try {
      if (intendedRole === 'admin') {
        // Admin login - use a dedicated admin email
        const adminEmail = 'admin@oakwood-residential.com'
        const { data, error } = await supabase.auth.signInWithPassword({
          email: adminEmail,
          password: 'OakwoodAdmin2026!'
        })
        
        if (error) {
          return { success: false, error: error.message }
        }
        
        // Ensure admin role is set in metadata
        await supabase.auth.updateUser({ data: { role: 'admin' } })
        return { success: true }
      }

      // Guest login
      if (intendedRole === 'guest') {
        if (!email || !password) {
          return { success: false, error: 'Email and password required' }
        }
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        
        if (error) {
          // If user doesn't exist, try to register
          if (error.message.includes('Invalid login credentials') || error.message.includes('User not found')) {
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email,
              password,
              options: { data: { role: 'guest', name: email.split('@')[0] } }
            })
            
            if (signUpError) {
              return { success: false, error: signUpError.message }
            }
            
            if (signUpData.user?.identities?.length === 0) {
              return { success: false, error: 'User already exists' }
            }
            
            return { success: true }
          }
          return { success: false, error: error.message }
        }
        
        return { success: true }
      }

      return { success: false, error: 'Invalid role' }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Logout error:', err)
    }
    setUser(null)
    setRole(null)
  }, [])

  const updateProfile = useCallback(async (updates) => {
    if (!user) return
    try {
      const { error } = await supabase.auth.updateUser({ data: updates })
      if (!error) {
        setUser(prev => ({ ...prev, ...updates }))
      }
    } catch (err) {
      console.error('Profile update error:', err)
    }
  }, [user])

  const value = {
    user,
    role,
    loading,
    initError,
    login,
    logout,
    updateProfile,
    isAdmin: role === 'admin',
    isGuest: role === 'guest',
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}