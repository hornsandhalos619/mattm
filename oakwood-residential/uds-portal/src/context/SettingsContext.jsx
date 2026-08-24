import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const SettingsContext = createContext(null)

const DEFAULT_SETTINGS = {
  siteTitle: 'Oakwood Residences San Diego - Find a great place to live!',
  heroBadge: '★ Now Leasing — Summer 2026',
  heroHeading: 'Live Exceptionally in the',
  heroHighlight: 'Heart of San Diego',
  heroSubheading: 'Fine rentals city-wide — homes and apartments for rent. Oakwood Residences redefines premium rental living with stunning city views, resort-style amenities, and a walkable address that puts everything within reach.',
  announcementEnabled: false,
  announcementText: '',
  contactAddress: '1250 Pacific Highway, San Diego, CA 92101',
  contactPhone: '(619) 555-0188',
  contactEmail: 'leasing@oakwoodresidences-sd.com',
  contactHours: 'Mon–Sat: 9am – 6pm • Sun: 10am – 4pm',
  footerTagline: 'Luxury apartment living in the heart of San Diego.',
}

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const stored = localStorage.getItem('oakwood_site_settings')
    if (stored) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
      } catch (e) {
        return DEFAULT_SETTINGS
      }
    }
    return DEFAULT_SETTINGS
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    localStorage.setItem('oakwood_site_settings', JSON.stringify(settings))
    // Also sync to main site's key
    localStorage.setItem('oakwood_site_settings_v1', JSON.stringify(settings))
  }, [settings])

  const updateSettings = useCallback((updates) => {
    setSettings(prev => ({ ...prev, ...updates }))
  }, [])

  const resetToDefaults = useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
  }, [])

  const value = {
    settings,
    loading,
    updateSettings,
    resetToDefaults,
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}