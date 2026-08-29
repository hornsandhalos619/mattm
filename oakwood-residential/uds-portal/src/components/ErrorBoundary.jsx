import React, { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '20px',
          background: 'var(--bg, #faf9f6)',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{
            maxWidth: '600px',
            padding: '40px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #e76f51, #f4a261)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: 'white',
              fontSize: '24px'
            }}>
              ⚠
            </div>
            <h2 style={{ color: '#264653', marginBottom: '16px', fontSize: '1.5rem' }}>
              Something went wrong
            </h2>
            <p style={{ color: '#8d99ae', marginBottom: '24px', lineHeight: 1.6 }}>
              The application encountered an error. Please try refreshing the page or contact support if the issue persists.
            </p>
            <details style={{ textAlign: 'left', marginTop: '20px', padding: '16px', background: '#f5f5f5', borderRadius: '8px', fontSize: '12px' }}>
              <summary style={{ cursor: 'pointer', color: '#8d99ae', marginBottom: '8px' }}>
                Error Details (for debugging)
              </summary>
              <pre style={{ overflow: 'auto', maxHeight: '200px', whiteSpace: 'pre-wrap' }}>
                {this.state.error && this.state.error.toString()}
              </pre>
            </details>
            <button 
              onClick={() => window.location.reload()}
              style={{
                marginTop: '24px',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #e76f51, #f4a261)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary