import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from '../App'
import { AuthProvider } from '../contexts/AuthContext'
import { NotificationProvider } from '../contexts/NotificationContext'
import { ThemeProvider } from '../contexts/ThemeContext'
import { WebSocketProvider } from '../contexts/WebSocketContext'

// Test wrapper component
const TestWrapper = ({ children }) => (
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

describe('App Component', () => {
  test('renders login page when not authenticated', () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    )

    expect(screen.getByText('Kafkas Derneği')).toBeInTheDocument()
    expect(screen.getByText('Giriş Yap')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('ornek@email.com')).toBeInTheDocument()
  })

  test('shows demo credentials', () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    )

    expect(screen.getByText('Demo Giriş Bilgileri:')).toBeInTheDocument()
    expect(screen.getByText('E-posta: admin@kafkasder.org')).toBeInTheDocument()
    expect(screen.getByText('Şifre: 123456')).toBeInTheDocument()
  })

  test('validates email format', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    )

    const emailInput = screen.getByPlaceholderText('ornek@email.com')
    const submitButton = screen.getByText('Giriş Yap')

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Geçerli bir e-posta adresi giriniz')).toBeInTheDocument()
    })
  })

  test('validates password length', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    )

    const emailInput = screen.getByPlaceholderText('ornek@email.com')
    const passwordInput = screen.getByPlaceholderText('••••••••')
    const submitButton = screen.getByText('Giriş Yap')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: '123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Şifre en az 6 karakter olmalıdır')).toBeInTheDocument()
    })
  })
})
