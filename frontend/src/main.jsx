import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App'
import ErrorBoundary from './components/common/ErrorBoundary'
import PageLoader from './components/common/PageLoader'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

// Check if root element exists
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found!');
} else {
  console.log('React app starting...');
  
  const RootApp = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // Quick loader - just 500ms
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }, []);

    if (loading) {
      return <PageLoader />;
    }

    return (
      <React.StrictMode>
        <ErrorBoundary>
          <BrowserRouter>
            <QueryClientProvider client={queryClient}>
              <App />
              <Toaster position="top-right" />
            </QueryClientProvider>
          </BrowserRouter>
        </ErrorBoundary>
      </React.StrictMode>
    );
  };

  ReactDOM.createRoot(rootElement).render(<RootApp />);
}
