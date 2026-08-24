import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from './FormElements'

export const AdminLayout = () => {
  const { user, logout, isAdmin } = useAuth()

  if (!isAdmin) return null

  const navItems = [
    { path: '/admin/listings', label: 'Floor Plan Listings', icon: HomeIcon },
    { path: '/admin/settings', label: 'Site-Wide Settings', icon: SettingsIcon },
  ]

  return (
    <div className="layout">
      <aside className="sidebar" role="navigation" aria-label="Admin navigation">
        <div className="p-6 border-b border-ionos-gray-700 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-ionos-accent flex items-center justify-center">
            <svg className="w-6 h-6 text-ionos-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-ionos-white text-body-md">Oakwood</p>
            <p className="text-caption text-ionos-gray-400">Admin Portal</p>
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
          <a 
            href="/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="sidebar-link"
          >
            <ExternalLinkIcon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
            View Live Website
          </a>
          <Button 
            variant="ghost" 
            fullWidth 
            onClick={logout}
            className="text-ionos-gray-300 hover:text-ionos-white hover:bg-ionos-blue-light"
          >
            <LogoutIcon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
            Sign Out
          </Button>
        </div>
      </aside>

      <main className="main-content" role="main">
        <header className="page-header sticky top-0 z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="page-title">Admin Portal</h1>
              <p className="page-subtitle">Manage listings, pricing, and site content</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-ionos-accent/10 rounded-full">
                <UserIcon className="w-4 h-4 text-ionos-gray-800" aria-hidden="true" />
                <span className="text-body-sm font-medium text-ionos-gray-800">
                  {user?.name || 'Admin'}
                </span>
                <span className="text-caption text-ionos-gray-600">Administrator</span>
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

const SettingsIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const UserIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

const ExternalLinkIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
)

const LogoutIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
)