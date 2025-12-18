import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TripProvider } from './context/TripContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Auth Screens
import { LandingPage } from './pages/LandingPage';
import { SignupPage } from './pages/auth/SignupPage';
import { LoginPage } from './pages/auth/LoginPage';

// Trip Screens
import { TripDashboard } from './pages/trip/TripDashboard';
import { TripWizard } from './pages/trip/TripWizard';
import { TimelineView } from './pages/trip/TimelineView';

// Feature Screens - Dining
import { DiningHub } from './pages/dining/DiningHub';
import { RestaurantDetail } from './pages/dining/RestaurantDetail';

// Feature Screens - Optimizer
import { OptimizerDashboard } from './pages/optimizer/OptimizerDashboard';

// Feature Screens - Bookings
import { BookingsHub } from './pages/bookings/BookingsHub';

// Feature Screens - Events
import { EventsHub } from './pages/events/EventsHub';
import { EventDetail } from './pages/events/EventDetail';

// Feature Screens - Insider
import { InsiderFeed } from './pages/insider/InsiderFeed';
import { InsiderPlaceDetail } from './pages/insider/InsiderPlaceDetail';

// Feature Screens - Budget
import { BudgetDashboard } from './pages/budget/BudgetDashboard';

// Account Screens
import { AccountSettings } from './pages/account/AccountSettings';

/**
 * Main Application Component
 * Implements routing and global providers for Trip Operating System
 */
export default function App() {
  return (
    <Router>
      <AuthProvider>
        <TripProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes - Trip Creation */}
            <Route
              path="/trip/new"
              element={
                <ProtectedRoute>
                  <TripWizard />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - Trip Dashboard */}
            <Route
              path="/trip/:tripId"
              element={
                <ProtectedRoute>
                  <TripDashboard />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - Timeline */}
            <Route
              path="/trip/:tripId/timeline"
              element={
                <ProtectedRoute>
                  <TimelineView />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - Dining Agent */}
            <Route
              path="/trip/:tripId/dining"
              element={
                <ProtectedRoute>
                  <DiningHub />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trip/:tripId/dining/:placeId"
              element={
                <ProtectedRoute>
                  <RestaurantDetail />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - Optimizer Agent */}
            <Route
              path="/trip/:tripId/optimizer"
              element={
                <ProtectedRoute>
                  <OptimizerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - Booking Agent */}
            <Route
              path="/trip/:tripId/bookings"
              element={
                <ProtectedRoute>
                  <BookingsHub />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - Event Curator */}
            <Route
              path="/trip/:tripId/events"
              element={
                <ProtectedRoute>
                  <EventsHub />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trip/:tripId/events/:eventId"
              element={
                <ProtectedRoute>
                  <EventDetail />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - Local Insider */}
            <Route
              path="/trip/:tripId/insider"
              element={
                <ProtectedRoute>
                  <InsiderFeed />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trip/:tripId/insider/:placeId"
              element={
                <ProtectedRoute>
                  <InsiderPlaceDetail />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - Budget Guardian */}
            <Route
              path="/trip/:tripId/budget"
              element={
                <ProtectedRoute>
                  <BudgetDashboard />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - Account */}
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <AccountSettings />
                </ProtectedRoute>
              }
            />

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </TripProvider>
      </AuthProvider>
    </Router>
  );
}
