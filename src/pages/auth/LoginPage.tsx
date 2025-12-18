import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Login Page - Placeholder
 * TODO: Implement full authentication
 */

// TEMPORARY: Dev mode auto-redirect
const DEV_MODE = true;

export function LoginPage() {
  const navigate = useNavigate();

  // DEV MODE: Auto-redirect to dashboard
  useEffect(() => {
    if (DEV_MODE) {
      navigate('/trip/trip-123');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="mb-4">Log In</h1>
        <p className="text-gray-600 mb-6">Login page coming soon...</p>
        <Link 
          to="/signup" 
          className="text-blue-600 hover:text-blue-700"
        >
          Don't have an account? Sign up
        </Link>
      </div>
    </div>
  );
}