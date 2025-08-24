import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SecureForm from '../../components/SecureForm';

// Mock the validation utilities
vi.mock('../../utils/validation', () => ({
  sanitizeInput: vi.fn(input => input),
  validateForm: vi.fn(() => ({ isValid: true, errors: {} })),
  generateCSRFToken: vi.fn(() => 'test-csrf-token'),
  validateCSRFToken: vi.fn(() => true),
  createRateLimiter: vi.fn(() => vi.fn(() => true)),
}));

// Mock the API service
vi.mock('../../services/api', () => ({
  post: vi.fn(() => Promise.resolve({ data: { success: true } })),
}));

const renderWithRouter = component => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('SecureForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form with all fields', () => {
    const mockSubmit = vi.fn();

    renderWithRouter(
      <SecureForm
        onSubmit={mockSubmit}
        fields={[
          { name: 'name', label: 'Name', type: 'text', required: true },
          { name: 'email', label: 'Email', type: 'email', required: true },
        ]}
      />
    );

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('handles form submission with validation', async () => {
    const mockSubmit = vi.fn();

    renderWithRouter(
      <SecureForm
        onSubmit={mockSubmit}
        fields={[
          { name: 'name', label: 'Name', type: 'text', required: true },
          { name: 'email', label: 'Email', type: 'email', required: true },
        ]}
      />
    );

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
      });
    });
  });

  it('shows validation errors for invalid input', async () => {
    const { validateForm } = await import('../../utils/validation');
    validateForm.mockReturnValue({
      isValid: false,
      errors: {
        email: 'Invalid email format',
      },
    });

    const mockSubmit = vi.fn();

    renderWithRouter(
      <SecureForm
        onSubmit={mockSubmit}
        fields={[
          { name: 'email', label: 'Email', type: 'email', required: true },
        ]}
      />
    );

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    });
  });

  it('implements rate limiting', async () => {
    const { createRateLimiter } = await import('../../utils/validation');
    const mockRateLimiter = vi.fn();
    createRateLimiter.mockReturnValue(mockRateLimiter);

    const mockSubmit = vi.fn();

    renderWithRouter(
      <SecureForm
        onSubmit={mockSubmit}
        fields={[{ name: 'name', label: 'Name', type: 'text', required: true }]}
      />
    );

    const nameInput = screen.getByLabelText(/name/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(nameInput, { target: { value: 'John' } });
    fireEvent.click(submitButton);

    expect(mockRateLimiter).toHaveBeenCalled();
  });

  it('includes CSRF token in form', () => {
    const mockSubmit = vi.fn();

    renderWithRouter(
      <SecureForm
        onSubmit={mockSubmit}
        fields={[{ name: 'name', label: 'Name', type: 'text', required: true }]}
      />
    );

    const csrfInput = screen.getByDisplayValue('test-csrf-token');
    expect(csrfInput).toBeInTheDocument();
    expect(csrfInput).toHaveAttribute('name', 'csrfToken');
  });

  it('sanitizes input data', async () => {
    const { sanitizeInput } = await import('../../utils/validation');
    sanitizeInput.mockImplementation(input => input.replace(/<script>/gi, ''));

    const mockSubmit = vi.fn();

    renderWithRouter(
      <SecureForm
        onSubmit={mockSubmit}
        fields={[
          {
            name: 'message',
            label: 'Message',
            type: 'textarea',
            required: true,
          },
        ]}
      />
    );

    const messageInput = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(messageInput, {
      target: { value: '<script>alert("xss")</script>Hello' },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(sanitizeInput).toHaveBeenCalledWith(
        '<script>alert("xss")</script>Hello'
      );
    });
  });

  it('shows loading state during submission', async () => {
    const mockSubmit = vi.fn(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    renderWithRouter(
      <SecureForm
        onSubmit={mockSubmit}
        fields={[{ name: 'name', label: 'Name', type: 'text', required: true }]}
      />
    );

    const nameInput = screen.getByLabelText(/name/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(nameInput, { target: { value: 'John' } });
    fireEvent.click(submitButton);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('handles submission errors gracefully', async () => {
    const mockSubmit = vi.fn(() => Promise.reject(new Error('Network error')));

    renderWithRouter(
      <SecureForm
        onSubmit={mockSubmit}
        fields={[{ name: 'name', label: 'Name', type: 'text', required: true }]}
      />
    );

    const nameInput = screen.getByLabelText(/name/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(nameInput, { target: { value: 'John' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
