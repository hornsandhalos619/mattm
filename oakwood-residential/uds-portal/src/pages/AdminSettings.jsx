import React, { useState, useCallback } from 'react'
import { useSettings } from '../context/SettingsContext'
import { useToast } from '../hooks/useToast'
import { Button, Input, Textarea, Checkbox } from '../components/FormElements'

export const AdminSettings = () => {
  const { settings, updateSettings, resetToDefaults } = useSettings()
  const { showToast } = useToast()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState(settings)

  useEffect(() => {
    setFormData(settings)
  }, [settings])

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      updateSettings(formData)
      showToast('Settings saved successfully', 'success')
    } catch (err) {
      showToast('Failed to save settings', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    if (window.confirm('Reset all settings to defaults? This cannot be undone.')) {
      resetToDefaults()
      showToast('Settings reset to defaults', 'success')
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="page-title">Site-Wide Settings</h2>
        <p className="page-subtitle">Configure global site content, branding, and contact information</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Hero Section */}
        <fieldset className="card p-6 space-y-6">
          <legend className="text-heading-md text-ionos-text-primary">Hero Section</legend>
          
          <Input
            name="siteTitle"
            label="Page Title (Browser Tab)"
            value={formData.siteTitle}
            onChange={handleChange}
            placeholder="Oakwood Residences San Diego - Find a great place to live!"
          />

          <Input
            name="heroBadge"
            label="Hero Badge"
            value={formData.heroBadge}
            onChange={handleChange}
            placeholder="★ Now Leasing — Summer 2026"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="heroHeading"
              label="Hero Heading"
              value={formData.heroHeading}
              onChange={handleChange}
              placeholder="Live Exceptionally in the"
            />
            <Input
              name="heroHighlight"
              label="Hero Highlight (Gold Text)"
              value={formData.heroHighlight}
              onChange={handleChange}
              placeholder="Heart of San Diego"
            />
          </div>

          <Textarea
            name="heroSubheading"
            label="Hero Subheading"
            value={formData.heroSubheading}
            onChange={handleChange}
            placeholder="Fine rentals city-wide — homes and apartments for rent..."
            rows={3}
          />
        </fieldset>

        {/* Announcement Banner */}
        <fieldset className="card p-6 space-y-6">
          <legend className="text-heading-md text-ionos-text-primary">Announcement Banner</legend>
          
          <Checkbox
            name="announcementEnabled"
            label="Show announcement banner under navigation"
            checked={formData.announcementEnabled}
            onChange={handleChange}
          />

          <Input
            name="announcementText"
            label="Banner Text"
            value={formData.announcementText}
            onChange={handleChange}
            placeholder="Limited-time offer: first month free on all 2-bedroom leases!"
            disabled={!formData.announcementEnabled}
          />
        </fieldset>

        {/* Contact Information */}
        <fieldset className="card p-6 space-y-6">
          <legend className="text-heading-md text-ionos-text-primary">Contact Information</legend>
          
          <Textarea
            name="contactAddress"
            label="Sales Gallery Address"
            value={formData.contactAddress}
            onChange={handleChange}
            placeholder="1250 Pacific Highway, San Diego, CA 92101"
            rows={2}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="contactPhone"
              label="Phone"
              value={formData.contactPhone}
              onChange={handleChange}
              placeholder="(619) 555-0188"
            />
            <Input
              name="contactEmail"
              type="email"
              label="Email"
              value={formData.contactEmail}
              onChange={handleChange}
              placeholder="leasing@oakwoodresidences-sd.com"
            />
          </div>

          <Input
            name="contactHours"
            label="Office Hours"
            value={formData.contactHours}
            onChange={handleChange}
            placeholder="Mon–Sat: 9am – 6pm • Sun: 10am – 4pm"
          />
        </fieldset>

        {/* Footer */}
        <fieldset className="card p-6 space-y-6">
          <legend className="text-heading-md text-ionos-text-primary">Footer</legend>
          
          <Input
            name="footerTagline"
            label="Footer Tagline"
            value={formData.footerTagline}
            onChange={handleChange}
            placeholder="Luxury apartment living in the heart of San Diego."
          />
        </fieldset>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-ionos-border">
          <Button type="submit" loading={saving} className="flex-1">
            Save Settings
          </Button>
          <Button variant="danger" type="button" onClick={handleReset} className="flex-1">
            Reset to Defaults
          </Button>
        </div>
      </form>
    </div>
  )
}