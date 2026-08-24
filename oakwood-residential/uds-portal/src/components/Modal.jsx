import React, { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Button } from './FormElements'

export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  footer,
  closeOnOverlayClick = true,
  showCloseButton = true,
}) => {
  const modalRef = useRef(null)
  const previousActiveElement = useRef(null)

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement
      document.body.style.overflow = 'hidden'
      modalRef.current?.focus()
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose()
        if (e.key === 'Tab') {
          const focusableElements = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
          const firstElement = focusableElements[0]
          const lastElement = focusableElements[focusableElements.length - 1]
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = ''
        previousActiveElement.current?.focus()
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw]',
  }

  const modalContent = (
    <div
      className="modal-overlay"
      onClick={closeOnOverlayClick ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`modal ${sizes[size]}`}
      >
        {(title || showCloseButton) && (
          <div className="modal-header">
            {title && <h2 id="modal-title" className="page-title">{title}</h2>}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            )}
          </div>
        )}
        <div className="modal-body">
          {children}
        </div>
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

const Toast = ({ message, type = 'info', onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  const typeStyles = {
    success: 'bg-ionos-green text-ionos-white',
    error: 'bg-ionos-red text-ionos-white',
    warning: 'bg-ionos-warning text-ionos-gray-900',
    info: 'bg-ionos-primary text-ionos-white',
  }

  const icons = {
    success: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>,
    error: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10 7.293 11.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>,
    warning: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>,
    info: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/></svg>,
  }

  return createPortal(
    <div className="fixed bottom-6 right-6 z-50 animate-slide-in flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl min-w-[300px] max-w-md" style={{ animation: 'slideIn 0.3s ease-out' }}>
      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      <div className={`${typeStyles[type]} flex items-center gap-3`}>
        {icons[type]}
        <span className="text-body-md font-medium">{message}</span>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-current hover:bg-current/10">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
      </div>
    </div>,
    document.body
  )
}

export const Toaster = () => {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <>
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
      ))}
    </>
  )
}