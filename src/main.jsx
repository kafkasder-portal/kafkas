import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './i18n'
import './index.css'

// Analytics disabled in development mode
// import './utils/analytics'

// Initialize error tracking
import './utils/errorTracker'

// React DevTools for development
if (import.meta.env.DEV) {
  // This will show the React DevTools installation message in development
  console.log('💡 React DevTools: https://reactjs.org/link/react-devtools')
}

createRoot(document.getElementById('root')).render(<App />)
