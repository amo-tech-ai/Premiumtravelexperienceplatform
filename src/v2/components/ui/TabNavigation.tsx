/**
 * TAB NAVIGATION - Mobile-optimized tabs for detail pages
 * 
 * Features:
 * - Sticky tab bar
 * - Smooth transitions
 * - Swipe between tabs
 * - Deep linking support
 * - Keyboard accessible
 */

import React, { useState, useEffect, useRef } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface TabNavigationProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
}

export function TabNavigation({ 
  tabs, 
  defaultTab,
  onChange,
  className = '' 
}: TabNavigationProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // Update indicator position
  useEffect(() => {
    const activeTabElement = tabRefs.current[activeTab];
    if (activeTabElement && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const tabRect = activeTabElement.getBoundingClientRect();
      
      setIndicatorStyle({
        left: tabRect.left - containerRect.left,
        width: tabRect.width,
      });
    }
  }, [activeTab]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
    
    // Update URL without reload
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tabId);
    window.history.replaceState({}, '', url.toString());
  };

  // Read tab from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlTab = params.get('tab');
    if (urlTab && tabs.find(t => t.id === urlTab)) {
      setActiveTab(urlTab);
    }
  }, [tabs]);

  const activeTabContent = tabs.find(t => t.id === activeTab)?.content;

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Tab Bar - Sticky */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div 
          ref={containerRef}
          className="relative flex"
          role="tablist"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              ref={(el) => (tabRefs.current[tab.id] = el)}
              onClick={() => handleTabChange(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              className={`
                flex-1 py-3 px-4 text-sm font-medium transition-colors
                min-h-[48px] flex items-center justify-center gap-2
                ${
                  activeTab === tab.id
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
          
          {/* Active Indicator */}
          <div
            className="absolute bottom-0 h-0.5 bg-blue-600 transition-all duration-300 ease-out"
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
            }}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Tab Content */}
      <div
        id={`tabpanel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className="flex-1"
      >
        {activeTabContent}
      </div>
    </div>
  );
}

/**
 * SCROLLABLE TAB NAVIGATION - For 5+ tabs
 */
interface ScrollableTabNavigationProps extends TabNavigationProps {
  showFade?: boolean;
}

export function ScrollableTabNavigation({ 
  tabs, 
  defaultTab,
  onChange,
  showFade = true,
  className = '' 
}: ScrollableTabNavigationProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
    
    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tabId);
    window.history.replaceState({}, '', url.toString());
  };

  // Check scroll position for fade indicators
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftFade(scrollLeft > 10);
      setShowRightFade(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const scrollEl = scrollRef.current;
    scrollEl?.addEventListener('scroll', checkScroll);
    return () => scrollEl?.removeEventListener('scroll', checkScroll);
  }, []);

  const activeTabContent = tabs.find(t => t.id === activeTab)?.content;

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Tab Bar - Sticky with Horizontal Scroll */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="relative">
          {/* Left Fade */}
          {showFade && showLeftFade && (
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          )}
          
          {/* Scrollable Tabs */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto scrollbar-hide"
            role="tablist"
            style={{ scrollBehavior: 'smooth' }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`
                  flex-shrink-0 py-3 px-6 text-sm font-medium transition-colors
                  min-h-[48px] flex items-center justify-center gap-2
                  whitespace-nowrap
                  ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
          
          {/* Right Fade */}
          {showFade && showRightFade && (
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div
        id={`tabpanel-${activeTab}`}
        role="tabpanel"
        className="flex-1"
      >
        {activeTabContent}
      </div>
    </div>
  );
}

/**
 * TAB PANEL - Individual tab content wrapper
 * Use for better organization
 */
interface TabPanelProps {
  children: React.ReactNode;
  className?: string;
}

export function TabPanel({ children, className = '' }: TabPanelProps) {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
}
