import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Signup Page - Placeholder
 * TODO: Implement full signup flow per /docs/features/prompts/auth-flow.md
 */
export function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-4">Sign Up</h1>
        <p className="mb-4 text-gray-600">Signup page coming soon...</p>
        <Link to="/login" className="text-blue-600 hover:underline">
          Already have an account? Log in
        </Link>
      </div>
    </div>
  );
}
