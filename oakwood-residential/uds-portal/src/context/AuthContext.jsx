import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState(null) // 'admin' | 'guest' | null

  useEffect(() => {
    // Check for existing session
    const stored = sessionStorage.getItem('oakwood_auth')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setUser(parsed.user)
        setRole(parsed.role)
      } catch (e) {
        sessionStorage.removeItem('oakwood_auth')
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback((username, password, intendedRole) => {
    // Admin credentials
    if (intendedRole === 'admin') {
      if (username === 'admin' && password === 'password') {
        const userData = { username: 'admin', name: 'Administrator', role: 'admin' }
        setUser(userData)
        setRole('admin')
        sessionStorage.setItem('oakwood_auth', JSON.stringify({ user: userData, role: 'admin' }))
        return { success: true }
      }
      return { success: false, error: 'Invalid admin credentials' }
    }

    // Guest login - simple registration/login
    if (intendedRole === 'guest') {
      if (!username || !password) {
        return { success: false, error: 'Username and password required' }
      }
      // Check if user exists in localStorage
      const guests = JSON.parse(localStorage.getItem('oakwood_guests') || '[]')
      const existing = guests.find(g => g.username === username)
      
      if (existing) {
        if (existing.password === password) {
          const userData = { username, name: existing.name, role: 'guest', id: existing.id }
          setUser(userData)
          setRole('guest')
          sessionStorage.setItem('oakwood_auth', JSON.stringify({ user: userData, role: 'guest' }))
          return { success: true }
        }
        return { success: false, error: 'Incorrect password' }
      } else {
        // Register new guest
        const newGuest = {
          id: 'guest_' + Date.now(),
          username,
          password,
          name: username,
          createdAt: new Date().toISOString()
        }
        guests.push(newGuest)
        localStorage.setItem('oakwood_guests', JSON.stringify(guests))
        const userData = { username, name: username, role: 'guest', id: newGuest.id }
        setUser(userData)
        setRole('guest')
        sessionStorage.setItem('oakwood_auth', JSON.stringify({ user: userData, role: 'guest' }))
        return { success: true }
      }
    }

    return { success: false, error: 'Invalid role' }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setRole(null)
    sessionStorage.removeItem('oakwood_auth')
  }, [])

  const updateProfile = useCallback((updates) => {
    if (!user) return
    const updated = { ...user, ...updates }
    setUser(updated)
    sessionStorage.setItem('oakwood_auth', JSON.stringify({ user: updated, role }))
    // If guest, also update in localStorage
    if (role === 'guest') {
      const guests = JSON.parse(localStorage.getItem('oakwood_guests') || '[]')
      const idx = guests.findIndex(g => g.id === user.id)
      if (idx >= 0) {
        guests[idx] = { ...guests[idx], ...updates }
        localStorage.setItem('oakwood_guests', JSON.stringify(guests))
      }
    }
  }, [user, role])

  const value = {
    user,
    role,
    loading,
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