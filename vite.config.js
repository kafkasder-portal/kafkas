import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Bundle analyzer - only in production builds
    process.env.NODE_ENV === 'production' && visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ].filter(Boolean),
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.jsx',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/', '**/*.d.ts', '**/*.config.js', '**/*.config.ts'],
    },
  },
  server: {
    port: 5174,
    host: true,
    // Development server optimizations
    hmr: {
      overlay: true,
      port: 24678,
      host: 'localhost',
    },
    // Proxy configuration for API
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
    // Force dependency pre-bundling
    force: true,
    // WebSocket configuration
    ws: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Production build optimizations
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          animations: ['framer-motion'],
          ui: ['lucide-react', 'sonner'],
          utils: ['uuid', 'dompurify'],
          i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],

        },
        // Asset optimization
        assetFileNames: assetInfo => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    // Build performance optimizations
    target: 'es2015',
    cssTarget: 'chrome80',
    // Asset optimization
    assetsInlineLimit: 4096,
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
  // Environment-specific configurations
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __ENVIRONMENT__: JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  // CSS optimization
  css: {
    devSourcemap: true,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react',
      'sonner',
      'i18next',
      'react-i18next',

      'uuid',
      'dompurify',
    ],
    exclude: ['@testing-library/react', 'vitest'],
  },
  // Preview server for testing production build
  preview: {
    port: 4173,
    host: true,
    strictPort: true,
  },
})
