import React from 'react'

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-fast focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-ionos-primary text-ionos-white hover:bg-ionos-blue-light active:bg-ionos-blue focus-visible:ring-ionos-primary',
    secondary: 'bg-ionos-secondary text-ionos-white hover:bg-ionos-teal-light active:bg-ionos-teal focus-visible:ring-ionos-secondary',
    accent: 'bg-ionos-accent text-ionos-gray-900 hover:bg-ionos-gold-light active:bg-ionos-gold focus-visible:ring-ionos-accent',
    outline: 'border-2 border-ionos-primary text-ionos-primary hover:bg-ionos-primary hover:text-ionos-white focus-visible:ring-ionos-primary',
    ghost: 'text-ionos-text-secondary hover:bg-ionos-gray-100 hover:text-ionos-text-primary focus-visible:ring-ionos-gray-300',
    danger: 'bg-ionos-red text-ionos-white hover:bg-ionos-red-light active:bg-ionos-red focus-visible:ring-ionos-red',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-body-sm',
    md: 'px-5 py-2.5 text-body-md',
    lg: 'px-6 py-3 text-body-lg',
  }
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : (
        <>
          {leftIcon && <span>{leftIcon}</span>}
          {children}
          {rightIcon && <span>{rightIcon}</span>}
        </>
      )}
    </button>
  )
}

export const Input = ({ 
  label, 
  error, 
  success, 
  helperText,
  className = '',
  id,
  ...props 
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`input ${error ? 'input-error' : ''} ${success ? 'input-success' : ''} ${className}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="error-message" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="text-body-sm text-ionos-text-muted mt-1.5">
          {helperText}
        </p>
      )}
    </div>
  )
}

export const Textarea = ({ 
  label, 
  error, 
  helperText,
  className = '',
  id,
  rows = 3,
  ...props 
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        className={`input ${error ? 'input-error' : ''} ${className} resize-y`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="error-message" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="text-body-sm text-ionos-text-muted mt-1.5">
          {helperText}
        </p>
      )}
    </div>
  )
}

export const Select = ({ 
  label, 
  error, 
  options = [], 
  placeholder,
  className = '',
  id,
  ...props 
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={`input ${error ? 'input-error' : ''} ${className} appearance-none bg-no-repeat bg-right pr-10`}
        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && (
        <p id={`${inputId}-error`} className="error-message" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export const Checkbox = ({ label, error, className = '', id, ...props }) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  
  return (
    <div className="form-group flex items-start gap-3">
      <input
        type="checkbox"
        id={inputId}
        className="mt-1 w-4 h-4 text-ionos-primary border-ionos-border rounded focus:ring-ionos-primary focus:ring-2"
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      />
      <div className="flex flex-col">
        {label && (
          <label htmlFor={inputId} className="label mb-0 cursor-pointer text-body-md">
            {label}
          </label>
        )}
        {error && (
          <p id={`${inputId}-error`} className="error-message mt-1" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}