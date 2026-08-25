import React, { useState, useCallback } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useListings } from '../context/ListingsContext'
import { Button } from '../components/FormElements'

export const GuestLayout = () => {
  const { user, logout, isGuest } = useAuth()
  const { listings } = useListings()
  const navigate = useNavigate()

  if (!isGuest) return null

  const navItems = [
    { path: '/guest/listings', label: 'Available Listings', icon: HomeIcon },
    { path: '/guest/profile', label: 'My Profile', icon: UserIcon },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="layout">
      <aside className="sidebar" role="navigation" aria-label="Guest navigation">
        <div className="p-6 border-b border-ionos-gray-700 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-ionos-secondary flex items-center justify-center">
            <svg className="w-6 h-6 text-ionos-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-ionos-white text-body-md">Oakwood</p>
            <p className="text-caption text-ionos-gray-400">Guest Portal</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                sidebar-link ${isActive ? 'active' : ''}
              `}
              aria-current={({ isActive }) => isActive ? 'page' : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-ionos-gray-700 space-y-3">
          <div className="px-4 py-3 bg-ionos-gray-800/50 rounded-lg">
            <p className="text-caption text-ionos-gray-400">Signed in as</p>
            <p className="font-medium text-ionos-white text-body-sm">{user?.name || 'Guest'}</p>
          </div>
          <Button variant="ghost" fullWidth onClick={handleLogout} className="text-ionos-gray-300 hover:text-ionos-white hover:bg-ionos-blue-light">
            <LogoutIcon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
            Sign Out
          </Button>
        </div>
      </aside>

      <main className="main-content" role="main">
        <header className="page-header sticky top-0 z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="page-title">Guest Portal</h1>
              <p className="page-subtitle">Browse available rentals and manage your profile</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-ionos-secondary/10 rounded-full">
                <UserIcon className="w-4 h-4 text-ionos-teal" aria-hidden="true" />
                <span className="text-body-sm font-medium text-ionos-teal">
                  {user?.name || 'Guest'}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="content-area">
          <Outlet />
        </div>
      </main>
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

const LogoutIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
)