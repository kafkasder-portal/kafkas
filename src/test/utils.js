import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext'
import { ThemeProvider } from '../contexts/ThemeContext'
import { NotificationProvider } from '../contexts/NotificationContext'
import { WebSocketProvider } from '../contexts/WebSocketContext'

// Custom render function with providers
export const renderWithProviders = (ui, options = {}) => {
  const {
    route = '/',
    initialAuthState = { isAuthenticated: false, user: null },
    initialThemeState = { theme: 'light' },
    ...renderOptions
  } = options

  window.history.pushState({}, 'Test page', route)

  const Wrapper = ({ children }) => (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <WebSocketProvider>
              {children}
            </WebSocketProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    history: window.history,
  }
}

// Mock data generators
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
  avatar: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
})

export const createMockDonation = (overrides = {}) => ({
  id: 'test-donation-id',
  donorName: 'Test Donor',
  amount: 100,
  currency: 'TRY',
  type: 'cash',
  status: 'completed',
  date: new Date().toISOString(),
  description: 'Test donation',
  ...overrides,
})

export const createMockBeneficiary = (overrides = {}) => ({
  id: 'test-beneficiary-id',
  name: 'Test Beneficiary',
  phone: '+905551234567',
  email: 'beneficiary@example.com',
  address: 'Test Address',
  needs: ['food', 'clothing'],
  status: 'active',
  createdAt: new Date().toISOString(),
  ...overrides,
})

export const createMockTask = (overrides = {}) => ({
  id: 'test-task-id',
  title: 'Test Task',
  description: 'Test task description',
  status: 'pending',
  priority: 'medium',
  assignedTo: 'test-user-id',
  dueDate: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  ...overrides,
})

export const createMockMeeting = (overrides = {}) => ({
  id: 'test-meeting-id',
  title: 'Test Meeting',
  description: 'Test meeting description',
  date: new Date().toISOString(),
  duration: 60,
  participants: ['test-user-id'],
  status: 'scheduled',
  ...overrides,
})

// API mock helpers
export const mockApiResponse = (data, status = 200) => {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  })
}

export const mockApiError = (message = 'API Error', status = 500) => {
  return Promise.reject(new Error(message))
}

// Form testing helpers
export const fillForm = async (formData) => {
  for (const [name, value] of Object.entries(formData)) {
    const element = screen.getByRole('textbox', { name: new RegExp(name, 'i') }) ||
                   screen.getByLabelText(new RegExp(name, 'i')) ||
                   screen.getByPlaceholderText(new RegExp(name, 'i'))
    
    if (element) {
      await act(async () => {
        fireEvent.change(element, { target: { value } })
      })
    }
  }
}

export const submitForm = async (submitButtonText = 'Submit') => {
  const submitButton = screen.getByRole('button', { name: new RegExp(submitButtonText, 'i') })
  await act(async () => {
    fireEvent.click(submitButton)
  })
}

// Navigation helpers
export const navigateTo = (path) => {
  window.history.pushState({}, 'Test page', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

// Wait helpers
export const waitForElementToBeRemoved = async (element) => {
  await waitFor(() => {
    expect(element).not.toBeInTheDocument()
  })
}

export const waitForLoadingToFinish = async () => {
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  })
}

// Assertion helpers
export const expectElementToBeVisible = (element) => {
  expect(element).toBeInTheDocument()
  expect(element).toBeVisible()
}

export const expectElementToHaveText = (element, text) => {
  expect(element).toHaveTextContent(text)
}

export const expectFormToHaveValues = (formData) => {
  for (const [name, value] of Object.entries(formData)) {
    const element = screen.getByDisplayValue(value)
    expect(element).toBeInTheDocument()
  }
}

// Mock localStorage
export const mockLocalStorage = () => {
  const store = {}
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString()
    }),
    removeItem: jest.fn((key) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    }),
  }
}

