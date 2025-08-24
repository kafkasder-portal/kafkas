import React from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import App from './App.jsx';
import './i18n';
import './index.css';

// Analytics disabled in development mode
// import './utils/analytics'

// Initialize error tracking
import './utils/errorTracker';
import { setupGlobalErrorHandlers } from './utils/errorHandler';

// Setup global error handlers
setupGlobalErrorHandlers();

// React DevTools for development
if (import.meta.env.DEV) {
  // This will show the React DevTools installation message in development
}

createRoot(document.getElementById('root')).render(
  <>
    <App />
    <Analytics />
    <SpeedInsights />
  </>
);
