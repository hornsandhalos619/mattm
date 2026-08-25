import React, { useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../hooks/useToast'
import { Button, Input } from '../components/FormElements'

export const GuestProfile = () => {
  const { user, updateProfile } = useAuth()
  const { showToast } = useToast()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })
  const [saving, setSaving] = useState(false)

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      updateProfile(formData)
      showToast('Profile updated successfully', 'success')
    } catch (err) {
      showToast('Failed to update profile', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="page-title">My Profile</h2>
        <p className="page-subtitle">Manage your account information and preferences</p>
      </div>

      <form onSubmit={handleSave} className="card p-6 space-y-6">
        <div className="flex items-center gap-4 p-4 bg-ionos-gray-50 rounded-xl">
          <div className="w-16 h-16 rounded-full bg-ionos-secondary flex items-center justify-center flex-shrink-0">
            <svg className="w-8 h-8 text-ionos-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-heading-md text-ionos-text-primary">{formData.name || user?.name || 'Guest'}</h3>
            <p className="text-ionos-text-secondary text-body-sm">@{user?.username || 'guest'}</p>
            <span className="badge badge-secondary mt-2 inline-block">Guest Member</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="name"
            label="Full Name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
          />
          <Input
            name="email"
            type="email"
            label="Email Address"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
          />
        </div>

        <Input
          name="phone"
          type="tel"
          label="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          placeholder="(555) 123-4567"
        />

        <div className="pt-4 border-t border-ionos-border flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={() => setFormData({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' })}>
            Reset
          </Button>
          <Button type="submit" loading={saving}>
            Save Changes
          </Button>
        </div>
      </form>

      <div className="card p-6 mt-6 border-ionos-red/20 bg-ionos-red/5">
        <h4 className="text-ionos-red font-semibold text-ionos-text-primary mb-2">Account Security</h4>
        <p className="text-ionos-red/80 text-body-sm mb-4">
          For security, your password is managed separately. To change your password, please sign out and sign back in with new credentials.
        </p>
        <Button variant="outline" onClick={() => { /* sign out logic */ }}>
          Sign Out to Change Password
        </Button>
      </div>
    </div>
  )
}