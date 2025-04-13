import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Use React.lazy for code splitting
const App = lazy(() => import('./App.tsx'))

// Create a simple loading component
const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    width: '100vw',
    backgroundColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#141414' : '#ffffff',
    color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#ffffff' : '#000000'
  }}>
    <div>Loading...</div>
  </div>
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<LoadingFallback />}>
      <App />
    </Suspense>
  </StrictMode>,
)
