import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ListingsProvider } from './context/ListingsContext'
import { SettingsProvider } from './context/SettingsContext'
import { ToastProvider } from './hooks/useToast'
import { AdminLayout } from './components/AdminLayout'
import { GuestLayout } from './components/GuestLayout'
import { LoginPage } from './pages/LoginPage'
import { AdminListings } from './pages/AdminListings'
import { AdminSettings } from './pages/AdminSettings'
import { GuestListings } from './pages/GuestListings'
import { GuestProfile } from './pages/GuestProfile'
import { Toaster } from './components/Modal'

// Protected route wrappers
const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-4 border-ionos-primary border-t-transparent" /></div>
  if (!isAdmin) return <Navigate to="/login" replace />
  return children
}

const GuestRoute = ({ children }) => {
  const { isGuest, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-4 border-ionos-primary border-t-transparent" /></div>
  if (!isGuest) return <Navigate to="/login" replace />
  return children
}

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-4 border-ionos-primary border-t-transparent" /></div>
  if (isAuthenticated) return <Navigate to="/guest/listings" replace />
  return children
}

const AppRoutes = () => (
  <Routes>
    {/* Public routes */}
    <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
    
    {/* Admin routes */}
    <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
      <Route path="/admin/listings" element={<AdminListings />} />
      <Route path="/admin/settings" element={<AdminSettings />} />
      <Route path="/admin" element={<Navigate to="/admin/listings" replace />} />
    </Route>
    
    {/* Guest routes */}
    <Route element={<GuestRoute><GuestLayout /></GuestRoute>}>
      <Route path="/guest/listings" element={<GuestListings />} />
      <Route path="/guest/profile" element={<GuestProfile />} />
      <Route path="/guest" element={<Navigate to="/guest/listings" replace />} />
    </Route>
    
    {/* Default redirect */}
    <Route path="/" element={<Navigate to="/guest/listings" replace />} />
    <Route path="*" element={<Navigate to="/guest/listings" replace />} />
  </Routes>
)

const App = () => (
  <AuthProvider>
    <ListingsProvider>
      <SettingsProvider>
        <ToastProvider>
          <AppRoutes />
          <Toaster />
        </ToastProvider>
      </SettingsProvider>
    </ListingsProvider>
  </AuthProvider>
)

export default App