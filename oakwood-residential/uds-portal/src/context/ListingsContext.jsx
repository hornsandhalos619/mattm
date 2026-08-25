import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const ListingsContext = createContext(null)

const DEFAULT_LISTINGS = [
  {
    id: 'studio',
    name: 'The Studio',
    price: 1895,
    beds: 'Studio',
    baths: '1 Bath',
    sqft: '650 sqft',
    gradient: 'linear-gradient(135deg,#f4a261 0%,#e9c46a 100%)',
    features: { 'Max Height': "9' 6\"", 'Window': 'Floor-to-ceiling', 'Balcony': 'None', 'Laundry': 'Building', 'Parking': '1 Space' },
    desc: 'Effortless city living. A smart Studio layout with premium finishes throughout, a full kitchen, and an en-suite spa bath.',
    available: true,
    images: []
  },
  {
    id: '1bed',
    name: 'The One Bedroom',
    price: 2450,
    beds: '1 Bed',
    baths: '1 Bath',
    sqft: '780 sqft',
    gradient: 'linear-gradient(135deg,#2a9d8f 0%,#264653 100%)',
    features: { 'Max Height': "9' 6\"", 'Window': 'Floor-to-ceiling', 'Balcony': 'Private', 'Laundry': 'In-unit', 'Parking': '1 Space' },
    desc: "The ideal urban retreat. A spacious one-bedroom with a separate chef's kitchen, walk-in closet, and private balcony.",
    available: true,
    images: []
  },
  {
    id: '2bed',
    name: 'The Two Bedroom',
    price: 3350,
    beds: '2 Beds',
    baths: '2 Baths',
    sqft: '1,100 sqft',
    gradient: 'linear-gradient(135deg,#e76f51 0%,#f4a261 100%)',
    features: { 'Max Height': "10' 6\"", 'Window': 'Floor-to-ceiling', 'Balcony': 'Corner Wrap', 'Laundry': 'In-unit', 'Parking': '2 Spaces' },
    desc: 'Room to breathe. Two full bedrooms, an open-plan living area, corner wrap balcony with sunset views.',
    available: true,
    images: []
  },
  {
    id: '3bed',
    name: 'The Three Bedroom',
    price: 4500,
    beds: '3 Beds',
    baths: '2 Baths',
    sqft: '1,450 sqft',
    gradient: 'linear-gradient(135deg,#264653 0%,#2a9d8f 100%)',
    features: { 'Max Height': "10' 6\"", 'Window': 'Floor-to-ceiling', 'Balcony': 'Terrace', 'Laundry': 'In-unit', 'Parking': '2 Spaces' },
    desc: 'The ultimate family layout. Three bedrooms, a great room with dining, and a full terrace overlooking the bay.',
    available: true,
    images: []
  },
  {
    id: 'penthouse',
    name: 'The Penthouse',
    price: 5200,
    beds: '3 Beds',
    baths: '2.5 Baths',
    sqft: '1,800 sqft',
    gradient: 'linear-gradient(135deg,#e76f51 0%,#264653 50%,#f4a261 100%)',
    features: { 'Max Height': "12' 6\"", 'Window': 'Panoramic', 'Balcony': 'Rooftop Deck', 'Laundry': 'In-unit Miele', 'Parking': '3 Spaces' },
    desc: 'At the top. A full-floor penthouse with 360-degree panoramic views, private rooftop deck, and Italian marble baths.',
    available: true,
    images: []
  },
  {
    id: 'garden',
    name: 'The Garden Suite',
    price: 3800,
    beds: '2 Beds (Flex)',
    baths: '1 Bath',
    sqft: '950 sqft',
    gradient: 'linear-gradient(135deg,#d4a373 0%,#e9c46a 100%)',
    features: { 'Max Height': "9' 6\"", 'Window': 'Garden-facing', 'Balcony': 'Patios Access', 'Laundry': 'In-unit', 'Parking': '1 Space' },
    desc: 'Ground-floor living at its finest. A flexible second bedroom, direct patio access to the landscaped garden courtyard.',
    available: true,
    images: []
  }
]

