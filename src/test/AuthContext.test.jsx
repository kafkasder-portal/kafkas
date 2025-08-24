import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

// Mock Supabase
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
  },
  testSupabaseConnection: vi.fn(),
}));

// Mock toast notifications
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Test component to use the AuthContext
const TestComponent = () => {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (isAuthenticated) return <div>Authenticated: {user?.email}</div>;
  return <div>Not authenticated</div>;
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide authentication context', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Should show loading initially
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should handle development mode auto-login', async () => {
    // Mock development environment
    vi.stubEnv('DEV', true);
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for auto-login in development mode
    await waitFor(() => {
      expect(screen.getByText(/Authenticated:/)).toBeInTheDocument();
    });
  });

  it('should provide login function', () => {
    let authContext;
    
    const TestHook = () => {
      authContext = useAuth();
      return null;
    };

    render(
      <AuthProvider>
        <TestHook />
      </AuthProvider>
    );

    expect(typeof authContext.login).toBe('function');
    expect(typeof authContext.logout).toBe('function');
    expect(typeof authContext.hasPermission).toBe('function');
    expect(typeof authContext.hasRole).toBe('function');
  });
});