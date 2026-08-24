import React, { useState, useCallback } from 'react'
import { useListings } from '../context/ListingsContext'
import { useSettings } from '../context/SettingsContext'
import { Button, Input, Select, Textarea } from '../components/FormElements'
import { Modal, Toaster } from '../components/Modal'
import { useToast } from '../hooks/useToast'

export const AdminListings = () => {
  const { listings, themePresets, addListing, updateListing, deleteListing, resetToDefaults } = useListings()
  const { showToast } = useToast()
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  const initialFormData = {
    name: '',
    price: '',
    beds: '',
    baths: '',
    sqft: '',
    gradient: themePresets[0].value,
    features: {
      'Max Height': '',
      'Window': '',
      'Balcony': '',
      'Laundry': '',
      'Parking': '',
    },
    desc: '',
    available: true,
  }

  const openEditor = useCallback((listing = null) => {
    if (listing) {
      setEditingId(listing.id)
      setFormData({
        name: listing.name,
        price: listing.price.toString(),
        beds: listing.beds,
        baths: listing.baths,
        sqft: listing.sqft,
        gradient: listing.gradient,
        features: { ...listing.features },
        desc: listing.desc,
        available: listing.available,
      })
    } else {
      setEditingId(null)
      setFormData(initialFormData)
    }
    setErrors({})
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Listing name is required'
    if (!formData.price) newErrors.price = 'Price is required'
    if (isNaN(Number(formData.price))) newErrors.price = 'Price must be a number'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const listingData = {
      ...formData,
      price: Number(formData.price),
    }

    if (editingId) {
      updateListing(editingId, listingData)
      showToast('Listing updated successfully', 'success')
    } else {
      addListing(listingData)
      showToast('Listing created successfully', 'success')
    }
    openEditor(null)
  }

  const handleDelete = (id) => {
    setShowDeleteConfirm(id)
  }

  const confirmDelete = () => {
    if (showDeleteConfirm) {
      deleteListing(showDeleteConfirm)
      showToast('Listing deleted', 'success')
      setShowDeleteConfirm(null)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(price)
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="page-title">Floor Plan Listings</h2>
          <p className="page-subtitle">Manage rental listings — {listings.length} active</p>
        </div>
        <Button onClick={() => openEditor(null)} leftIcon={<PlusIcon />}>
          Add New Listing
        </Button>
      </div>

      {listings.length === 0 ? (
        <div className="card p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-ionos-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-heading-md text-ionos-text-primary mb-2">No listings yet</h3>
          <p className="text-ionos-text-secondary mb-6">Create your first floor plan listing to get started.</p>
          <Button onClick={() => openEditor(null)} leftIcon={<PlusIcon />}>
            Add Your First Listing
          </Button>
        </div>
      ) : (
        <div className="table-container">
          <table className="table" role="table">
            <thead>
              <tr>
                <th scope="col">Listing</th>
                <th scope="col">Type</th>
                <th scope="col">Price</th>
                <th scope="col">Size</th>
                <th scope="col">Status</th>
                <th scope="col"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {listings.map(listing => (
                <tr key={listing.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg flex-shrink-0" style={{ background: listing.gradient }} />
                      <div>
                        <p className="font-semibold text-ionos-text-primary">{listing.name}</p>
                        <p className="text-body-sm text-ionos-text-secondary">{listing.beds} · {listing.baths}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-primary">{listing.beds}</span>
                  </td>
                  <td className="font-semibold text-ionos-text-primary">
                    {formatPrice(listing.price)}/mo
                  </td>
                  <td className="text-ionos-text-secondary">{listing.sqft}</td>
                  <td>
                    <span className={`badge ${listing.available ? 'badge-success' : 'badge-warning'}`}>
                      {listing.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditor(listing)} aria-label={`Edit ${listing.name}`}>
                        <EditIcon className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(listing.id)} className="text-ionos-red hover:bg-ionos-red/10" aria-label={`Delete ${listing.name}`}>
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={!!editingId || editingId === null}
        onClose={() => openEditor(null)}
        title={editingId ? 'Edit Listing' : 'Add New Listing'}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => openEditor(null)}>Cancel</Button>
            <Button onClick={handleSubmit} loading={false}>Save Listing</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Listing Name *"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              error={errors.name}
              placeholder="The Two Bedroom"
            />
            <Input
              label="Monthly Price *"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              error={errors.price}
              placeholder="3350"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Beds"
              value={formData.beds}
              onChange={(e) => setFormData({...formData, beds: e.target.value})}
              placeholder="2 Beds"
            />
            <Input
              label="Baths"
              value={formData.baths}
              onChange={(e) => setFormData({...formData, baths: e.target.value})}
              placeholder="2 Baths"
            />
            <Input
              label="Square Feet"
              value={formData.sqft}
              onChange={(e) => setFormData({...formData, sqft: e.target.value})}
              placeholder="1,100 sqft"
            />
          </div>

          <Select
            label="Card Theme"
            value={formData.gradient}
            onChange={(e) => setFormData({...formData, gradient: e.target.value})}
            options={themePresets.map(t => ({ value: t.value, label: t.label }))}
          />

          <Textarea
            label="Description"
            value={formData.desc}
            onChange={(e) => setFormData({...formData, desc: e.target.value})}
            placeholder="Short marketing description shown in the detail view..."
            rows={3}
          />

          <h4 className="text-heading-sm text-ionos-text-primary mb-3">Feature Grid (shown in detail modal)</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.keys(formData.features).map(key => (
              <Input
                key={key}
                label={key}
                value={formData.features[key]}
                onChange={(e) => setFormData({...formData, features: {...formData.features, [key]: e.target.value}})}
                placeholder={key}
              />
            ))}
          </div>

          <Checkbox
            label="Available for rent"
            checked={formData.available}
            onChange={(e) => setFormData({...formData, available: e.target.checked})}
          />
        </form>
      </Modal>

      <Modal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        title="Delete Listing"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowDeleteConfirm(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-ionos-text-secondary">Are you sure you want to delete this listing? This action cannot be undone.</p>
      </Modal>

      <Toaster />
    </div>
  )
}

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
)

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
)

const Checkbox = ({ label, checked, onChange, className = '' }) => (
  <div className={`form-group flex items-start gap-3 ${className}`}>
    <input
      type="checkbox"
      className="mt-1 w-4 h-4 text-ionos-primary border-ionos-border rounded focus:ring-ionos-primary focus:ring-2"
      checked={checked}
      onChange={onChange}
    />
    <label className="label mb-0 cursor-pointer text-body-md">{label}</label>
  </div>
)