/**
 * ADD ITEM SHEET
 * 
 * Bottom sheet for adding activities to itinerary
 * Mobile-first with search and browse
 */

import { useState } from 'react';
import { useTripV2 } from '../../../context/TripV2Context';
import { ItineraryItemV2, ItemType } from '../../../types';
import { X, Search, Plus } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '../../../../components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';
import { Textarea } from '../../../../components/ui/textarea';

interface AddItemSheetProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  dayNumber: number;
}

export function AddItemSheet({ isOpen, onClose, tripId, dayNumber }: AddItemSheetProps) {
  const { addItineraryItem } = useTripV2();
  
  const [activeTab, setActiveTab] = useState<'search' | 'custom'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom activity form
  const [customForm, setCustomForm] = useState({
    type: 'activity' as ItemType,
    name: '',
    startTime: '',
    endTime: '',
    duration: 60,
    cost: 0,
    location: '',
    description: '',
    notes: '',
  });
  
  const handleAddCustom = () => {
    if (!customForm.name || !customForm.startTime) {
      return;
    }
    
    const newItem: ItineraryItemV2 = {
      id: `item-${Date.now()}`,
      type: customForm.type,
      name: customForm.name,
      description: customForm.description || undefined,
      startTime: customForm.startTime,
      endTime: customForm.endTime || undefined,
      duration: customForm.duration,
      location: customForm.location ? {
        address: customForm.location,
        neighborhood: '',
        coordinates: { lat: 0, lng: 0 },
      } : undefined,
      cost: customForm.cost,
      currency: 'USD',
      costType: 'per_person',
      bookingStatus: 'none',
      details: {},
      addedBy: 'user',
      createdAt: new Date().toISOString(),
      notes: customForm.notes || undefined,
    };
    
    addItineraryItem(dayNumber, newItem);
    
    // Reset form
    setCustomForm({
      type: 'activity',
      name: '',
      startTime: '',
      endTime: '',
      duration: 60,
      cost: 0,
      location: '',
      description: '',
      notes: '',
    });
    
    onClose();
  };
  
  // Mock browse items (would come from explore database)
  const browseItems = [
    {
      id: 'browse-1',
      name: 'Museo de Antioquia',
      type: 'attraction' as ItemType,
      cost: 10,
      duration: 120,
      location: 'Centro',
      rating: 4.6,
    },
    {
      id: 'browse-2',
      name: 'Café Pergamino',
      type: 'restaurant' as ItemType,
      cost: 15,
      duration: 60,
      location: 'El Poblado',
      rating: 4.7,
    },
    {
      id: 'browse-3',
      name: 'Comuna 13 Graffiti Tour',
      type: 'activity' as ItemType,
      cost: 25,
      duration: 180,
      location: 'Comuna 13',
      rating: 4.9,
    },
  ];
  
  const filteredBrowseItems = searchQuery
    ? browseItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : browseItems;
  
  const handleAddBrowseItem = (browseItem: typeof browseItems[0]) => {
    const newItem: ItineraryItemV2 = {
      id: `item-${Date.now()}`,
      type: browseItem.type,
      name: browseItem.name,
      startTime: '09:00', // Default time
      duration: browseItem.duration,
      location: {
        address: '',
        neighborhood: browseItem.location,
        coordinates: { lat: 0, lng: 0 },
      },
      cost: browseItem.cost,
      currency: 'USD',
      costType: 'per_person',
      bookingStatus: 'none',
      details: {
        rating: browseItem.rating,
      },
      addedBy: 'user',
      sourceId: browseItem.id,
      createdAt: new Date().toISOString(),
    };
    
    addItineraryItem(dayNumber, newItem);
    onClose();
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Activity</SheetTitle>
          <SheetDescription>
            Add an activity to Day {dayNumber}
          </SheetDescription>
        </SheetHeader>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">Search & Browse</TabsTrigger>
            <TabsTrigger value="custom">Custom Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="space-y-4 mt-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder="Search activities, restaurants, attractions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Browse Results */}
            <div className="space-y-3">
              {filteredBrowseItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-neutral-200 rounded-lg p-4 hover:border-neutral-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-neutral-600">{item.location}</p>
                    </div>
                    <Button
                      onClick={() => handleAddBrowseItem(item)}
                      size="sm"
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-neutral-600">
                    <span>⭐ {item.rating}</span>
                    <span>⏱️ {Math.floor(item.duration / 60)}h {item.duration % 60}m</span>
                    <span>💰 ${item.cost}</span>
                  </div>
                </div>
              ))}
              
              {filteredBrowseItems.length === 0 && (
                <div className="text-center py-12 text-neutral-600">
                  No activities found. Try a different search or create a custom activity.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4 mt-6">
            <div className="space-y-4">
              {/* Activity Type */}
              <div>
                <Label htmlFor="type">Activity Type</Label>
                <Select
                  value={customForm.type}
                  onValueChange={(v) => setCustomForm({ ...customForm, type: v as ItemType })}
                >
                  <SelectTrigger id="type" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activity">Activity</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="attraction">Attraction</SelectItem>
                    <SelectItem value="stay">Accommodation</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="custom">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Name */}
              <div>
                <Label htmlFor="name">Activity Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Lunch at Carmen"
                  value={customForm.name}
                  onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              
              {/* Times */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={customForm.startTime}
                    onChange={(e) => setCustomForm({ ...customForm, startTime: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={customForm.endTime}
                    onChange={(e) => setCustomForm({ ...customForm, endTime: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              
              {/* Duration & Cost */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={customForm.duration}
                    onChange={(e) => setCustomForm({ ...customForm, duration: parseInt(e.target.value) })}
                    className="mt-1"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="cost">Cost (USD)</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={customForm.cost}
                    onChange={(e) => setCustomForm({ ...customForm, cost: parseFloat(e.target.value) })}
                    className="mt-1"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              {/* Location */}
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., El Poblado"
                  value={customForm.location}
                  onChange={(e) => setCustomForm({ ...customForm, location: e.target.value })}
                  className="mt-1"
                />
              </div>
              
              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description..."
                  value={customForm.description}
                  onChange={(e) => setCustomForm({ ...customForm, description: e.target.value })}
                  className="mt-1"
                  rows={3}
                />
              </div>
              
              {/* Notes */}
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special notes..."
                  value={customForm.notes}
                  onChange={(e) => setCustomForm({ ...customForm, notes: e.target.value })}
                  className="mt-1"
                  rows={2}
                />
              </div>
              
              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button onClick={onClose} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddCustom}
                  disabled={!customForm.name || !customForm.startTime}
                  className="flex-1"
                >
                  Add Activity
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