const THEME_PRESETS = [
  { label: 'Gold', value: 'linear-gradient(135deg,#f4a261 0%,#e9c46a 100%)' },
  { label: 'Deep Teal', value: 'linear-gradient(135deg,#2a9d8f 0%,#264653 100%)' },
  { label: 'Terracotta', value: 'linear-gradient(135deg,#e76f51 0%,#f4a261 100%)' },
  { label: 'Ocean', value: 'linear-gradient(135deg,#264653 0%,#2a9d8f 100%)' },
  { label: 'Sunset Trio', value: 'linear-gradient(135deg,#e76f51 0%,#264653 50%,#f4a261 100%)' },
  { label: 'Sand', value: 'linear-gradient(135deg,#d4a373 0%,#e9c46a 100%)' }
]

export const ListingsProvider = ({ children }) => {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch listings from Supabase
  const fetchListings = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: true })
      
      if (error) {
        console.error('Error fetching listings:', error)
        // Fallback to defaults if table doesn't exist yet
        setListings(DEFAULT_LISTINGS)
        await seedDefaults()
      } else if (data && data.length > 0) {
        // Transform Supabase data to match app format
        const transformed = data.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          beds: item.beds,
          baths: item.baths,
          sqft: item.sqft,
          gradient: item.gradient,
          features: item.features,
          desc: item.description,
          available: item.available,
          images: item.images || []
        }))
        setListings(transformed)
      } else {
        // Empty table - seed defaults
        setListings(DEFAULT_LISTINGS)
        await seedDefaults()
      }
    } catch (err) {
      console.error('Fetch error:', err)
      setListings(DEFAULT_LISTINGS)
    } finally {
      setLoading(false)
    }
  }, [])

  // Seed default listings into Supabase
  const seedDefaults = useCallback(async () => {
    const records = DEFAULT_LISTINGS.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      beds: item.beds,
      baths: item.baths,
      sqft: item.sqft,
      gradient: item.gradient,
      features: item.features,
      description: item.desc,
      available: item.available,
      images: item.images || []
    }))

    const { error } = await supabase
      .from('listings')
      .upsert(records, { onConflict: 'id' })
    
    if (error) console.error('Seed error:', error)
  }, [])

  // Subscribe to realtime changes
  useEffect(() => {
    fetchListings()

    const channel = supabase
      .channel('listings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'listings' }, (payload) => {
        console.log('Realtime change:', payload)
        fetchListings() // Refetch on any change
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchListings])

  const addListing = useCallback(async (listing) => {
    const newListing = {
      ...listing,
      id: 'listing_' + Date.now(),
      created_at: new Date().toISOString()
    }

    const { error } = await supabase
      .from('listings')
      .insert([newListing])
    
    if (error) {
      console.error('Add listing error:', error)
      throw error
    }
    // Realtime will trigger fetchListings
    return newListing
  }, [])

  const updateListing = useCallback(async (id, updates) => {
    const { error } = await supabase
      .from('listings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
    
    if (error) {
      console.error('Update listing error:', error)
      throw error
    }
  }, [])

  const deleteListing = useCallback(async (id) => {
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Delete listing error:', error)
      throw error
    }
  }, [])

  const getListing = useCallback((id) => {
    return listings.find(l => l.id === id)
  }, [listings])

  const resetToDefaults = useCallback(async () => {
    await seedDefaults()
  }, [seedDefaults])

  const value = {
    listings,
    loading,
    themePresets: THEME_PRESETS,
    addListing,
    updateListing,
    deleteListing,
    getListing,
    resetToDefaults,
  }

  return (
    <ListingsContext.Provider value={value}>
      {children}
    </ListingsContext.Provider>
  )
}

export const useListings = () => {
  const context = useContext(ListingsContext)
  if (!context) {
    throw new Error('useListings must be used within a ListingsProvider')
  }
  return context
}