import React, { useState } from 'react';
import { Luggage, Ticket, UtensilsCrossed, Home, Map as MapIcon } from 'lucide-react';
import { TabNavigation, TabPanel, CompactTabNavigation, TabConfig, TabId } from '../components/chatbot/TabNavigation';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';

export default function TabNavigationDemo() {
  const [activeTab, setActiveTab] = useState<TabId>('restaurants');
  const [compactTab, setCompactTab] = useState<TabId>('trips');
  const [loadingState, setLoadingState] = useState(false);

  // Tab configuration
  const tabs: TabConfig[] = [
    { id: 'trips', label: 'Trips', icon: Luggage, badge: 2 },
    { id: 'events', label: 'Events', icon: Ticket, badge: 4 },
    { id: 'restaurants', label: 'Restaurants', icon: UtensilsCrossed, badge: 12 },
    { id: 'rentals', label: 'Rentals', icon: Home, badge: 1 },
    { id: 'map', label: 'Map', icon: MapIcon, badge: 0 }
  ];

  const tabsNoBadges: TabConfig[] = [
    { id: 'trips', label: 'Trips', icon: Luggage },
    { id: 'events', label: 'Events', icon: Ticket },
    { id: 'restaurants', label: 'Restaurants', icon: UtensilsCrossed },
    { id: 'rentals', label: 'Rentals', icon: Home },
    { id: 'map', label: 'Map', icon: MapIcon }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-slate-900 mb-2">Tab Navigation Component</h1>
          <p className="text-slate-600">
            Multi-domain chatbot tab navigation with badges, states, and responsive behavior
          </p>
        </div>

        {/* Demo 1: Full Tab Navigation with Badges */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-slate-900">Full Tab Navigation</h2>
              <p className="text-sm text-slate-600">Desktop view with labels and badges</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLoadingState(!loadingState)}
            >
              {loadingState ? 'Hide' : 'Show'} Loading State
            </Button>
          </div>
          
          <Card className="overflow-hidden">
            <TabNavigation
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              loading={loadingState}
            />
            
            <div className="p-6">
              <TabPanel id="trips" isActive={activeTab === 'trips'}>
                <div className="space-y-3">
                  <h3 className="font-medium text-slate-900">Trips Content</h3>
                  <p className="text-sm text-slate-600">
                    This is the Trips tab panel. It shows trip plans and suggestions.
                  </p>
                  <div className="h-32 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                    Trips content area
                  </div>
                </div>
              </TabPanel>

              <TabPanel id="events" isActive={activeTab === 'events'}>
                <div className="space-y-3">
                  <h3 className="font-medium text-slate-900">Events Content</h3>
                  <p className="text-sm text-slate-600">
                    This is the Events tab panel. It shows upcoming events and activities.
                  </p>
                  <div className="h-32 bg-purple-100 rounded-lg flex items-center justify-center text-purple-700">
                    Events content area
                  </div>
                </div>
              </TabPanel>

              <TabPanel id="restaurants" isActive={activeTab === 'restaurants'}>
                <div className="space-y-3">
                  <h3 className="font-medium text-slate-900">Restaurants Content</h3>
                  <p className="text-sm text-slate-600">
                    This is the Restaurants tab panel. It shows dining recommendations.
                  </p>
                  <div className="h-32 bg-orange-100 rounded-lg flex items-center justify-center text-orange-700">
                    Restaurants content area
                  </div>
                </div>
              </TabPanel>

              <TabPanel id="rentals" isActive={activeTab === 'rentals'}>
                <div className="space-y-3">
                  <h3 className="font-medium text-slate-900">Rentals Content</h3>
                  <p className="text-sm text-slate-600">
                    This is the Rentals tab panel. It shows property and vehicle rentals.
                  </p>
                  <div className="h-32 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700">
                    Rentals content area
                  </div>
                </div>
              </TabPanel>

              <TabPanel id="map" isActive={activeTab === 'map'}>
                <div className="space-y-3">
                  <h3 className="font-medium text-slate-900">Map Content</h3>
                  <p className="text-sm text-slate-600">
                    This is the Map tab panel. It shows all results on a unified map.
                  </p>
                  <div className="h-32 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700">
                    Map content area
                  </div>
                </div>
              </TabPanel>
            </div>
          </Card>
        </section>

        {/* Demo 2: Tab Navigation without Badges */}
        <section className="space-y-4">
          <div>
            <h2 className="text-slate-900">Without Badge Counts</h2>
            <p className="text-sm text-slate-600">Clean tab bar without result counters</p>
          </div>
          
          <Card className="overflow-hidden">
            <TabNavigation
              tabs={tabsNoBadges}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            <div className="p-6 bg-slate-50">
              <p className="text-sm text-slate-600">
                Active tab: <span className="font-medium text-slate-900">{activeTab}</span>
              </p>
            </div>
          </Card>
        </section>

        {/* Demo 3: Compact Icon-Only Navigation */}
        <section className="space-y-4">
          <div>
            <h2 className="text-slate-900">Compact Icon-Only Navigation</h2>
            <p className="text-sm text-slate-600">Space-efficient variant for sidebars or mobile</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Horizontal Compact */}
            <Card className="p-6">
              <h3 className="text-sm font-medium text-slate-900 mb-4">Horizontal Orientation</h3>
              <CompactTabNavigation
                tabs={tabs}
                activeTab={compactTab}
                onTabChange={setCompactTab}
                orientation="horizontal"
                className="justify-center"
              />
              <p className="text-sm text-slate-600 mt-4">
                Active: <span className="font-medium">{compactTab}</span>
              </p>
            </Card>

            {/* Vertical Compact */}
            <Card className="p-6">
              <h3 className="text-sm font-medium text-slate-900 mb-4">Vertical Orientation</h3>
              <CompactTabNavigation
                tabs={tabs}
                activeTab={compactTab}
                onTabChange={setCompactTab}
                orientation="vertical"
              />
              <p className="text-sm text-slate-600 mt-4">
                Active: <span className="font-medium">{compactTab}</span>
              </p>
            </Card>
          </div>
        </section>

        {/* Demo 4: Mobile View Simulation */}
        <section className="space-y-4">
          <div>
            <h2 className="text-slate-900">Mobile Responsive Behavior</h2>
            <p className="text-sm text-slate-600">Resize browser to see mobile behavior (icons only, horizontal scroll)</p>
          </div>
          
          <Card className="overflow-hidden">
            <div className="w-full max-w-[390px] mx-auto border-4 border-slate-300 rounded-2xl overflow-hidden">
              <div className="bg-slate-900 text-white text-center py-1 text-xs">
                iPhone 13 Pro (390px)
              </div>
              <TabNavigation
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
              <div className="p-4 bg-white h-64 flex items-center justify-center text-slate-500">
                Mobile content area
              </div>
            </div>
          </Card>
        </section>

        {/* Demo 5: All Badge Variants */}
        <section className="space-y-4">
          <div>
            <h2 className="text-slate-900">Badge Variants</h2>
            <p className="text-sm text-slate-600">Different badge counts including edge cases</p>
          </div>
          
          <div className="grid gap-4">
            {/* Zero badges */}
            <Card className="overflow-hidden">
              <TabNavigation
                tabs={[
                  { id: 'trips', label: 'Trips', icon: Luggage, badge: 0 },
                  { id: 'events', label: 'Events', icon: Ticket, badge: 0 },
                  { id: 'restaurants', label: 'Restaurants', icon: UtensilsCrossed, badge: 0 },
                ]}
                activeTab="trips"
                onTabChange={setActiveTab}
              />
              <div className="p-4 bg-slate-50 text-sm text-slate-600">
                Zero badges (badges hidden when count is 0)
              </div>
            </Card>

            {/* High badge counts */}
            <Card className="overflow-hidden">
              <TabNavigation
                tabs={[
                  { id: 'trips', label: 'Trips', icon: Luggage, badge: 8 },
                  { id: 'events', label: 'Events', icon: Ticket, badge: 42 },
                  { id: 'restaurants', label: 'Restaurants', icon: UtensilsCrossed, badge: 156 },
                ]}
                activeTab="events"
                onTabChange={setActiveTab}
              />
              <div className="p-4 bg-slate-50 text-sm text-slate-600">
                High badge counts (shows "99+" for counts over 99)
              </div>
            </Card>
          </div>
        </section>

        {/* Technical Specs */}
        <section className="space-y-4">
          <div>
            <h2 className="text-slate-900">Technical Specifications</h2>
          </div>
          
          <Card className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-slate-900 mb-3">Design Specs</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-slate-600">Mobile Height:</dt>
                    <dd className="font-medium text-slate-900">48px</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-600">Desktop Height:</dt>
                    <dd className="font-medium text-slate-900">56px</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-600">Icon Size:</dt>
                    <dd className="font-medium text-slate-900">20px (w-5 h-5)</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-600">Badge Height:</dt>
                    <dd className="font-medium text-slate-900">20px (h-5)</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-600">Active Color:</dt>
                    <dd className="font-medium text-emerald-600">Emerald 600</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-900 mb-3">Features</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-0.5">✓</span>
                    <span>Horizontal scroll on mobile</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-0.5">✓</span>
                    <span>Labels hidden on mobile, shown on tablet+</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-0.5">✓</span>
                    <span>Badges always visible when count &gt; 0</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-0.5">✓</span>
                    <span>Active indicator dot on mobile</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-0.5">✓</span>
                    <span>Focus states for accessibility</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-0.5">✓</span>
                    <span>Loading skeleton state</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-0.5">✓</span>
                    <span>ARIA labels for screen readers</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </section>

        {/* Usage Example */}
        <section className="space-y-4">
          <div>
            <h2 className="text-slate-900">Usage Example</h2>
          </div>
          
          <Card className="p-6 bg-slate-900 text-slate-100">
            <pre className="text-xs overflow-x-auto">
{`import { TabNavigation, TabPanel } from '@/components/chatbot/TabNavigation';
import { Luggage, Ticket, UtensilsCrossed, Home, Map } from 'lucide-react';

const tabs = [
  { id: 'trips', label: 'Trips', icon: Luggage, badge: 2 },
  { id: 'events', label: 'Events', icon: Ticket, badge: 4 },
  { id: 'restaurants', label: 'Restaurants', icon: UtensilsCrossed, badge: 12 },
  { id: 'rentals', label: 'Rentals', icon: Home, badge: 1 },
  { id: 'map', label: 'Map', icon: Map, badge: 0 }
];

function ChatbotUI() {
  const [activeTab, setActiveTab] = useState('restaurants');

  return (
    <div>
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <TabPanel id="restaurants" isActive={activeTab === 'restaurants'}>
        {/* Restaurant content */}
      </TabPanel>
    </div>
  );
}`}
            </pre>
          </Card>
        </section>
      </div>
    </div>
  );
}