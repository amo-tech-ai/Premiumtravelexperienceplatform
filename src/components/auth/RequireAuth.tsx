import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface RequireAuthProps {
  children: React.ReactNode;
}

/**
 * RequireAuth Component
 * 
 * Protects routes that require authentication.
 * Redirects to /login if user is not authenticated.
 * Preserves the intended destination in location state for redirect after login.
 */
export function RequireAuth({ children }: RequireAuthProps) {
  const location = useLocation();
  
  // TODO: Replace with actual auth check from your auth context/hook
  // For now, we'll simulate authentication
  const isAuthenticated = true; // Replace with: useAuth().isAuthenticated or similar
  
  if (!isAuthenticated) {
    // Redirect to login, preserving the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
}
