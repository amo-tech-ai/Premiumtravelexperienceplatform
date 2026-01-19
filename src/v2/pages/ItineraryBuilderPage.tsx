/**
 * ITINERARY BUILDER PAGE V2
 * 
 * Day-by-day itinerary planning interface
 * Mobile-first with bottom sheets
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useTripV2 } from '../context/TripV2Context';
import { useAIV2 } from '../context/AIV2Context';
import { ArrowLeft, Plus, Calendar, DollarSign, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { DayAccordion } from '../components/trips/itinerary/DayAccordion';
import { AddItemSheet } from '../components/trips/itinerary/AddItemSheet';
import { AIConciergePanel } from '../components/ai/AIConciergePanel';
import { AIFloatingButton } from '../components/ai/AIFloatingButton';

export default function ItineraryBuilderPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { state } = useTripV2();
  const { openPanel } = useAIV2();
  
  const { currentTrip, currentItinerary } = state;
  
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'timeline' | 'list'>('timeline');
  
  if (!currentTrip || !currentItinerary) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <p className="text-neutral-600">Loading itinerary...</p>
      </div>
    );
  }
  
  // Calculate totals
  const totalItems = currentItinerary.days.reduce((sum, day) => sum + day.items.length, 0);
  const totalCost = currentItinerary.days.reduce((sum, day) => sum + day.totalCost, 0);
  const totalDuration = currentItinerary.days.reduce((sum, day) => sum + day.totalDuration, 0);
  const plannedDays = currentItinerary.days.filter(day => day.items.length > 0).length;
  
  // Detect conflicts (simplified)
  const hasConflicts = currentItinerary.days.some(day => {
    // Check for overlapping times
    const sortedItems = [...day.items].sort((a, b) => 
      a.startTime.localeCompare(b.startTime)
    );
    for (let i = 0; i < sortedItems.length - 1; i++) {
      const current = sortedItems[i];
      const next = sortedItems[i + 1];
      if (current.endTime && current.endTime > next.startTime) {
        return true;
      }
    }
    return false;
  });
  
  const handleBack = () => {
    navigate(`/v2/trips/${tripId}`);
  };
  
  const handleAddItem = (dayNumber?: number) => {
    if (dayNumber) {
      setSelectedDay(dayNumber);
    }
    setIsAddItemOpen(true);
  };
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const selectedDayData = currentItinerary.days.find(d => d.dayNumber === selectedDay);
  
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Trip</span>
          </button>
          
          {/* Title & Stats */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl mb-2">Itinerary Builder</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{plannedDays} / {currentTrip.duration} days planned</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{totalItems} activities</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span>${totalCost.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <Button onClick={() => handleAddItem()} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Activity
            </Button>
          </div>
          
          {/* Alerts */}
          {hasConflicts && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                You have time conflicts in your itinerary. Review overlapping activities.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Day Selector (Desktop) */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-lg border border-neutral-200 p-4 sticky top-24">
              <h3 className="font-medium mb-4">Days</h3>
              <div className="space-y-2">
                {currentItinerary.days.map((day) => (
                  <button
                    key={day.dayNumber}
                    onClick={() => setSelectedDay(day.dayNumber)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedDay === day.dayNumber
                        ? 'bg-neutral-900 text-white'
                        : 'hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">
                          Day {day.dayNumber}
                        </div>
                        <div className="text-xs opacity-75">
                          {formatDate(day.date)}
                        </div>
                      </div>
                      {day.items.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {day.items.length}
                        </Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Mobile Day Tabs */}
            <div className="lg:hidden mb-4">
              <Tabs value={selectedDay.toString()} onValueChange={(v) => setSelectedDay(parseInt(v))}>
                <TabsList className="w-full overflow-x-auto">
                  {currentItinerary.days.map((day) => (
                    <TabsTrigger key={day.dayNumber} value={day.dayNumber.toString()}>
                      Day {day.dayNumber}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl">
                  Day {selectedDay}
                  {selectedDayData?.title && ` — ${selectedDayData.title}`}
                </h2>
                <p className="text-sm text-neutral-600">
                  {selectedDayData && formatDate(selectedDayData.date)}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'timeline' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('timeline')}
                >
                  Timeline
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  List
                </Button>
              </div>
            </div>
            
            {/* Day Content */}
            {selectedDayData && (
              <DayAccordion
                day={selectedDayData}
                viewMode={viewMode}
                onAddItem={() => handleAddItem(selectedDay)}
              />
            )}
            
            {/* All Days View (Desktop) */}
            <div className="hidden xl:block mt-8">
              <h2 className="text-xl mb-4">All Days</h2>
              <div className="space-y-4">
                {currentItinerary.days.map((day) => (
                  <DayAccordion
                    key={day.dayNumber}
                    day={day}
                    viewMode="list"
                    onAddItem={() => handleAddItem(day.dayNumber)}
                    collapsed
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Item Sheet */}
      <AddItemSheet
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        tripId={currentTrip.id}
        dayNumber={selectedDay}
      />
      
      {/* AI Concierge Panel */}
      <AIConciergePanel />
      
      {/* AI Floating Button */}
      <AIFloatingButton />
    </div>
  );
}