// Mock sessionStorage
export const mockSessionStorage = () => {
  const store = {}
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString()
    }),
    removeItem: jest.fn((key) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    }),
  }
}

// Mock WebSocket
export const mockWebSocket = () => {
  const mockSocket = {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
    connected: true,
  }
  
  global.WebSocket = jest.fn(() => mockSocket)
  return mockSocket
}

// Mock IntersectionObserver
export const mockIntersectionObserver = () => {
  const mockObserver = {
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }
  
  global.IntersectionObserver = jest.fn(() => mockObserver)
  return mockObserver
}

// Mock ResizeObserver
export const mockResizeObserver = () => {
  const mockObserver = {
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }
  
  global.ResizeObserver = jest.fn(() => mockObserver)
  return mockObserver
}

// Test data sets
export const TEST_USERS = [
  createMockUser({ id: 'user-1', name: 'Admin User', role: 'admin' }),
  createMockUser({ id: 'user-2', name: 'Manager User', role: 'manager' }),
  createMockUser({ id: 'user-3', name: 'Regular User', role: 'user' }),
]

export const TEST_DONATIONS = [
  createMockDonation({ id: 'donation-1', amount: 100, status: 'completed' }),
  createMockDonation({ id: 'donation-2', amount: 250, status: 'pending' }),
  createMockDonation({ id: 'donation-3', amount: 500, status: 'completed' }),
]

export const TEST_BENEFICIARIES = [
  createMockBeneficiary({ id: 'beneficiary-1', name: 'John Doe', status: 'active' }),
  createMockBeneficiary({ id: 'beneficiary-2', name: 'Jane Smith', status: 'inactive' }),
  createMockBeneficiary({ id: 'beneficiary-3', name: 'Bob Johnson', status: 'active' }),
]

export const TEST_TASKS = [
  createMockTask({ id: 'task-1', title: 'Urgent Task', priority: 'high', status: 'pending' }),
  createMockTask({ id: 'task-2', title: 'Regular Task', priority: 'medium', status: 'in-progress' }),
  createMockTask({ id: 'task-3', title: 'Completed Task', priority: 'low', status: 'completed' }),
]

export const TEST_MEETINGS = [
  createMockMeeting({ id: 'meeting-1', title: 'Weekly Meeting', status: 'scheduled' }),
  createMockMeeting({ id: 'meeting-2', title: 'Board Meeting', status: 'completed' }),
  createMockMeeting({ id: 'meeting-3', title: 'Planning Meeting', status: 'cancelled' }),
]

// Performance testing helpers
export const measureRenderTime = async (component) => {
  const startTime = performance.now()
  renderWithProviders(component)
  const endTime = performance.now()
  return endTime - startTime
}

export const measureMemoryUsage = () => {
  if (performance.memory) {
    return {
      used: performance.memory.usedJSHeapSize,
      total: performance.memory.totalJSHeapSize,
      limit: performance.memory.jsHeapSizeLimit,
    }
  }
  return null
}

// Accessibility testing helpers
export const checkAccessibility = async (component) => {
  const { container } = renderWithProviders(component)
  
  // Basic accessibility checks
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
  const buttons = container.querySelectorAll('button')
  const inputs = container.querySelectorAll('input, textarea, select')
  
  // Check for proper heading hierarchy
  const headingLevels = Array.from(headings).map(h => parseInt(h.tagName.charAt(1)))
  const hasProperHierarchy = headingLevels.every((level, index) => {
    if (index === 0) return true
    return level <= headingLevels[index - 1] + 1
  })
  
  // Check for proper labels
  const hasProperLabels = Array.from(inputs).every(input => {
    return input.hasAttribute('aria-label') || 
           input.hasAttribute('aria-labelledby') || 
           input.closest('label') ||
           input.hasAttribute('placeholder')
  })
  
  return {
    hasProperHierarchy,
    hasProperLabels,
    headingCount: headings.length,
    buttonCount: buttons.length,
    inputCount: inputs.length,
  }
}
