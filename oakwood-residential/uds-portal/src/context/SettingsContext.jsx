import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

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
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  // Fetch settings from Supabase
  const fetchSettings = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'main')
        .single()
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No settings row yet - create defaults
          await seedDefaults()
        } else {
          console.error('Error fetching settings:', error)
        }
      } else if (data) {
        // Transform Supabase data to match app format
        const { id, created_at, updated_at, ...rest } = data
        setSettings({ ...DEFAULT_SETTINGS, ...rest })
      }
    } catch (err) {
      console.error('Fetch settings error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Seed default settings into Supabase
  const seedDefaults = useCallback(async () => {
    const { error } = await supabase
      .from('site_settings')
      .upsert([{ id: 'main', ...DEFAULT_SETTINGS }], { onConflict: 'id' })
    
    if (error) console.error('Seed settings error:', error)
  }, [])

  // Subscribe to realtime changes
  useEffect(() => {
    fetchSettings()

    const channel = supabase
      .channel('settings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, (payload) => {
        console.log('Settings realtime change:', payload)
        if (payload.new && payload.new.id === 'main') {
          const { id, created_at, updated_at, ...rest } = payload.new
          setSettings({ ...DEFAULT_SETTINGS, ...rest })
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchSettings])

  const updateSettings = useCallback(async (updates) => {
    const newSettings = { ...settings, ...updates }
    setSettings(newSettings)

    const { error } = await supabase
      .from('site_settings')
      .upsert([{ id: 'main', ...newSettings, updated_at: new Date().toISOString() }], { onConflict: 'id' })
    
    if (error) {
      console.error('Update settings error:', error)
      throw error
    }
  }, [settings])

  const resetToDefaults = useCallback(async () => {
    setSettings(DEFAULT_SETTINGS)
    await seedDefaults()
  }, [seedDefaults])

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