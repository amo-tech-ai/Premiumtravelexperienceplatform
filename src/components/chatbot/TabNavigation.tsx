import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Badge } from '../ui/badge';
import { cn } from '../ui/utils';
import { Skeleton } from '../ui/skeleton';

export type TabId = 'trips' | 'events' | 'restaurants' | 'rentals' | 'map';

export interface TabConfig {
  id: TabId;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

interface TabNavigationProps {
  tabs: TabConfig[];
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
  loading?: boolean;
  className?: string;
}

export function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
  loading = false,
  className
}: TabNavigationProps) {
  if (loading) {
    return (
      <div className={cn("bg-white border-b border-slate-200", className)}>
        <div className="flex gap-1 px-4">
          {tabs.map(tab => (
            <div key={tab.id} className="px-4 py-3">
              <Skeleton className="h-6 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <nav 
      className={cn("bg-white border-b border-slate-200", className)}
      role="tablist"
      aria-label="Chatbot result tabs"
    >
      <div className="flex gap-1 overflow-x-auto scrollbar-hide px-2 sm:px-4">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-3 sm:px-4 py-3 border-b-2 transition-all whitespace-nowrap min-w-fit",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
                "hover:bg-slate-50/50",
                isActive
                  ? "border-emerald-600 text-emerald-700"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-200"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 shrink-0",
                isActive ? "text-emerald-600" : "text-slate-500"
              )} />
              
              {/* Label - hidden on mobile for space, shown on tablet+ */}
              <span className={cn(
                "font-medium text-sm hidden sm:inline",
                isActive ? "text-emerald-700" : "text-slate-700"
              )}>
                {tab.label}
              </span>

              {/* Badge - always visible if count > 0 */}
              {tab.badge !== undefined && tab.badge > 0 && (
                <Badge 
                  variant={isActive ? "default" : "secondary"} 
                  className={cn(
                    "text-xs h-5 min-w-5 px-1.5 flex items-center justify-center",
                    isActive 
                      ? "bg-emerald-600 hover:bg-emerald-600 text-white" 
                      : "bg-slate-200 text-slate-700 hover:bg-slate-200"
                  )}
                >
                  {tab.badge > 99 ? '99+' : tab.badge}
                </Badge>
              )}

              {/* Active indicator dot - mobile only */}
              {isActive && (
                <span className="sm:hidden w-1.5 h-1.5 rounded-full bg-emerald-600" />
              )}
            </button>
          );
        })}
      </div>

      {/* Subtle gradient fade on horizontal scroll */}
      <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none sm:hidden" />
    </nav>
  );
}

// Individual Tab Button Component (for more granular control if needed)
interface TabButtonProps {
  id: TabId;
  label: string;
  icon: LucideIcon;
  badge?: number;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function TabButton({
  id,
  label,
  icon: Icon,
  badge,
  isActive,
  onClick,
  disabled = false
}: TabButtonProps) {
  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${id}`}
      id={`tab-${id}`}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center gap-2 px-3 sm:px-4 py-3 border-b-2 transition-all whitespace-nowrap min-w-fit",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        !disabled && "hover:bg-slate-50/50",
        isActive
          ? "border-emerald-600 text-emerald-700"
          : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-200"
      )}
    >
      <Icon className={cn(
        "w-5 h-5 shrink-0",
        isActive ? "text-emerald-600" : "text-slate-500"
      )} />
      
      <span className={cn(
        "font-medium text-sm hidden sm:inline",
        isActive ? "text-emerald-700" : "text-slate-700"
      )}>
        {label}
      </span>

      {badge !== undefined && badge > 0 && (
        <Badge 
          variant={isActive ? "default" : "secondary"} 
          className={cn(
            "text-xs h-5 min-w-5 px-1.5 flex items-center justify-center",
            isActive 
              ? "bg-emerald-600 hover:bg-emerald-600 text-white" 
              : "bg-slate-200 text-slate-700 hover:bg-slate-200"
          )}
        >
          {badge > 99 ? '99+' : badge}
        </Badge>
      )}

      {isActive && (
        <span className="sm:hidden w-1.5 h-1.5 rounded-full bg-emerald-600" />
      )}
    </button>
  );
}

// Tab Panel Component (content area for each tab)
interface TabPanelProps {
  id: TabId;
  isActive: boolean;
  children: React.ReactNode;
  className?: string;
}

export function TabPanel({ id, isActive, children, className }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      id={`tabpanel-${id}`}
      aria-labelledby={`tab-${id}`}
      hidden={!isActive}
      className={cn(
        "animate-in fade-in-50 duration-200",
        className
      )}
    >
      {children}
    </div>
  );
}

// Compact Tab Navigation (icon-only, for constrained spaces)
interface CompactTabNavigationProps {
  tabs: TabConfig[];
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function CompactTabNavigation({
  tabs,
  activeTab,
  onTabChange,
  orientation = 'horizontal',
  className
}: CompactTabNavigationProps) {
  return (
    <nav
      className={cn(
        "flex gap-1 bg-white",
        orientation === 'vertical' ? "flex-col" : "flex-row",
        className
      )}
      role="tablist"
    >
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-label={tab.label}
            title={tab.label}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative p-3 rounded-lg transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
              isActive
                ? "bg-emerald-50 text-emerald-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <Icon className="w-5 h-5" />
            
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className={cn(
                "absolute -top-1 -right-1 h-5 min-w-5 px-1.5 rounded-full text-xs font-medium flex items-center justify-center",
                isActive
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-300 text-slate-700"
              )}>
                {tab.badge > 99 ? '99+' : tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
