import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        log(message) {
          console.log(message)
          return null
        },
        table(message) {
          console.table(message)
          return null
        },
      })
    },
    env: {
      // Test data
      testUser: {
        email: 'test@example.com',
        password: 'TestPass123!',
        name: 'Test User',
      },
      adminUser: {
        email: 'admin@example.com',
        password: 'AdminPass123!',
        name: 'Admin User',
      },
      // API endpoints
      apiUrl: 'http://localhost:5000/api',
      // Test timeouts
      shortTimeout: 5000,
      mediumTimeout: 10000,
      longTimeout: 30000,
    },
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.js',
  },
})
