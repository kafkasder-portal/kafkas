// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Global configuration
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test on uncaught exceptions
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false
  }
  if (err.message.includes('Non-Error promise rejection')) {
    return false
  }
  return true
})

// Custom error handling
Cypress.on('fail', (error, runnable) => {
  // Log additional information on test failure
  console.error('Test failed:', {
    test: runnable.title,
    error: error.message,
    stack: error.stack,
  })
  throw error
})

// Performance monitoring
Cypress.on('test:after:run', (attributes) => {
  if (attributes.state === 'failed') {
    cy.task('log', `Test "${attributes.title}" failed after ${attributes.duration}ms`)
  }
})

// Network request monitoring
Cypress.on('window:before:load', (win) => {
  cy.stub(win.console, 'log').as('consoleLog')
  cy.stub(win.console, 'error').as('consoleError')
  cy.stub(win.console, 'warn').as('consoleWarn')
})

// Accessibility testing setup
beforeEach(() => {
  // Inject axe-core for accessibility testing
  cy.injectAxe()
})

// Global test data
const testData = {
  users: {
    admin: {
      email: 'admin@example.com',
      password: 'AdminPass123!',
      name: 'Admin User',
      role: 'admin',
    },
    manager: {
      email: 'manager@example.com',
      password: 'ManagerPass123!',
      name: 'Manager User',
      role: 'manager',
    },
    user: {
      email: 'user@example.com',
      password: 'UserPass123!',
      name: 'Regular User',
      role: 'user',
    },
  },
  donations: {
    valid: {
      donorName: 'Test Donor',
      amount: '100',
      currency: 'TRY',
      type: 'cash',
      description: 'Test donation',
    },
    invalid: {
      donorName: '',
      amount: '-50',
      currency: 'TRY',
      type: 'cash',
      description: '',
    },
  },
  beneficiaries: {
    valid: {
      name: 'Test Beneficiary',
      phone: '+905551234567',
      email: 'beneficiary@example.com',
      address: 'Test Address',
      needs: ['food', 'clothing'],
    },
    invalid: {
      name: '',
      phone: '123',
      email: 'invalid-email',
      address: '',
      needs: [],
    },
  },
  tasks: {
    valid: {
      title: 'Test Task',
      description: 'Test task description',
      priority: 'medium',
      dueDate: '2024-12-31',
    },
    invalid: {
      title: '',
      description: '',
      priority: 'invalid',
      dueDate: 'invalid-date',
    },
  },
}

// Make test data available globally
Cypress.env('testData', testData)

// Custom assertions
chai.Assertion.addMethod('beVisibleAndEnabled', function () {
  this.assert(
    this._obj.is(':visible') && !this._obj.is(':disabled'),
    'expected #{this} to be visible and enabled',
    'expected #{this} to not be visible and enabled',
    this._obj
  )
})

chai.Assertion.addMethod('haveProperAccessibility', function () {
  const element = this._obj[0]
  const hasLabel = element.hasAttribute('aria-label') ||
    element.hasAttribute('aria-labelledby') ||
    element.closest('label')

  this.assert(
    hasLabel,
    'expected #{this} to have proper accessibility labels',
    'expected #{this} to not have proper accessibility labels',
    element
  )
})

// Performance assertions
chai.Assertion.addMethod('loadWithin', function (timeout) {
  const startTime = Date.now()

  cy.wrap(this._obj).should('be.visible').then(() => {
    const loadTime = Date.now() - startTime
    this.assert(
      loadTime <= timeout,
      `expected page to load within ${timeout}ms, but it took ${loadTime}ms`,
      `expected page to not load within ${timeout}ms, but it took ${loadTime}ms`,
      loadTime
    )
  })
})

// Security assertions
chai.Assertion.addMethod('beSecure', function () {
  const element = this._obj[0]
  const hasSecureAttributes = element.hasAttribute('data-secure') ||
    element.classList.contains('secure') ||
    element.getAttribute('type') === 'password'

  this.assert(
    hasSecureAttributes,
    'expected #{this} to have security attributes',
    'expected #{this} to not have security attributes',
    element
  )
})

// Form validation assertions
chai.Assertion.addMethod('haveValidationErrors', function (expectedErrors) {
  cy.wrap(this._obj).within(() => {
    Object.entries(expectedErrors).forEach(([field, errorMessage]) => {
      cy.get(`[data-field="${field}"]`).should('contain.text', errorMessage)
    })
  })
})

// API response assertions
chai.Assertion.addMethod('haveValidResponse', function () {
  cy.wrap(this._obj).then((response) => {
    this.assert(
      response.status >= 200 && response.status < 300,
      'expected response to be successful',
      'expected response to not be successful',
      response.status
    )

    this.assert(
      response.body && typeof response.body === 'object',
      'expected response to have valid JSON body',
      'expected response to not have valid JSON body',
      response.body
    )
  })
})

// Database assertions
chai.Assertion.addMethod('existInDatabase', function (table, conditions) {
  cy.task('queryDatabase', { table, conditions }).then((result) => {
    this.assert(
      result && result.length > 0,
      `expected record to exist in ${table}`,
      `expected record to not exist in ${table}`,
      result
    )
  })
})

// File upload assertions
chai.Assertion.addMethod('beValidFile', function (allowedTypes, maxSize) {
  const file = this._obj[0]

  this.assert(
    allowedTypes.includes(file.type),
    `expected file to be one of ${allowedTypes.join(', ')}`,
    `expected file to not be one of ${allowedTypes.join(', ')}`,
    file.type
  )

  this.assert(
    file.size <= maxSize,
    `expected file size to be <= ${maxSize} bytes`,
    `expected file size to be > ${maxSize} bytes`,
    file.size
  )
})

// WebSocket assertions
chai.Assertion.addMethod('beConnected', function () {
  cy.wrap(this._obj).should('have.property', 'readyState', 1)
})

// Local storage assertions
chai.Assertion.addMethod('beStored', function (key) {
  cy.window().then((win) => {
    const value = win.localStorage.getItem(key)
    this.assert(
      value !== null,
      `expected ${key} to be stored in localStorage`,
      `expected ${key} to not be stored in localStorage`,
      value
    )
  })
})

// Session storage assertions
chai.Assertion.addMethod('beInSession', function (key) {
  cy.window().then((win) => {
    const value = win.sessionStorage.getItem(key)
    this.assert(
      value !== null,
      `expected ${key} to be stored in sessionStorage`,
      `expected ${key} to not be stored in sessionStorage`,
      value
    )
  })
})

// Cookie assertions
chai.Assertion.addMethod('haveSecureCookie', function (name) {
  cy.getCookie(name).then((cookie) => {
    this.assert(
      cookie && cookie.secure,
      `expected ${name} to be a secure cookie`,
      `expected ${name} to not be a secure cookie`,
      cookie
    )
  })
})

// Theme assertions
chai.Assertion.addMethod('useTheme', function (theme) {
  cy.window().then((win) => {
    const currentTheme = win.document.documentElement.getAttribute('data-theme')
    this.assert(
      currentTheme === theme,
      `expected page to use ${theme} theme`,
      `expected page to not use ${theme} theme`,
      currentTheme
    )
  })
})

// Language assertions
chai.Assertion.addMethod('useLanguage', function (language) {
  cy.window().then((win) => {
    const currentLang = win.document.documentElement.lang
    this.assert(
      currentLang === language,
      `expected page to use ${language} language`,
      `expected page to not use ${language} language`,
      currentLang
    )
  })
})

// Export for use in tests
export { testData }

