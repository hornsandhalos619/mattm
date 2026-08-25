import React, { useState, useCallback } from 'react'
import { useListings } from '../context/ListingsContext'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/FormElements'
import { Modal } from '../components/Modal'

export const GuestListings = () => {
  const { listings } = useListings()
  const { user } = useAuth()
  const [selectedListing, setSelectedListing] = useState(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filteredListings = listings
    .filter(l => l.available)
    .filter(l => filter === 'all' || l.id === filter)
    .filter(l => 
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.beds.toLowerCase().includes(search.toLowerCase()) ||
      l.desc.toLowerCase().includes(search.toLowerCase())
    )

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(price)
  }

  const handleInquire = (listing) => {
    setSelectedListing(listing)
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="page-title">Available Rentals</h2>
        <p className="page-subtitle">Browse our available floor plans — {filteredListings.length} listing{filteredListings.length !== 1 ? 's' : ''} found</p>
      </div>

      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">Search listings</label>
            <input
              id="search"
              type="search"
              placeholder="Search by name, type, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input w-auto"
            aria-label="Filter by type"
          >
            <option value="all">All Types</option>
            {listings.map(l => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredListings.length === 0 ? (
        <div className="card p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-ionos-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-heading-md text-ionos-text-primary mb-2">No listings match your filters</h3>
          <p className="text-ionos-text-secondary mb-4">Try adjusting your search or filter criteria.</p>
          <Button variant="ghost" onClick={() => { setSearch(''); setFilter('all'); }}>Clear Filters</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map(listing => (
            <article key={listing.id} className="card-hover group">
              <div className="aspect-[4/3] relative overflow-hidden" style={{ background: listing.gradient }}>
                <div className="absolute inset-0 flex items-center justify-center text-ionos-white/70 font-semibold text-body-lg group-hover:scale-105 transition-transform duration-300">
                  {listing.name}
                </div>
                <div className="absolute top-3 right-3">
                  <span className="badge badge-success">Available</span>
                </div>
              </div>
              
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-heading-sm text-ionos-text-primary">{listing.name}</h3>
                    <p className="text-ionos-text-secondary text-body-sm mt-0.5">{listing.beds} · {listing.baths} · {listing.sqft}</p>
                  </div>
                  <span className="text-display-sm font-heading font-bold text-ionos-primary whitespace-nowrap">
                    {formatPrice(listing.price)}
                    <span className="text-body-md font-normal text-ionos-text-secondary">/mo</span>
                  </span>
                </div>

                <p className="text-ionos-text-secondary text-body-sm line-clamp-2">{listing.desc}</p>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-ionos-border">
                  {Object.entries(listing.features).slice(0, 4).map(([key, value]) => (
                    <span key={key} className="badge badge-primary text-caption">
                      {key}: {value}
                    </span>
                  ))}
                  {Object.keys(listing.features).length > 4 && (
                    <span className="badge badge-primary text-caption">
                      +{Object.keys(listing.features).length - 4} more
                    </span>
                  )}
                </div>

                <Button 
                  fullWidth 
                  variant="primary"
                  onClick={() => handleInquire(listing)}
                >
                  Inquire About This Listing
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!selectedListing}
        onClose={() => setSelectedListing(null)}
        title="Schedule a Tour"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setSelectedListing(null)}>Cancel</Button>
            <Button variant="primary" onClick={() => {
              alert(`Tour request submitted for ${selectedListing.name}! Our team will contact you within 24 hours.`)
              setSelectedListing(null)
            }}>
              Submit Request
            </Button>
          </>
        }
      >
        {selectedListing && (
          <div className="space-y-4">
            <div className="p-4 bg-ionos-gray-50 rounded-xl">
              <h4 className="font-semibold text-ionos-text-primary mb-1">{selectedListing.name}</h4>
              <p className="text-ionos-text-secondary text-body-sm">{selectedListing.beds} · {selectedListing.baths} · {selectedListing.sqft}</p>
              <p className="text-heading-md font-bold text-ionos-primary mt-1">{formatPrice(selectedListing.price)}/mo</p>
            </div>

            <h4 className="text-heading-sm text-ionos-text-primary">Your Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name *"
                className="input"
                required
              />
              <input
                type="text"
                placeholder="Last Name *"
                className="input"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="email"
                placeholder="Email *"
                className="input"
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                className="input"
              />
            </div>
            <textarea
              placeholder="Preferred move-in date, questions, or special requests..."
              className="input"
              rows={3}
            />
          </div>
        )}
      </Modal>
    </div>
  )
}

const HomeIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)

const UserIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(price)
}