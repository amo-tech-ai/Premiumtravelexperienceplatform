/**
 * TRIP COMMAND CENTER PAGE V2 - MOBILE OPTIMIZED
 * 
 * Mobile-first redesign with:
 * - Primary CTA above the fold
 * - Progressive disclosure (accordions)
 * - Sticky actions
 * - Clear hierarchy
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useTripV2 } from '../context/TripV2Context';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users,
  DollarSign,
  Cloud,
  ChevronRight,
  ChevronDown,
  Edit,
  Share,
  Copy,
  Download,
  Trash2,
  MoreHorizontal
} from 'lucide-react';
import { TouchTargetButton } from '../components/mobile/TouchTarget';
import { StickyBottomCTA } from '../components/ui/StickyBottomCTA';
import { BottomSheet, BottomSheetList } from '../components/ui/BottomSheet';

interface AccordionSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export default function TripCommandCenterPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { state, setCurrentTrip } = useTripV2();
  
  const { currentTrip, currentItinerary, isLoading } = state;
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [showActions, setShowActions] = useState(false);
  
  useEffect(() => {
    if (tripId && (!currentTrip || currentTrip.id !== tripId)) {
      setCurrentTrip(tripId);
    }
  }, [tripId, currentTrip, setCurrentTrip]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading trip...</p>
        </div>
      </div>
    );
  }
  
  if (!currentTrip) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-600 mb-4">Trip not found</p>
          <TouchTargetButton
            variant="primary"
            size="md"
            onClick={() => navigate('/v2/trips')}
          >
            Back to Trips
          </TouchTargetButton>
        </div>
      </div>
    );
  }

  // Format dates
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateShort = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Calculate trip stats
  const days = Math.ceil(
    (new Date(currentTrip.endDate).getTime() - new Date(currentTrip.startDate).getTime()) /
    (1000 * 60 * 60 * 24)
  );

  const totalItems = currentItinerary?.days?.reduce(
    (sum, day) => sum + (day.items?.length || 0), 0
  ) || 0;

  const plannedDays = currentItinerary?.days?.filter(
    day => day.items && day.items.length > 0
  ).length || 0;

  const progress = days > 0 ? Math.round((plannedDays / days) * 100) : 0;

  const spentBudget = currentTrip.budget.spent || 0;
  const totalBudget = currentTrip.budget.total;
  const budgetProgress = totalBudget > 0 ? Math.round((spentBudget / totalBudget) * 100) : 0;

  // Mock weather (in production, fetch from API)
  const weather = {
    condition: 'Sunny',
    temp: 75,
    icon: '☀️',
  };

  // Action menu items
  const actionItems = [
    {
      icon: <Edit className="w-5 h-5" />,
      label: 'Edit Trip Details',
      onClick: () => {
        setShowActions(false);
        // TODO: Navigate to edit
      },
    },
    {
      icon: <Share className="w-5 h-5" />,
      label: 'Share Trip',
      onClick: () => {
        setShowActions(false);
        // TODO: Implement share
      },
    },
    {
      icon: <Copy className="w-5 h-5" />,
      label: 'Duplicate Trip',
      onClick: () => {
        setShowActions(false);
        // TODO: Implement duplicate
      },
    },
    {
      icon: <Download className="w-5 h-5" />,
      label: 'Export to PDF',
      onClick: () => {
        setShowActions(false);
        // TODO: Implement export
      },
    },
    {
      icon: <Trash2 className="w-5 h-5" />,
      label: 'Delete Trip',
      onClick: () => {
        setShowActions(false);
        if (confirm('Are you sure you want to delete this trip?')) {
          // TODO: Implement delete
          navigate('/v2/trips');
        }
      },
      destructive: true,
    },
  ];

  // Accordion sections
  const sections: AccordionSection[] = [
    {
      id: 'travelers',
      title: 'Travelers',
      icon: <Users className="w-5 h-5" />,
      content: (
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">You</p>
              <p className="text-sm text-gray-600">Organizer</p>
            </div>
          </div>
          {currentTrip.travelers.adults > 1 && (
            <div className="text-sm text-gray-600">
              + {currentTrip.travelers.adults - 1} more {currentTrip.travelers.adults === 2 ? 'adult' : 'adults'}
            </div>
          )}
          {currentTrip.travelers.children > 0 && (
            <div className="text-sm text-gray-600">
              + {currentTrip.travelers.children} {currentTrip.travelers.children === 1 ? 'child' : 'children'}
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'details',
      title: 'Trip Details',
      icon: <MapPin className="w-5 h-5" />,
      content: (
        <div className="p-4 space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Travel Style</p>
            <p className="font-medium text-gray-900 capitalize">{currentTrip.style}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Pace</p>
            <p className="font-medium text-gray-900 capitalize">{currentTrip.pace}</p>
          </div>
          {currentTrip.interests && currentTrip.interests.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Interests</p>
              <div className="flex flex-wrap gap-2">
                {currentTrip.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-24">
      {/* Header - Sticky */}
      <div className="sticky top-0 z-30 bg-white border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <TouchTargetButton
              variant="ghost"
              size="md"
              onClick={() => navigate('/v2/trips')}
              aria-label="Back to trips"
              className="gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </TouchTargetButton>
            
            <h1 className="text-lg font-semibold text-gray-900 truncate mx-4">
              {currentTrip.destination.city}
            </h1>
            
            <TouchTargetButton
              variant="ghost"
              size="md"
              onClick={() => setShowActions(true)}
              aria-label="More actions"
            >
              <MoreHorizontal className="w-5 h-5" />
            </TouchTargetButton>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Trip Title & Dates */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {currentTrip.destination.city}, {currentTrip.destination.country}
          </h2>
          <p className="text-base text-gray-600">
            {formatDateShort(currentTrip.startDate)} - {formatDateShort(currentTrip.endDate)}
          </p>
        </div>

        {/* Primary CTA - Above the fold */}
        <TouchTargetButton
          variant="primary"
          size="lg"
          onClick={() => navigate(`/v2/trips/${tripId}/itinerary`)}
          className="w-full gap-2"
        >
          <Calendar className="w-5 h-5" />
          View Itinerary
        </TouchTargetButton>

        {/* Weather Chip */}
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
          <span className="text-2xl">{weather.icon}</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900">
              {weather.condition}, {weather.temp}°F
            </p>
            <p className="text-xs text-blue-700">Good trip weather expected</p>
          </div>
        </div>

        {/* Stats - Vertical Stack */}
        <div className="space-y-3">
          {/* Duration */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Duration</p>
                <p className="text-xl font-semibold text-gray-900">{days} days</p>
              </div>
            </div>
          </div>

          {/* Budget */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Budget</p>
                <p className="text-xl font-semibold text-gray-900">
                  ${spentBudget.toLocaleString()} of ${totalBudget.toLocaleString()}
                </p>
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  budgetProgress > 90 ? 'bg-red-500' : budgetProgress > 70 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(budgetProgress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-2">{budgetProgress}% used</p>
          </div>

          {/* Activities */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Activities</p>
                <p className="text-xl font-semibold text-gray-900">{totalItems} planned</p>
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-2">{progress}% of days planned</p>
          </div>
        </div>

        {/* Quick Actions Button */}
        <TouchTargetButton
          variant="secondary"
          size="lg"
          onClick={() => setShowActions(true)}
          className="w-full"
        >
          More Actions
        </TouchTargetButton>

        {/* Accordion Sections */}
        <div className="space-y-2">
          {sections.map((section) => {
            const isExpanded = expandedSections.includes(section.id);
            return (
              <div key={section.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-gray-600">{section.icon}</div>
                    <span className="font-medium text-gray-900">{section.title}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {isExpanded && (
                  <div className="border-t border-gray-200">
                    {section.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions Bottom Sheet */}
      <BottomSheet
        isOpen={showActions}
        onClose={() => setShowActions(false)}
        title="Trip Actions"
        height="auto"
      >
        <BottomSheetList 
          items={actionItems}
          onItemClick={() => setShowActions(false)}
        />
      </BottomSheet>

      {/* Floating Action Button - Mobile Only */}
      <div className="md:hidden">
        <StickyBottomCTA
          label="View Itinerary"
          onClick={() => navigate(`/v2/trips/${tripId}/itinerary`)}
          icon={<Calendar className="w-5 h-5" />}
          showOnScroll={true}
          scrollThreshold={300}
        />
      </div>
    </div>
  );
}