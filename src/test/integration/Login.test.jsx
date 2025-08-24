import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../../contexts/AuthContext'
import Login from '../../pages/Login'

// Mock the API service
vi.mock('../../services/api', () => ({
  post: vi.fn()
}))

// Mock the validation utilities
vi.mock('../../utils/validation', () => ({
  validateForm: vi.fn(() => ({ isValid: true, errors: {} })),
  sanitizeInput: vi.fn((input) => input),
  generateCSRFToken: vi.fn(() => 'test-csrf-token'),
  validateCSRFToken: vi.fn(() => true),
  createRateLimiter: vi.fn(() => vi.fn(() => true))
}))

// Mock the toast notifications
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn()
  }
}))

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('Login Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form with all required fields', () => {
    renderWithProviders(<Login />)

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument()
  })

  it('handles successful login flow', async () => {
    const { post } = await import('../../services/api')
    post.mockResolvedValue({
      data: {
        user: {
          id: 'user-123',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user'
        },
        token: 'test-jwt-token'
      }
    })

    renderWithProviders(<Login />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const loginButton = screen.getByRole('button', { name: /login/i })

    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(post).toHaveBeenCalledWith('/auth/login', {
        email: 'john@example.com',
        password: 'password123',
        csrfToken: 'test-csrf-token'
      })
    })
  })

  it('handles login validation errors', async () => {
    const { validateForm } = await import('../../utils/validation')
    validateForm.mockReturnValue({
      isValid: false,
      errors: {
        email: 'Invalid email format',
        password: 'Password is required'
      }
    })

    renderWithProviders(<Login />)

    const loginButton = screen.getByRole('button', { name: /login/i })
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(screen.getByText('Invalid email format')).toBeInTheDocument()
      expect(screen.getByText('Password is required')).toBeInTheDocument()
    })
  })

  it('handles API errors during login', async () => {
    const { post } = await import('../../services/api')
    post.mockRejectedValue({
      response: {
        data: {
          message: 'Invalid credentials'
        }
      }
    })

    const { toast } = await import('sonner')

    renderWithProviders(<Login />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const loginButton = screen.getByRole('button', { name: /login/i })

    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid credentials')
    })
  })

  it('implements rate limiting for login attempts', async () => {
    const { createRateLimiter } = await import('../../utils/validation')
    const mockRateLimiter = vi.fn()
    createRateLimiter.mockReturnValue(mockRateLimiter)

    renderWithProviders(<Login />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const loginButton = screen.getByRole('button', { name: /login/i })

    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(loginButton)

    expect(mockRateLimiter).toHaveBeenCalled()
  })

  it('shows loading state during login', async () => {
    const { post } = await import('../../services/api')
    post.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    renderWithProviders(<Login />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const loginButton = screen.getByRole('button', { name: /login/i })

    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(loginButton)

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('handles network errors gracefully', async () => {
    const { post } = await import('../../services/api')
    post.mockRejectedValue(new Error('Network error'))

    const { toast } = await import('sonner')

    renderWithProviders(<Login />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const loginButton = screen.getByRole('button', { name: /login/i })

    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Network error occurred')
    })
  })

  it('sanitizes input data before submission', async () => {
    const { sanitizeInput } = await import('../../utils/validation')
    sanitizeInput.mockImplementation((input) => input.replace(/<script>/gi, ''))

    renderWithProviders(<Login />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const loginButton = screen.getByRole('button', { name: /login/i })

    fireEvent.change(emailInput, { target: { value: '<script>alert("xss")</script>john@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(sanitizeInput).toHaveBeenCalledWith('<script>alert("xss")</script>john@example.com')
    })
  })

  it('validates CSRF token', async () => {
    const { validateCSRFToken } = await import('../../utils/validation')
    validateCSRFToken.mockReturnValue(false)

    renderWithProviders(<Login />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const loginButton = screen.getByRole('button', { name: /login/i })

    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(validateCSRFToken).toHaveBeenCalled()
    })
  })

  it('navigates to dashboard after successful login', async () => {
    const { post } = await import('../../services/api')
    post.mockResolvedValue({
      data: {
        user: {
          id: 'user-123',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user'
        },
        token: 'test-jwt-token'
      }
    })

    const { toast } = await import('sonner')

    renderWithProviders(<Login />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const loginButton = screen.getByRole('button', { name: /login/i })

    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Login successful')
    })
  })

  it('handles form reset after successful submission', async () => {
    const { post } = await import('../../services/api')
    post.mockResolvedValue({
      data: {
        user: { id: 'user-123', name: 'John Doe', email: 'john@example.com', role: 'user' },
        token: 'test-jwt-token'
      }
    })

    renderWithProviders(<Login />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const loginButton = screen.getByRole('button', { name: /login/i })

    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(emailInput.value).toBe('')
      expect(passwordInput.value).toBe('')
    })
  })
})
