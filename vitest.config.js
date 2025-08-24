/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.jsx'],
    css: {
      modules: {
        classNameStrategy: 'non-scoped'
      }
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.js',
        '**/*.config.ts',
        'dist/',
        'build/',
        'coverage/',
        '**/*.test.{js,jsx,ts,tsx}',
        '**/*.spec.{js,jsx,ts,tsx}',
        '**/test-utils.js',
        '**/setupTests.js',
        '**/setup.jsx',
        'public/',
        'scripts/',
        'cypress/',
        '.github/',
        'backend/database/migrations/',
        'backend/database/seeds/'
      ],
      include: [
        'src/**/*.{js,jsx,ts,tsx}'
      ],
      thresholds: {
        global: {
          branches: 85,
          functions: 90,
          lines: 90,
          statements: 90
        }
      }
    },
    // Test timeout settings
    testTimeout: 10000,
    hookTimeout: 10000,
    
    // Test file patterns
    include: [
      'src/**/*.{test,spec}.{js,jsx,ts,tsx}',
      'src/test/**/*.{test,spec}.{js,jsx,ts,tsx}'
    ],
    exclude: [
      'node_modules/',
      'dist/',
      'build/',
      'cypress/',
      '.next/',
      '.nuxt/',
      '.vercel/',
      '.vscode/',
      '.git/',
      'coverage/'
    ],
    
    // Reporter configuration
    reporter: ['verbose', 'json', 'html'],
    outputFile: {
      json: './coverage/test-results.json',
      html: './coverage/test-results.html'
    },
    
    // Mock configuration
    deps: {
      inline: [
        '@testing-library/react',
        '@testing-library/jest-dom',
        'framer-motion'
      ]
    },
    
    // Environment variables for testing
    env: {
      NODE_ENV: 'test',
      VITE_API_URL: 'http://localhost:5000',
      VITE_ENABLE_MONITORING: 'false',
      VITE_ENABLE_ANALYTICS: 'false'
    }
  },
  
  // Resolve aliases for testing
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@pages': resolve(__dirname, './src/pages'),
      '@services': resolve(__dirname, './src/services'),
      '@utils': resolve(__dirname, './src/utils'),
      '@contexts': resolve(__dirname, './src/contexts'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@test': resolve(__dirname, './src/test')
    }
  }
})