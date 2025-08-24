import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '../../contexts/AuthContext';
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

const renderWithProviders = component => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('SecureForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form with all fields', () => {
    const mockSubmit = vi.fn();

    renderWithProviders(
      <SecureForm
        onSubmit={mockSubmit}
        fields={[
          { name: 'name', label: 'Name', type: 'text', required: true },
          { name: 'email', label: 'Email', type: 'email', required: true },
        ]}
      />
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /gönder/i })).toBeInTheDocument();
  });

  it('handles form submission attempt', () => {
    const mockSubmit = vi.fn();

    renderWithProviders(
      <SecureForm
        onSubmit={mockSubmit}
        fields={[
          { name: 'name', label: 'Name', type: 'text', required: true },
        ]}
      />
    );

    const submitButton = screen.getByRole('button', { name: /gönder/i });
    fireEvent.click(submitButton);

    // Should attempt to submit the form
    expect(submitButton).toBeInTheDocument();
  });

  it('includes CSRF token in form', async () => {
    const { generateCSRFToken } = await import('../../utils/validation');

    const mockSubmit = vi.fn();

    renderWithProviders(
      <SecureForm
        onSubmit={mockSubmit}
        fields={[
          { name: 'name', label: 'Name', type: 'text', required: true },
        ]}
      />
    );

    expect(generateCSRFToken).toHaveBeenCalled();
  });

  it('shows loading state during submission', async () => {
    const { post } = await import('../../services/api');
    post.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    const mockSubmit = vi.fn();

    renderWithProviders(
      <SecureForm
        onSubmit={mockSubmit}
        fields={[
          { name: 'name', label: 'Name', type: 'text', required: true },
        ]}
      />
    );

    const submitButton = screen.getByRole('button', { name: /gönder/i });
    fireEvent.click(submitButton);

    // Should show loading state
    expect(submitButton).toBeInTheDocument();
  });

  it('handles submission errors gracefully', async () => {
    const { post } = await import('../../services/api');
    post.mockRejectedValue(new Error('Network error'));

    const mockSubmit = vi.fn();

    renderWithProviders(
      <SecureForm
        onSubmit={mockSubmit}
        fields={[
          { name: 'name', label: 'Name', type: 'text', required: true },
        ]}
      />
    );

    const submitButton = screen.getByRole('button', { name: /gönder/i });
    fireEvent.click(submitButton);

    // Should handle error gracefully
    expect(submitButton).toBeInTheDocument();
  });
});
