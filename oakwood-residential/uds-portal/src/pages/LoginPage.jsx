import React, { useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { Button, Input } from '../components/FormElements'
import { useToast } from '../hooks/useToast'

export const LoginPage = () => {
  const { login } = useAuth()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('guest') // 'admin' | 'guest'
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }, [errors])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    
    const newErrors = {}
    if (!formData.username.trim()) newErrors.username = 'Username is required'
    if (!formData.password) newErrors.password = 'Password is required'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const result = login(formData.username, formData.password, activeTab)
      if (result.success) {
        showToast(`Welcome back, ${formData.username}!`, 'success')
      } else {
        setErrors({ form: result.error })
        showToast(result.error, 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setFormData({ username: '', password: '' })
    setErrors({})
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ionos-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-ionos-primary flex items-center justify-center">
              <svg className="w-7 h-7 text-ionos-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-display-sm font-heading font-bold text-ionos-text-primary">Oakwood</span>
          </div>
          <h1 className="text-heading-lg text-ionos-text-primary mb-1">Welcome Back</h1>
          <p className="text-ionos-text-secondary">Sign in to access your portal</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-ionos-white rounded-xl border border-ionos-border p-1 mb-6" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'guest'}
            onClick={() => handleTabChange('guest')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-body-md font-semibold transition-all duration-fast ${
              activeTab === 'guest'
                ? 'bg-ionos-primary text-ionos-white shadow-md'
                : 'text-ionos-text-secondary hover:text-ionos-text-primary'
            }`}
          >
            Guest Portal
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'admin'}
            onClick={() => handleTabChange('admin')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-body-md font-semibold transition-all duration-fast ${
              activeTab === 'admin'
                ? 'bg-ionos-accent text-ionos-gray-900 shadow-md'
                : 'text-ionos-text-secondary hover:text-ionos-text-primary'
            }`}
          >
            Admin Portal
          </button>
        </div>

        {/* Login Form */}
        <div className="card-elevated p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.form && (
              <div className="p-3 bg-ionos-red/10 border border-ionos-red/20 rounded-lg text-ionos-red text-body-sm" role="alert">
                {errors.form}
              </div>
            )}

            <Input
              name="username"
              label="Username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              placeholder={activeTab === 'admin' ? 'admin' : 'Enter your username'}
              autoComplete="username"
              autoFocus
            />

            <Input
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••••"
              autoComplete={activeTab === 'admin' ? 'current-password' : 'new-password'}
            />

            {activeTab === 'guest' && (
              <p className="text-body-sm text-ionos-text-secondary text-center">
                New here? Enter any username/password to create an account.
              </p>
            )}

            {activeTab === 'admin' && (
              <p className="text-body-sm text-ionos-text-secondary text-center">
                Demo credentials: <code className="bg-ionos-gray-100 px-1.5 py-0.5 rounded text-ionos-primary font-mono">admin</code> / <code className="bg-ionos-gray-100 px-1.5 py-0.5 rounded text-ionos-primary font-mono">password</code>
              </p>
            )}

            <Button type="submit" fullWidth loading={loading} size="lg" className="mt-2">
              {activeTab === 'admin' ? 'Sign In as Admin' : 'Sign In as Guest'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-ionos-border text-center">
            <a href="/" className="text-ionos-primary hover:text-ionos-blue-light font-medium text-body-sm">
              ← Back to Website
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}