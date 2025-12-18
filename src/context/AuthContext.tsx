import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Auth Context - Supabase Authentication Management
 * Provides authentication state and methods to all components
 * 
 * DEV MODE: Mock user enabled for development
 */

// Types
interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  subscription_tier: 'free' | 'scout' | 'concierge';
}

// TEMPORARY: Mock user for development
const DEV_MODE = true;
const MOCK_USER: User = {
  id: 'dev-user-123',
  email: 'dev@localscout.com',
  full_name: 'Dev User',
  subscription_tier: 'concierge',
};

interface AuthContextType {
  user: User | null;
  session: any | null;
  loading: boolean;
  
  // Actions
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider Component
 * Wraps application with authentication state
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    // DEV MODE: Use mock user
    if (DEV_MODE) {
      setUser(MOCK_USER);
      setSession({ user: MOCK_USER });
      setLoading(false);
      return;
    }
    
    // TODO: Replace with Supabase auth listener
    // For now, just set loading to false since no backend exists yet
    setLoading(false);
    
    // Listen for auth state changes
    const handleAuthChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.session) {
        setSession(customEvent.detail.session);
        setUser(customEvent.detail.user);
      } else {
        setSession(null);
        setUser(null);
      }
    };

    window.addEventListener('auth-state-change', handleAuthChange);
    
    return () => {
      window.removeEventListener('auth-state-change', handleAuthChange);
    };
  }, []);

  // Check current user session
  const checkUser = async () => {
    setLoading(true);
    
    try {
      // TODO: Replace with Supabase getSession()
      // For now, just return empty since no backend
      console.log('Auth check - backend not connected yet');
    } catch (err) {
      console.error('Error checking session:', err);
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      // TODO: Replace with Supabase signUp()
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name: fullName }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Signup failed');
      }

      const data = await response.json();
      setSession(data.session);
      setUser(data.user);

      // Emit event
      window.dispatchEvent(new CustomEvent('auth-state-change', { detail: data }));
    } catch (err) {
      console.error('Signup error:', err);
      throw err;
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      // TODO: Replace with Supabase signInWithPassword()
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      setSession(data.session);
      setUser(data.user);

      // Emit event
      window.dispatchEvent(new CustomEvent('auth-state-change', { detail: data }));
    } catch (err) {
      console.error('Signin error:', err);
      throw err;
    }
  };

  // Sign in with Google OAuth
  const signInWithGoogle = async () => {
    try {
      // TODO: Replace with Supabase signInWithOAuth({ provider: 'google' })
      window.location.href = '/api/auth/google';
    } catch (err) {
      console.error('Google signin error:', err);
      throw err;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      // TODO: Replace with Supabase signOut()
      await fetch('/api/auth/signout', { method: 'POST' });
      
      setSession(null);
      setUser(null);

      // Emit event
      window.dispatchEvent(new CustomEvent('auth-state-change', { detail: {} }));
    } catch (err) {
      console.error('Signout error:', err);
      throw err;
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      // TODO: Replace with Supabase resetPasswordForEmail()
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send reset email');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      throw err;
    }
  };

  // Update user profile
  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      // TODO: Replace with Supabase updateUser()
      const response = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updated = await response.json();
      setUser(updated);
    } catch (err) {
      console.error('Update profile error:', err);
      throw err;
    }
  };

  const contextValue: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use Auth Context
 * Throws error if used outside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

/**
 * Hook to require authentication
 * Redirects to login if not authenticated
 */
export function useRequireAuth() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);

  return { user, loading };
}