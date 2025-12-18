import React from 'react';
import { useTripFromParams } from '../../context/TripContext';

/**
 * Trip Dashboard - Placeholder
 * TODO: Implement full trip dashboard
 */
export function TripDashboard() {
  const { currentTrip, loading } = useTripFromParams();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading trip...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="mb-4">Trip Dashboard</h1>
        {currentTrip ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="mb-2">{currentTrip.title}</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>Destination:</strong> {currentTrip.destination_city}, {currentTrip.destination_country}</p>
              <p><strong>Dates:</strong> {currentTrip.start_date} to {currentTrip.end_date}</p>
              <p><strong>Budget:</strong> ${currentTrip.total_budget} {currentTrip.currency}</p>
              <p><strong>Status:</strong> {currentTrip.status}</p>
            </div>
            <div className="mt-6">
              <p className="text-gray-600">Full dashboard coming soon...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600">No trip data available</p>
          </div>
        )}
      </div>
    </div>
  );
}