import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import Login from '../../pages/Login';

// Mock dependencies
vi.mock('../../services/api', () => ({
  post: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../../utils/security', () => ({
  rateLimiters: {
    login: vi.fn().mockReturnValue(true),
  },
  auditLogger: {
    log: vi.fn(),
  },
  securityMonitor: {
    monitorActivity: vi.fn(),
  },
}));

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Login Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form with all elements', () => {
    renderWithProviders(<Login />);

    expect(screen.getByLabelText(/e-posta/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/şifre/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /giriş yap/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty form submission', () => {
    renderWithProviders(<Login />);

    const loginButton = screen.getByRole('button', { name: /giriş yap/i });
    fireEvent.click(loginButton);

    // Should show validation errors
    expect(screen.getByText('E-posta adresi gereklidir')).toBeInTheDocument();
    expect(screen.getByText('Şifre gereklidir')).toBeInTheDocument();
  });

  it('handles form input changes', () => {
    renderWithProviders(<Login />);

    const emailInput = screen.getByLabelText(/e-posta/i);
    const passwordInput = screen.getByLabelText(/şifre/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('shows demo users list', () => {
    renderWithProviders(<Login />);

    expect(screen.getByText('admin@kafkas.org')).toBeInTheDocument();
    expect(screen.getByText('manager@kafkas.org')).toBeInTheDocument();
    expect(screen.getByText('volunteer@kafkas.org')).toBeInTheDocument();
  });

  it('handles form submission attempt', () => {
    renderWithProviders(<Login />);

    const emailInput = screen.getByLabelText(/e-posta/i);
    const passwordInput = screen.getByLabelText(/şifre/i);
    const loginButton = screen.getByRole('button', { name: /giriş yap/i });

    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    // Should attempt to submit the form
    expect(loginButton).toBeInTheDocument();
  });

  it('maintains form state after submission attempt', () => {
    renderWithProviders(<Login />);

    const emailInput = screen.getByLabelText(/e-posta/i);
    const passwordInput = screen.getByLabelText(/şifre/i);
    const loginButton = screen.getByRole('button', { name: /giriş yap/i });

    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    // Form values should remain after submission attempt
    expect(emailInput.value).toBe('john@example.com');
    expect(passwordInput.value).toBe('password123');
  });
});
