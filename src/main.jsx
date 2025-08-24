import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './i18n'
import './index.css'

// Analytics disabled in development mode
// import './utils/analytics'

createRoot(document.getElementById('root')).render(<App />)
