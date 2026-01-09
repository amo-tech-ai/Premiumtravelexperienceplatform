/**
 * DASHBOARD FILTERS - Bottom Sheet Implementation
 * 
 * Universal filter system for all dashboards using bottom sheets
 * Provides consistent filtering UX across Trips, Events, Restaurants, Rentals
 */

import React, { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { TouchTargetButton } from '../mobile/TouchTarget';
import { FilterBottomSheet } from '../ui/BottomSheet';

export interface FilterOption {
  id: string;
  label: string;
  value: any;
  type: 'checkbox' | 'radio' | 'range' | 'toggle' | 'date';
}

export interface FilterGroup {
  id: string;
  label: string;
  type: 'checkbox' | 'radio' | 'range' | 'toggle' | 'date';
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
  value?: any;
}

interface DashboardFiltersProps {
  filters: FilterGroup[];
  activeFilters: Record<string, any>;
  onApplyFilters: (filters: Record<string, any>) => void;
  onClearFilters: () => void;
  className?: string;
}

export function DashboardFilters({
  filters,
  activeFilters,
  onApplyFilters,
  onClearFilters,
  className = '',
}: DashboardFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(activeFilters);

  // Count active filters
  const activeFilterCount = Object.entries(activeFilters).filter(([key, value]) => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'boolean') return value;
    return value !== null && value !== undefined && value !== '';
  }).length;

  const handleFilterChange = (groupId: string, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [groupId]: value,
    }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    setIsOpen(false);
  };

  const handleClear = () => {
    const clearedFilters: Record<string, any> = {};
    filters.forEach(group => {
      if (group.type === 'checkbox') {
        clearedFilters[group.id] = [];
      } else if (group.type === 'toggle') {
        clearedFilters[group.id] = false;
      } else {
        clearedFilters[group.id] = null;
      }
    });
    setLocalFilters(clearedFilters);
    onClearFilters();
  };

  return (
    <>
      {/* Filter Trigger Button */}
      <TouchTargetButton
        variant="ghost"
        size="md"
        onClick={() => setIsOpen(true)}
        className={`relative ${className}`}
        aria-label={`Filters ${activeFilterCount > 0 ? `(${activeFilterCount} active)` : ''}`}
      >
        <SlidersHorizontal className="w-5 h-5" />
        {activeFilterCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs font-semibold rounded-full flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </TouchTargetButton>

      {/* Filter Bottom Sheet */}
      <FilterBottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onApply={handleApply}
        onClear={handleClear}
        activeFilterCount={activeFilterCount}
      >
        <div className="space-y-6">
          {filters.map(group => (
            <FilterGroupComponent
              key={group.id}
              group={group}
              value={localFilters[group.id]}
              onChange={(value) => handleFilterChange(group.id, value)}
            />
          ))}
        </div>
      </FilterBottomSheet>
    </>
  );
}

/**
 * Individual Filter Group Component
 */
interface FilterGroupComponentProps {
  group: FilterGroup;
  value: any;
  onChange: (value: any) => void;
}

function FilterGroupComponent({ group, value, onChange }: FilterGroupComponentProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border-b border-gray-200 pb-6 last:border-0">
      {/* Group Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full mb-3"
      >
        <h3 className="text-base font-semibold text-gray-900">{group.label}</h3>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Group Content */}
      {isExpanded && (
        <div className="space-y-2">
          {group.type === 'checkbox' && (
            <CheckboxGroup
              options={group.options || []}
              value={value || []}
              onChange={onChange}
            />
          )}
          
          {group.type === 'radio' && (
            <RadioGroup
              options={group.options || []}
              value={value}
              onChange={onChange}
            />
          )}
          
          {group.type === 'range' && (
            <RangeSlider
              min={group.min || 0}
              max={group.max || 100}
              step={group.step || 1}
              value={value || [group.min || 0, group.max || 100]}
              onChange={onChange}
            />
          )}
          
          {group.type === 'toggle' && (
            <ToggleSwitch
              label={group.options?.[0]?.label || ''}
              value={value || false}
              onChange={onChange}
            />
          )}
        </div>
      )}
    </div>
  );
}

/**
 * CHECKBOX GROUP
 */
interface CheckboxGroupProps {
  options: FilterOption[];
  value: string[];
  onChange: (value: string[]) => void;
}

function CheckboxGroup({ options, value, onChange }: CheckboxGroupProps) {
  const handleToggle = (optionId: string) => {
    if (value.includes(optionId)) {
      onChange(value.filter(id => id !== optionId));
    } else {
      onChange([...value, optionId]);
    }
  };

  return (
    <div className="space-y-1">
      {options.map(option => (
        <label
          key={option.id}
          className="flex items-center gap-3 min-h-[48px] cursor-pointer hover:bg-gray-50 rounded-lg px-2 transition-colors"
        >
          <input
            type="checkbox"
            checked={value.includes(option.id)}
            onChange={() => handleToggle(option.id)}
            className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">{option.label}</span>
        </label>
      ))}
    </div>
  );
}

/**
 * RADIO GROUP
 */
interface RadioGroupProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

function RadioGroup({ options, value, onChange }: RadioGroupProps) {
  return (
    <div className="space-y-1">
      {options.map(option => (
        <label
          key={option.id}
          className="flex items-center gap-3 min-h-[48px] cursor-pointer hover:bg-gray-50 rounded-lg px-2 transition-colors"
        >
          <input
            type="radio"
            checked={value === option.id}
            onChange={() => onChange(option.id)}
            className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">{option.label}</span>
        </label>
      ))}
    </div>
  );
}

/**
 * RANGE SLIDER
 */
interface RangeSliderProps {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

function RangeSlider({ min, max, step, value, onChange }: RangeSliderProps) {
  const [localMin, localMax] = value;

  const formatValue = (val: number) => {
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`;
    return `$${val}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-900">{formatValue(localMin)}</span>
        <span className="text-gray-500">to</span>
        <span className="font-medium text-gray-900">{formatValue(localMax)}</span>
      </div>
      
      <div className="space-y-3">
        {/* Min Slider */}
        <input
          type="range"
          min={min}
          max={localMax}
          step={step}
          value={localMin}
          onChange={(e) => onChange([Number(e.target.value), localMax])}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        
        {/* Max Slider */}
        <input
          type="range"
          min={localMin}
          max={max}
          step={step}
          value={localMax}
          onChange={(e) => onChange([localMin, Number(e.target.value)])}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  );
}

/**
 * TOGGLE SWITCH
 */
interface ToggleSwitchProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

function ToggleSwitch({ label, value, onChange }: ToggleSwitchProps) {
  return (
    <label className="flex items-center justify-between min-h-[48px] cursor-pointer">
      <span className="text-sm text-gray-700">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          ${value ? 'bg-blue-600' : 'bg-gray-300'}
        `}
        role="switch"
        aria-checked={value}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            ${value ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </label>
  );
}
