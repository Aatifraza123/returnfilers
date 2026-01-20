import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Toaster } from 'react-hot-toast'
import App from './App'
import ErrorBoundary from './components/common/ErrorBoundary'
import './index.css'
import './theme.css'
import './colors.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// Debug log only in development
if (import.meta.env.DEV && !GOOGLE_CLIENT_ID) {
  console.warn('⚠️ VITE_GOOGLE_CLIENT_ID is not set. Google login will not work.');
}

// Check if root element exists
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found!');
} else {
  console.log('React app starting...');
  
  const RootApp = () => {
    // No initial loading delay - instant load
    return (
      <React.StrictMode>
        <ErrorBoundary>
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <BrowserRouter>
              <QueryClientProvider client={queryClient}>
                <App />
                <Toaster 
                  position="bottom-right"
                  toastOptions={{
                    // Default options
                    duration: 3000,
                    style: {
                      background: '#fff',
                      color: '#1f2937',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      border: '1px solid #e5e7eb',
                    },
                    // Success
                    success: {
                      duration: 3000,
                      style: {
                        background: '#fff',
                        color: '#059669',
                        border: '1px solid #d1fae5',
                      },
                      iconTheme: {
                        primary: '#10b981',
                        secondary: '#fff',
                      },
                    },
                    // Error
                    error: {
                      duration: 4000,
                      style: {
                        background: '#fff',
                        color: '#dc2626',
                        border: '1px solid #fee2e2',
                      },
                      iconTheme: {
                        primary: '#ef4444',
                        secondary: '#fff',
                      },
                    },
                    // Loading
                    loading: {
                      style: {
                        background: '#fff',
                        color: '#3b82f6',
                        border: '1px solid #dbeafe',
                      },
                    },
                  }}
                />
              </QueryClientProvider>
            </BrowserRouter>
          </GoogleOAuthProvider>
        </ErrorBoundary>
      </React.StrictMode>
    );
  };

  ReactDOM.createRoot(rootElement).render(<RootApp />);
}
