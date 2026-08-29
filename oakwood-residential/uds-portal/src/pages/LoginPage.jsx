import React, { useState, useCallback, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Button, Input } from '../components/FormElements'
import { useToast } from '../hooks/useToast'

export const LoginPage = () => {
  const { login } = useAuth()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('guest') // 'admin' | 'guest'
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState('')

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }, [errors])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setDebugInfo('Attempting login...')
    
    const newErrors = {}
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const result = await login(formData.email, formData.password, activeTab)
      setDebugInfo(`Login result: ${JSON.stringify(result)}`)
      if (result.success) {
        showToast(`Welcome back!`, 'success')
      } else {
        setErrors({ form: result.error })
        showToast(result.error, 'error')
      }
    } catch (err) {
      setDebugInfo(`Exception: ${err.message}`)
      setErrors({ form: `Login failed: ${err.message}` })
      showToast(`Login failed: ${err.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setFormData({ email: '', password: '' })
    setErrors({})
    setDebugInfo('')
  }

  // Test Supabase connection on mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const testClient = createClient(
          'https://emdjxetqgiantgyhhgij.supabase.co',
          'sb_publishable_1dKpmFSbuQUBbrw7VM0PTA_Az6yKwrj'
        )
        const { data, error } = await testClient.from('listings').select('count', { count: 'exact', head: true })
        if (error) {
          setDebugInfo(`DB connection error: ${error.message}`)
        } else {
          setDebugInfo('Supabase connected ✓')
        }
      } catch (err) {
        setDebugInfo(`Connection test failed: ${err.message}`)
      }
    }
    testConnection()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl" style={{ background: 'linear-gradient(135deg, var(--terra), var(--gold))' }}>
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 32 32">
                <path d="M16 2L4 12v16h10V20h4v8h10V12L16 2z" stroke="var(--terra-dark)" strokeWidth="1.5" fill="var(--gold)"/>
              </svg>
            </div>
            <span className="text-2xl font-bold" style={{ color: 'var(--terra)' }}>Oakwood</span>
          </div>
          <h1 className="text-3xl font-bold mb-1" style={{ color: 'var(--teal)' }}>Welcome Back</h1>
          <p className="text-gray-600">Sign in to access your portal</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl border p-1 mb-6" style={{ borderColor: 'var(--border)' }} role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'guest'}
            onClick={() => handleTabChange('guest')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-base font-semibold transition-all duration-200 ${
              activeTab === 'guest'
                ? 'bg-gradient-to-r from-terra to-gold text-white shadow-md'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            style={{ 
              background: activeTab === 'guest' ? 'linear-gradient(135deg, var(--terra), var(--gold))' : 'transparent',
              color: activeTab === 'guest' ? 'white' : 'var(--text-light)'
            }}
          >
            Guest Portal
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'admin'}
            onClick={() => handleTabChange('admin')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-base font-semibold transition-all duration-200 ${
              activeTab === 'admin'
                ? 'bg-gradient-to-r from-gold to-terra text-gray-900 shadow-md'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            style={{ 
              background: activeTab === 'admin' ? 'linear-gradient(135deg, var(--gold), var(--terra))' : 'transparent',
              color: activeTab === 'admin' ? 'var(--text)' : 'var(--text-light)'
            }}
          >
            Admin Portal
          </button>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl border p-6 shadow-lg" style={{ borderColor: 'var(--border)' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.form && (
              <div className="p-3 rounded-lg text-sm" role="alert" style={{ 
                background: 'rgba(231, 111, 81, 0.1)', 
                border: '1px solid rgba(231, 111, 81, 0.2)',
                color: 'var(--terra)'
              }}>
                {errors.form}
              </div>
            )}

            {debugInfo && (
              <div className="p-3 rounded-lg text-xs font-mono bg-gray-100 text-gray-600" style={{ maxHeight: '100px', overflow: 'auto' }}>
                {debugInfo}
              </div>
            )}

            <Input
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder={activeTab === 'admin' ? 'admin@oakwood-residential.com' : 'Enter your email'}
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
              <p className="text-sm text-center" style={{ color: 'var(--text-light)' }}>
                New here? Enter any email/password to create an account.
              </p>
            )}

            {activeTab === 'admin' && (
              <p className="text-sm text-center" style={{ color: 'var(--text-light)' }}>
                Demo: <code className="bg-gray-100 px-1.5 py-0.5 rounded" style={{ color: 'var(--terra)' }}>admin@oakwood-residential.com</code> / <code className="bg-gray-100 px-1.5 py-0.5 rounded" style={{ color: 'var(--terra)' }}>OakwoodAdmin2026!</code>
              </p>
            )}

            <Button type="submit" fullWidth loading={loading} size="lg" className="mt-2">
              {activeTab === 'admin' ? 'Sign In as Admin' : 'Sign In as Guest'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t text-center" style={{ borderColor: 'var(--border)' }}>
            <a href="/oakwood-residences/" className="font-medium text-sm" style={{ color: 'var(--terra)' }}>
              ← Back to Oakwood Residences
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}