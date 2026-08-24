import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

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
  const [listings, setListings] = useState(() => {
    const stored = localStorage.getItem('oakwood_listings')
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (e) {
        return DEFAULT_LISTINGS
      }
    }
    return DEFAULT_LISTINGS
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    localStorage.setItem('oakwood_listings', JSON.stringify(listings))
    // Also sync to the main site's localStorage key
    localStorage.setItem('oakwood_floor_plans_v1', JSON.stringify(listings))
  }, [listings])

  const addListing = useCallback((listing) => {
    const newListing = {
      ...listing,
      id: 'listing_' + Date.now(),
      createdAt: new Date().toISOString()
    }
    setListings(prev => [...prev, newListing])
    return newListing
  }, [])

  const updateListing = useCallback((id, updates) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l))
  }, [])

  const deleteListing = useCallback((id) => {
    setListings(prev => prev.filter(l => l.id !== id))
  }, [])

  const getListing = useCallback((id) => {
    return listings.find(l => l.id === id)
  }, [listings])

  const resetToDefaults = useCallback(() => {
    setListings(DEFAULT_LISTINGS)
  }, [])

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