import React from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import App from './App.jsx';
import './i18n';
import './index.css';

// Register Service Worker for caching and offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered successfully:', registration);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              console.log('New version available');
              if (confirm('Yeni bir güncelleme mevcut. Şimdi yenilemek istiyor musunuz?')) {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
              }
            }
          });
        });
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

// Analytics disabled in development mode
// import './utils/analytics'

// Initialize error tracking
import './utils/errorTracker';
import { setupGlobalErrorHandlers } from './utils/errorHandler';

// Setup global error handlers
setupGlobalErrorHandlers();

// Additional error tracking for development
if (import.meta.env.DEV) {
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
  });
  
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
  });
}

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
